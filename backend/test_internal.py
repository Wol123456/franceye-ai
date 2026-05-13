import asyncio
from main import scrape_google_maps, calculate_score

async def run():
    g_data = await scrape_google_maps("Akınsoft İstanbul")
    print("Scraped Reviews:", g_data.get("reviews"))
    final_reviews = g_data.get("reviews")
    if not final_reviews:
        print("Fallback would be triggered. final_reviews is:", type(final_reviews), repr(final_reviews))
    else:
        print("Fallback NOT triggered. final_reviews is truthy.")

asyncio.run(run())
