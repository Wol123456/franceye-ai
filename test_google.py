import urllib.request
import urllib.parse
import json
import os

API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyD7WnKI4xrGDLV83_CBhdM5mkIWPeM_3qI")
query = "Oses Çiğköfte 40.990, 29.025"
url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={urllib.parse.quote(query)}&key={API_KEY}"
with urllib.request.urlopen(url) as res:
    data = json.loads(res.read().decode())
    for r in data.get("results", [])[:2]:
        print(r["name"], r.get("formatted_address"))
