import re

def main():
    # 1. Update google_api_client.py
    client_path = "/Users/user/.gemini/antigravity/scratch/backend/google_api_client.py"
    with open(client_path, "r", encoding="utf-8") as f:
        client_code = f.read()
        
    client_code = client_code.replace(
        "def search_places(query: str, city: str = None):",
        "def search_places(query: str, city: str = None, lat: float = None, lng: float = None):"
    )
    
    do_search_old = """    def _do_search(q: str):
        params = {"query": q, "key": API_KEY, "language": "tr"}
        url = f"{base_url}?{urllib.parse.urlencode(params)}\""""
        
    do_search_new = """    def _do_search(q: str):
        params = {"query": q, "key": API_KEY, "language": "tr"}
        if lat is not None and lng is not None:
            params["location"] = f"{lat},{lng}"
            params["radius"] = "5000"
        url = f"{base_url}?{urllib.parse.urlencode(params)}\""""
        
    client_code = client_code.replace(do_search_old, do_search_new)
    
    fetch_google_old = """def fetch_google_data(query: str = None, place_id: str = None):"""
    fetch_google_new = """def fetch_google_data(query: str = None, place_id: str = None, lat: float = None, lng: float = None):"""
    client_code = client_code.replace(fetch_google_old, fetch_google_new)
    
    candidates_old = """        candidates = search_places(query)"""
    candidates_new = """        candidates = search_places(query, lat=lat, lng=lng)"""
    client_code = client_code.replace(candidates_old, candidates_new)
    
    with open(client_path, "w", encoding="utf-8") as f:
        f.write(client_code)
        
    # 2. Update main.py
    main_path = "/Users/user/.gemini/antigravity/scratch/backend/main.py"
    with open(main_path, "r", encoding="utf-8") as f:
        main_code = f.read()
        
    branch_req_old = """class BranchRequest(BaseModel):
    branch_name: str
    location_query: str 
    place_id: str = None 
    target_date: str = None # ISO Format YYYY-MM-DD"""
    
    branch_req_new = """class BranchRequest(BaseModel):
    branch_name: str
    location_query: str 
    place_id: str = None 
    target_date: str = None # ISO Format YYYY-MM-DD
    lat: float = None
    lng: float = None"""
    
    main_code = main_code.replace(branch_req_old, branch_req_new)
    
    scrape_old = """async def scrape_google_maps(query: str, place_id: str = None, target_date_str: str = None):"""
    scrape_new = """async def scrape_google_maps(query: str, place_id: str = None, target_date_str: str = None, lat: float = None, lng: float = None):"""
    main_code = main_code.replace(scrape_old, scrape_new)
    
    fetch_old = """    api_data = fetch_google_data(query=query, place_id=place_id)"""
    fetch_new = """    api_data = fetch_google_data(query=query, place_id=place_id, lat=lat, lng=lng)"""
    main_code = main_code.replace(fetch_old, fetch_new)
    
    analyze_old = """        g_data = await scrape_google_maps(request.location_query, request.place_id, request.target_date)"""
    analyze_new = """        g_data = await scrape_google_maps(request.location_query, request.place_id, request.target_date, request.lat, request.lng)"""
    main_code = main_code.replace(analyze_old, analyze_new)
    
    with open(main_path, "w", encoding="utf-8") as f:
        f.write(main_code)
        
    print("Backend patched for location search successfully.")

if __name__ == "__main__":
    main()
