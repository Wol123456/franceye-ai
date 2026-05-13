import urllib.request
import json

data = json.dumps({
    "branch_name": "Starbucks",
    "location_query": "Starbucks Kadikoy"
}).encode('utf-8')

req = urllib.request.Request('http://localhost:8002/analyze', data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read().decode('utf-8'))
        reviews = res_data.get('reviews', [])
        print(f"Reviews count: {len(reviews)}")
        if reviews:
            print("First review:", list(reviews[0].keys()))
except Exception as e:
    print("Error:", e)
