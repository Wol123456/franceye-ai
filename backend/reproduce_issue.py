import asyncio
from google_maps_parser import scrape_google_maps_data

async def main():
    # A real Google Maps Place URL
    url = "https://www.google.com/maps/place/Kahve+D%C3%BCnyas%C4%B1+-+Veliefendi/@40.989782,28.8918231,17z/data=!3m1!4b1!4m6!3m5!1s0x14cabc3207039a03:0x8935c36195701887!8m2!3d40.989782!4d28.894398!16s%2Fg%2F11b6hc8k65?entry=ttu&hl=en"
    print(f"Testing URL: {url}")
    data = await scrape_google_maps_data(url)
    print("Result:", data)
    
async def debug_page_check():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=["--lang=en-US"])
        context = await browser.new_context(viewport={"width": 1920, "height": 1080})
        page = await context.new_page()
        # Search URL
        search_query = "Kahve Dünyası - Veliefendi"
        url = f"https://www.google.com/maps/search/{search_query.replace(' ', '+')}?hl=en"
        print(f"Navigating to {url}")
        
        await page.goto(url, wait_until="domcontentloaded")
        await page.wait_for_timeout(5000)
        
        # Check if we need to click a result (if it didn't redirect)
        # Often it shows a list.
        # Check for "HF" class or similar for results, or H1
        
        # Save HTML
        with open("debug_page.html", "w", encoding="utf-8") as f:
            f.write(await page.content())
        print("Saved debug_page.html")
         
        await page.wait_for_timeout(5000)
        content = await page.inner_text("body")
        
        # Check H1
        h1 = await page.locator("h1").all_inner_texts()
        
        with open("debug_output.txt", "w", encoding="utf-8") as f:
            f.write(f"Page Title: {await page.title()}\n")
            f.write(f"Current URL: {page.url}\n")
            f.write(f"H1 Tags: {h1}\n")
            f.write("--- Body Text Start ---\n")
            f.write(content[:2000])
            f.write("\n--- Body Text End ---\n")
        
        print("Debug output written to debug_output.txt")
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
    # asyncio.run(debug_page_check())
