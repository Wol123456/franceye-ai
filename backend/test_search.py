import asyncio
from main import search_places
import json

def run():
    print("Testing 'akinsoft istanbul'")
    res1 = search_places("akinsoft istanbul")
    print(f"Result count: {len(res1)}")
    for r in res1:
        print(f" - {r['name']} ({r['address']})")

    print("\nTesting 'Akınsoft istanbul'")
    res2 = search_places("Akınsoft istanbul")
    print(f"Result count: {len(res2)}")
    for r in res2:
        print(f" - {r['name']} ({r['address']})")

    print("\nTesting 'akinsoft'")
    res3 = search_places("akinsoft")
    print(f"Result count: {len(res3)}")
    for r in res3:
        print(f" - {r['name']} ({r['address']})")

if __name__ == "__main__":
    run()
