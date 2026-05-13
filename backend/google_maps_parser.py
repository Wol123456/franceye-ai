from playwright.async_api import async_playwright
import re
import asyncio
import json

async def scrape_google_maps_data(url: str):
    """
    Extracts Rating, Review Count, Popular Times, and Coordinates from Google Maps.
    """
    async with async_playwright() as p:
        # Launch with English locale
        browser = await p.chromium.launch(headless=True, args=["--lang=en-US"])
        context = await browser.new_context(
            locale="en-US",
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        
        print(f"Navigating to: {url}")
        
        # Ensure regex extraction works by forcing English
        if "hl=en" not in url:
             url += "&hl=en" if "?" in url else "?hl=en"

        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=45000)
            # Short sleep to allow JS to hydrate
            await asyncio.sleep(3)
            
            # Consent Popup (Fast check)
            try:
                consent_button = page.locator('button[aria-label*="Reject"], button[aria-label*="Accept"], span:has-text("Reject all")').first
                if await consent_button.is_visible(timeout=2000):
                    await consent_button.click()
                    await asyncio.sleep(1)
            except: pass

        except Exception as e:
            print(f"Navigation warning: {e}")

        data = {
            "score": 0.0,
            "review_count": 0,
            "popular_times": [0] * 24,
            "coords": {"lat": 0, "lng": 0},
            "url": url
        }

        # --- STRATEGY 1: APP_INITIALIZATION_STATE (Most Reliable for Hidden Data) ---
        try:
            content = await page.content()
            # This variable often holds the initial places data
            match = re.search(r'window\.APP_INITIALIZATION_STATE\s*=\s*(\[.+?\]);', content)
            if match:
                json_str = match.group(1)
                # Parse loosely or search regex within it
                # Looking for: [4.4, 1234, ...] usually in that order near each other
                
                # Regex for Rating: 1.0 to 5.0
                # Regex for Count: Integer > 10
                
                # Contextual search: "Starbucks" -> ... -> 4.4, 1234
                # We'll use a specific regex that often matches the rating tuple in Google's array structure
                # Pattern: replace float with specific constraints
                
                # Regex for Rating: 1.0 to 5.0 (float or int) followed by integer count
                # Pattern: "4.5, 1023" or "5, 10"
                
                # Check for: float/int between 1-5, comma, whitespace?, int > 5
                rating_matches = re.findall(r'([0-5](?:\.\d)?),\s*(\d{1,6})', json_str)
                
                print(f"DEBUG: Found {len(rating_matches)} potential matches in APP_STATE")
                
                for r, c in rating_matches:
                    try:
                        score = float(r)
                        count = int(c)
                        
                        # Heuristic: Valid score 1-5, valid count > 5
                        if 1.0 <= score <= 5.0 and count > 5:
                             # Generally the main place has the highest review count on the page
                             if count > data["review_count"]:
                                 data["score"] = score
                                 data["review_count"] = count
                    except: continue
                
                if data["score"] > 0:
                     print(f"DEBUG: Found score in APP_STATE: {data['score']} ({data['review_count']} reviews)")

        except Exception as e:
            print(f"Error parsing APP_STATE: {e}")

        # --- DEBUG DUMP IF FAILED ---
        if data["score"] == 0:
             print("DEBUG: Scraper failed to find score. Dumping HTML...")
             try:
                 with open("debug_fail_page.html", "w", encoding="utf-8") as f:
                     f.write(await page.content())
             except: pass


        # --- STRATEGY 2: VISIBLE META TAGS (Fast Fallback) ---
        if data["score"] == 0:
            try:
                # Don't wait long
                meta_rating = page.locator('meta[itemprop="ratingValue"]')
                if await meta_rating.count() > 0:
                    val = await meta_rating.get_attribute("content")
                    data["score"] = float(val.replace(',', '.'))
                    
                meta_count = page.locator('meta[itemprop="ratingCount"]')
                if await meta_count.count() > 0:
                    val = await meta_count.get_attribute("content")
                    data["review_count"] = int(val.replace(',', '').replace('.', ''))
                    
                if data["score"] > 0:
                    print("DEBUG: Found score in META tags.")
            except: pass

        # --- STRATEGY 3: ARIA LABELS ---
        if data["score"] == 0:
            try:
                # Look for stars
                stars = page.locator('div[role="img"][aria-label*="stars"], div[role="img"][aria-label*="yıldız"]').first
                if await stars.count() > 0:
                    label = await stars.get_attribute("aria-label")
                    # "4.2 stars 1,023 Reviews"
                    m = re.search(r'(\d[\.,]\d)', label)
                    if m: data["score"] = float(m.group(1).replace(',', '.'))
                    
                    m2 = re.search(r'(\d[\d,]+)', label) # Simple number search might match rating first, be careful
                    # Actually review count usually follows
                    # ignored for now if above works
            except: pass

        # --- EXTRACT COORDS ---
        try:
            url_final = page.url
            coords = re.search(r'@(-?\d+\.\d+),(-?\d+\.\d+)', url_final)
            if coords:
                data["coords"]["lat"] = float(coords.group(1))
                data["coords"]["lng"] = float(coords.group(2))
        except: pass

        # --- EXTRACT POPULAR TIMES ---
        try:
            # We look for aria-labels of the bars
            bars = await page.locator('div[aria-label*="busy"][role="img"]').all()
            if bars:
                hourly_data = [0] * 24
                for bar in bars:
                    label = await bar.get_attribute("aria-label")
                    # "35% busy at 6 AM."
                    pct_m = re.search(r'(\d+)%', label)
                    time_m = re.search(r'at\s*(\d+)\s*(AM|PM)', label)
                    
                    if pct_m and time_m:
                        val = int(pct_m.group(1))
                        h = int(time_m.group(1))
                        meridiem = time_m.group(2)
                        
                        if meridiem == "PM" and h != 12: h += 12
                        if meridiem == "AM" and h == 12: h = 0
                        if 0 <= h < 24: hourly_data[h] = val
                
                if sum(hourly_data) > 0:
                    data["popular_times"] = hourly_data
        except: pass

        await browser.close()
        return data
