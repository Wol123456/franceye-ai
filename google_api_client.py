import urllib.request
import urllib.parse
import json

API_KEY = "AIzaSyChGsI4E7zRwVqSB4DTp1tmxKKYMhPTLC8"

def search_places(query: str, city: str = None):
    """
    Search for places by text query and return a list of simplified place objects.
    """
    base_url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {
        "query": query,
        "key": API_KEY,
        "language": "tr"
    }
    url = f"{base_url}?{urllib.parse.urlencode(params)}"
    
    try:
        with urllib.request.urlopen(url, timeout=5) as response:
            data = json.loads(response.read().decode())
            if data.get("status") == "OK":
                results = []
                for item in data.get("results", []):
                    address = item.get("formatted_address", "")
                    
                    # Strict City Filtering
                    if city and city.lower() not in address.lower():
                        continue
                        
                    results.append({
                        "place_id": item["place_id"],
                        "name": item["name"],
                        "address": address,
                        "rating": item.get("rating", 0),
                        "user_ratings_total": item.get("user_ratings_total", 0)
                    })
                    if len(results) >= 10:
                        break
                return results
            else:
                print(f"API Search Warning: {data.get('status')}")
                return []
    except Exception as e:
        print(f"API Search Error: {e}")
        return []

def get_place_details(place_id: str):
    """
    Get detailed info (rating, reviews, geometry) for a Place ID.
    """
    base_url = "https://maps.googleapis.com/maps/api/place/details/json"
    # Fields: name, rating, user_ratings_total, geometry, reviews, website
    params = {
        "place_id": place_id,
        "fields": "name,rating,user_ratings_total,geometry,reviews,photos,website",
        "key": API_KEY,
        "language": "tr"
    }
    url = f"{base_url}?{urllib.parse.urlencode(params)}"
    
    try:
        print(f"DEBUG: Requesting {base_url} for place_id {place_id}", flush=True)
        with urllib.request.urlopen(url, timeout=5) as response:
            print("DEBUG: Google API Details Response received", flush=True)
            data = json.loads(response.read().decode())
            if data.get("status") == "OK":
                return data["result"]
            else:
                print(f"API Details Warning: {data.get('status')}")
                return None
    except Exception as e:
        print(f"API Details Error: {e}")
        return None

def fetch_google_data(query: str = None, place_id: str = None):
    # 1. Determine Place ID
    target_id = place_id
    
    if not target_id and query:
        # Backward compatibility or fallback: Search for single best match
        # Reuse search_places logic but just take first ID
        candidates = search_places(query)
        if candidates:
            target_id = candidates[0]["place_id"]
            
    if not target_id:
        return None
        
    # 2. Details
    details = get_place_details(target_id)
    if not details:
        return None
        
    # 3. Format
    formatted_data = {
        "name": details.get("name", ""),
        "score": details.get("rating", 0.0),
        "review_count": details.get("user_ratings_total", 0),
        "coords": details.get("geometry", {}).get("location", {"lat": 0, "lng": 0}),
        "reviews": details.get("reviews", []),
        "url": f"https://www.google.com/maps/place/?q=place_id:{target_id}",
        "website": details.get("website", "")
    }
    
    return formatted_data
