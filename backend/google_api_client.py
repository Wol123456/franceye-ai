import urllib.request
import urllib.parse
import json

API_KEY = "AIzaSyD7WnKI4xrGDLV83_CBhdM5mkIWPeM_3qI"

def search_places(query: str, city: str = None):
    """
    Search for places by text query and return a list of simplified place objects.
    """
    base_url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    
    def _do_search(q: str):
        params = {"query": q, "key": API_KEY, "language": "tr"}
        url = f"{base_url}?{urllib.parse.urlencode(params)}"
        try:
            with urllib.request.urlopen(url, timeout=5) as response:
                data = json.loads(response.read().decode())
                if data.get("status") == "OK":
                    return data.get("results", [])
        except Exception as e:
            print(f"API Search Error for {q}: {e}")
        return []

    # 1. İlk olarak kullanıcının tam sorgusunu (örn: "Atom master şubeleri Antalya") arıyoruz
    raw_results = _do_search(query)
    
    # 2. Eğer marka 2 veya daha fazla kelimeden oluşuyorsa, Google bunu zincir şube olarak 
    # algılamayıp sadece en popüler 1 şubeyi getirebiliyor. 
    # Çözüm: Markanın sadece İLK kelimesiyle geniş bir arama yapıp, sonuçları birleştiriyoruz.
    brand_part = query.split(" şubeleri ")[0] if " şubeleri " in query else query
    
    if " " in brand_part:
        first_word = brand_part.split(" ")[0]
        fallback_query = query.replace(brand_part, first_word, 1)
        fallback_results = _do_search(fallback_query)
        raw_results.extend(fallback_results)

    # 3. Sonuçları birleştir, city filtresini uygula ve tekrarları (place_id) temizle
    results = []
    seen_ids = set()
    seen_addresses = set()
    
    for item in raw_results:
        # Sadece aranan tam marka adını içerenleri ekle (AVM'ler veya rakipler elenir)
        if brand_part.lower() not in item.get("name", "").lower():
            continue
            
        place_id = item["place_id"]
        address = item.get("formatted_address", "")
        
        # Normalize address to catch Google's duplicate place entries
        clean_address = address.lower().strip()
        
        if place_id in seen_ids or clean_address in seen_addresses:
            continue
            
        # Strict City Filtering
        if city and city.lower() not in address.lower():
            continue
            
        seen_ids.add(place_id)
        if clean_address:
            seen_addresses.add(clean_address)
            
        results.append({
            "place_id": place_id,
            "name": item["name"],
            "address": address,
            "rating": item.get("rating", 0),
            "user_ratings_total": item.get("user_ratings_total", 0)
        })
        
        if len(results) >= 20: # Max 20 results
            break
            
    return results

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
