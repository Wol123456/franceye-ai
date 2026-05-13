import requests
import json

res = requests.post("http://localhost:8002/analyze", json={
    "branch_name": "Akınsoft",
    "location_query": "Akınsoft İstanbul"
})

try:
    data = res.json()
    print("Reviews Length:", len(data.get("reviews", [])))
    print("Reviews:", json.dumps(data.get("reviews", []), indent=2, ensure_ascii=False))
except Exception as e:
    print("Error:", e, res.text)
