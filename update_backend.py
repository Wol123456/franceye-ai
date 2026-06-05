import re
import sys

def main():
    file_path = "/Users/user/.gemini/antigravity/scratch/backend/main.py"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Add trend_keywords and action_plan to AnalysisResult
    result_model_str = """class AnalysisResult(BaseModel):
    branch_name: str
    place_id: str = ""
    health_score: float
    health_analysis: str
    metrics: Dict[str, Any]
    ratings: List[Dict[str, Any]]

    coords: Dict[str, float]
    analysis_date: str
    reviews: List[Dict[str, Any]] = []
    rating_distribution: Dict[str, int] = {}
    map_url: str = ""
    website: str = ""
    score_history: List[Dict[str, Any]] = []
    critical_alerts: List[Dict[str, str]] = []
    manager_phone: str = ""
"""
    
    new_result_model_str = """class AnalysisResult(BaseModel):
    branch_name: str
    place_id: str = ""
    health_score: float
    health_analysis: str
    metrics: Dict[str, Any]
    ratings: List[Dict[str, Any]]

    coords: Dict[str, float]
    analysis_date: str
    reviews: List[Dict[str, Any]] = []
    rating_distribution: Dict[str, int] = {}
    map_url: str = ""
    website: str = ""
    score_history: List[Dict[str, Any]] = []
    critical_alerts: List[Dict[str, str]] = []
    manager_phone: str = ""
    trend_keywords: List[Dict[str, Any]] = []
    action_plan: List[Dict[str, Any]] = []
"""
    content = content.replace(result_model_str, new_result_model_str)

    # Add AI Generators
    generators_str = """
# --- AI Generators ---
def generate_trend_keywords(reviews):
    if not reviews:
        return []
    
    # Mock NLP extraction
    words = {"yavaş": -20, "soğuk": -15, "hızlı": 30, "lezzetli": 40, "güler yüzlü": 25, "kaba": -25, "temiz": 15, "pis": -30, "sıcak": 20, "kurye": -10}
    text = " ".join([r.get("text", "").lower() for r in reviews])
    
    results = []
    for word, sentiment in words.items():
        count = text.count(word)
        if count > 0:
            results.append({"word": word.upper(), "count": count, "sentiment": "positive" if sentiment > 0 else "negative"})
            
    return sorted(results, key=lambda x: x["count"], reverse=True)[:6]

def generate_action_plan(alerts):
    plan = []
    categories = set([a["category"] for a in alerts])
    
    if "Hız" in categories:
        plan.append({"task": "Kurye rotalarını optimize et ve mutfak çıkış hızını ölç.", "completed": False})
    if "Personel" in categories:
        plan.append({"task": "Müşteri ilişkileri ve güler yüz eğitimi düzenle.", "completed": False})
    if "Temizlik" in categories:
        plan.append({"task": "Günlük mutfak ve salon hijyen denetimlerini sıklaştır.", "completed": False})
    if "Fiyat" in categories:
        plan.append({"task": "Bölgesel rakip fiyat analizlerini tekrar gözden geçir.", "completed": False})
    if "Trend Alarmı" in categories:
        plan.append({"task": "Şube müdürü ile acil durum toplantısı organize et.", "completed": False})
        
    if not plan:
        plan.append({"task": "Mevcut yüksek standartları korumaya devam et.", "completed": False})
        
    return plan

"""
    
    # Insert before calculate_score
    calc_score_idx = content.find("# --- Scoring Logic")
    if calc_score_idx != -1:
        content = content[:calc_score_idx] + generators_str + content[calc_score_idx:]

    # Modify search_branches to include health_score
    search_branches_str = """@app.post("/search_branches")
async def search_branches(request: SearchRequest):
    \"\"\"
    Returns a list of branches matching the query.
    \"\"\"
    print(f"Searching for: {request.query} in city: {request.city}")
    results = search_places(request.query, request.city)
    return results"""
    
    new_search_branches_str = """@app.post("/search_branches")
async def search_branches(request: SearchRequest):
    \"\"\"
    Returns a list of branches matching the query.
    \"\"\"
    print(f"Searching for: {request.query} in city: {request.city}")
    results = search_places(request.query, request.city)
    for r in results:
        r["health_score"] = calculate_score({"score": r.get("rating", 0), "review_count": r.get("user_ratings_total", 0)})
    
    # Sort results by health score for leaderboard
    results = sorted(results, key=lambda x: x.get("health_score", 0), reverse=True)
    return results"""
    content = content.replace(search_branches_str, new_search_branches_str)

    # Modify analyze_branch to return new fields
    return_dict_str = """        return {
            "branch_name": final_name,
            "place_id": request.place_id or "",
            "health_score": health_score,
            "health_analysis": analysis_text,
            "metrics": {
                "google_reviews": g_data["review_count"],
                "recent_rating": round(health_score / 20.0, 1) # Approximate 5-star equivalent of health score
            },
            "ratings": [
                {"source": "Google Maps", "score": g_data["score"], "max": 5},
                {"source": "Algoritma", "score": health_score, "max": 100}
            ],

            "coords": g_data["coords"],
            "analysis_date": request.target_date or datetime.now().isoformat(),
            "reviews": final_reviews,
            "rating_distribution": g_data.get("rating_distribution", {}),
            "map_url": final_url,
            "website": g_data.get("website", ""),
            "score_history": score_history,
            "critical_alerts": critical_alerts,
            "manager_phone": manager_phone
        }"""
        
    new_return_dict_str = """        return {
            "branch_name": final_name,
            "place_id": request.place_id or "",
            "health_score": health_score,
            "health_analysis": analysis_text,
            "metrics": {
                "google_reviews": g_data["review_count"],
                "recent_rating": round(health_score / 20.0, 1) # Approximate 5-star equivalent of health score
            },
            "ratings": [
                {"source": "Google Maps", "score": g_data["score"], "max": 5},
                {"source": "Algoritma", "score": health_score, "max": 100}
            ],

            "coords": g_data["coords"],
            "analysis_date": request.target_date or datetime.now().isoformat(),
            "reviews": final_reviews,
            "rating_distribution": g_data.get("rating_distribution", {}),
            "map_url": final_url,
            "website": g_data.get("website", ""),
            "score_history": score_history,
            "critical_alerts": critical_alerts,
            "manager_phone": manager_phone,
            "trend_keywords": generate_trend_keywords(final_reviews),
            "action_plan": generate_action_plan(critical_alerts)
        }"""
        
    content = content.replace(return_dict_str, new_return_dict_str)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

    print("Backend updated successfully!")

if __name__ == "__main__":
    main()
