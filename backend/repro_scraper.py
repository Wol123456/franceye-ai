import asyncio
from google_maps_parser import scrape_google_maps_data

async def main():
    # Example URL: Starbucks (should have ratings and popular times)
    url = "https://www.google.com/maps/place/Starbucks/@41.0260408,29.1172778,17z/data=!4m15!1m8!3m7!1s0x14cac8838a6a6e5b:0x51c769b82833890f!2sStarbucks!8m2!3d41.0260368!4d29.1198527!10e5!16s%2Fg%2F11b6gj_l31!3m5!1s0x14cac8838a6a6e5b:0x51c769b82833890f!8m2!3d41.0260368!4d29.1198527!16s%2Fg%2F11b6gj_l31?hl=en"
    
    print(f"Testing scraper with URL: {url}")
    data = await scrape_google_maps_data(url)
    print("Scraper Result:")
    print(data)
    
    if data["score"] > 0 and data["review_count"] > 0:
        print("SUCCESS: Scraper extracted data.")
    else:
        print("FAILURE: Scraper failed to extract score/reviews.")

if __name__ == "__main__":
    asyncio.run(main())
