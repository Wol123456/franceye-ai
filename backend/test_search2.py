import asyncio
from google_api_client import search_places

def run():
    queries = [
        "akinsoft istanbul",
        "akinsoft bayi istanbul",
        "akinsoft şubeleri istanbul",
        "akinsoft",
    ]
    for q in queries:
        print(f"\nTesting '{q}'")
        res = search_places(q)
        print(f"Result count: {len(res)}")
        for i, r in enumerate(res):
            print(f" {i+1}. {r['name']} ({r['address']})")

if __name__ == "__main__":
    run()
