import urllib.request
import urllib.parse
import json

API_KEY = "AIzaSyD7WnKI4xrGDLV83_CBhdM5mkIWPeM_3qI"

def test(query):
    base_url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {"query": query, "key": API_KEY, "language": "tr"}
    url = f"{base_url}?{urllib.parse.urlencode(params)}"
    with urllib.request.urlopen(url, timeout=5) as response:
        data = json.loads(response.read().decode())
        for r in data.get("results", []):
            print(r["name"], "|||", r.get("formatted_address"))
            print("ID:", r["place_id"])
            print("---")

print("Query 1: Espressolab şubeleri Konya")
test("Espressolab şubeleri Konya")
print("\nQuery 2: Espressolab Konya")
test("Espressolab Konya")
