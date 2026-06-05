import re

def main():
    # 1. Update main.py
    main_path = "/Users/user/.gemini/antigravity/scratch/backend/main.py"
    with open(main_path, "r", encoding="utf-8") as f:
        main_code = f.read()

    # Add address to AnalysisResult
    result_old = """class AnalysisResult(BaseModel):
    branch_name: str
    place_id: str = ""
    health_score: float"""
    
    result_new = """class AnalysisResult(BaseModel):
    branch_name: str
    address: str = ""
    place_id: str = ""
    health_score: float"""
    main_code = main_code.replace(result_old, result_new)

    # Return address in analyze_branch
    return_old = """        return {
            "branch_name": final_name,
            "place_id": request.place_id or "","""
            
    return_new = """        return {
            "branch_name": final_name,
            "address": g_data.get("address", ""),
            "place_id": request.place_id or "","""
    main_code = main_code.replace(return_old, return_new)
    
    with open(main_path, "w", encoding="utf-8") as f:
        f.write(main_code)

    # 2. Update google_api_client.py
    client_path = "/Users/user/.gemini/antigravity/scratch/backend/google_api_client.py"
    with open(client_path, "r", encoding="utf-8") as f:
        client_code = f.read()
        
    fields_old = """        "fields": "name,rating,user_ratings_total,geometry,reviews,photos,website,formatted_phone_number","""
    fields_new = """        "fields": "name,rating,user_ratings_total,geometry,reviews,photos,website,formatted_phone_number,formatted_address","""
    client_code = client_code.replace(fields_old, fields_new)
    
    formatted_old = """    formatted_data = {
        "name": details.get("name", ""),
        "score": details.get("rating", 0.0),"""
        
    formatted_new = """    formatted_data = {
        "name": details.get("name", ""),
        "address": details.get("formatted_address", ""),
        "score": details.get("rating", 0.0),"""
    client_code = client_code.replace(formatted_old, formatted_new)

    with open(client_path, "w", encoding="utf-8") as f:
        f.write(client_code)
        
    print("Backend address field patched successfully.")

if __name__ == "__main__":
    main()
