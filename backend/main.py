from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import random
import math

# Import the Real Scraper
# Note: In a real app, use async/await for scraping or Celery. Here we call sync structure for PoC simplicity.
# from google_maps_parser import scrape_google_maps_data
from google_api_client import fetch_google_data, search_places
from datetime import datetime, timedelta
import random

# --- App Setup ---
app = FastAPI(title="FrancEye AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---
class SearchRequest(BaseModel):
    query: str
    city: str = None

class BranchRequest(BaseModel):
    branch_name: str
    location_query: str 
    place_id: str = None 
    target_date: str = None # ISO Format YYYY-MM-DD

class ComplaintLog(BaseModel):
    branch_name: str
    message: str
    type: str
    date: str

class AnalysisResult(BaseModel):
    branch_name: str
    health_score: float
    health_analysis: str
    metrics: Dict[str, Any]
    ratings: List[Dict[str, Any]]
    popular_times: List[int]
    coords: Dict[str, float]
    analysis_date: str
    reviews: List[Dict[str, Any]] = []
    rating_distribution: Dict[str, int] = {}
    map_url: str = ""
    website: str = ""
    score_history: List[Dict[str, Any]] = []
    critical_alerts: List[Dict[str, str]] = []
    manager_phone: str = ""

# --- Real vs Mock logic wrapper ---
MOCK_REVIEWS_DB = [
    {"author_name": "Ahmet Y.", "rating": 5, "relative_time_description": "1 hafta önce", "text": "Hizmet çok iyiydi, personel güleryüzlü."},
    {"author_name": "Mehmet K.", "rating": 4, "relative_time_description": "2 hafta önce", "text": "Güzel ama biraz daha hızlı servis yapabilirler."},
    {"author_name": "Ayşe M.", "rating": 5, "relative_time_description": "1 ay önce", "text": "Her zamanki gibi harika kahveler."},
    {"author_name": "Fatma D.", "rating": 3, "relative_time_description": "2 ay önce", "text": "Ortalama bir deneyimdi, çok kalabalıktı."},
    {"author_name": "Ali V.", "rating": 5, "relative_time_description": "3 ay önce", "text": "Çok memnun kaldım, herkese tavsiye ederim."}
]
def generate_rating_distribution(score: float, total_reviews: int) -> Dict[str, int]:
    if score >= 4.5:
        p = [0.03, 0.04, 0.08, 0.15, 0.70] # weights for 1, 2, 3, 4, 5
    elif score >= 4.0:
        p = [0.05, 0.05, 0.15, 0.25, 0.50]
    elif score >= 3.5:
        p = [0.10, 0.10, 0.20, 0.30, 0.30]
    else:
        p = [0.30, 0.20, 0.20, 0.15, 0.15]
    counts = [int(total_reviews * x) for x in p]
    diff = total_reviews - sum(counts)
    if diff != 0:
        counts[4] += diff
    return {"5": counts[4], "4": counts[3], "3": counts[2], "2": counts[1], "1": counts[0]}

async def scrape_google_maps(query: str, place_id: str = None, target_date_str: str = None):
    # Use Official API for Base Data
    print(f"DEBUG: Using Google API for: {query} (ID: {place_id}) Date: {target_date_str}")
    print("--- BACKEND UPDATED V2: NIGHT TRAFFIC FIX APPLIED ---")
    
    api_data = fetch_google_data(query=query, place_id=place_id)
    
    if api_data:
        # --- Historical Simulation Engine ---
        current_score = api_data.get("score", 0)
        current_reviews = api_data.get("review_count", 0)
        
        # Default to today if no date provided
        if not target_date_str:
            target_date = datetime.now()
        else:
            try:
                target_date = datetime.fromisoformat(target_date_str)
            except:
                target_date = datetime.now()
        
        # Calculate Delta
        days_diff = (datetime.now() - target_date).days
        
        # 1. Review Count Simulation (Assume linear growth)
        # E.g. 5 reviews per day growth on average
        simulated_reviews = max(0, int(current_reviews - (days_diff * 3)))
        
        # 2. Score Simulation (Random fluctuation for history)
        # History is slightly different but tends towards current
        if days_diff > 0:
            volatility = 0.3 * (min(days_diff, 365) / 365.0) # More volatile further back
            simulated_score = current_score + random.uniform(-volatility, volatility)
            simulated_score = round(max(1.0, min(5.0, simulated_score)), 1)
        else:
            simulated_score = current_score

        # 3. Popular Times Simulation based on Day of Week
        weekday = target_date.weekday() # 0=Mon, 6=Sun
        
        # Seed randomness with branch name + date to make it consistent but unique per branch
        seed_key = f"{query}_{target_date.strftime('%Y-%m-%d')}"
        random.seed(seed_key)
        
        if weekday < 5: # Weekday (Mon-Fri)
            # Office/Commute Pattern: Peaks at 08:00, 12:00, 18:00
            pt = [0, 0, 0, 0, 0, 20, 50, 80, 60, 40, 30, 80, 70, 50, 40, 60, 90, 70, 50, 30, 20, 10, 5, 0]
        else: # Weekend (Sat-Sun)
            # Social Pattern: Peaks at 14:00 - 16:00, late night active
            pt = [0, 0, 0, 0, 0, 0, 0, 10, 20, 50, 70, 80, 90, 95, 90, 80, 70, 60, 50, 40, 30, 20, 10, 5]
        
        # Apply deterministic noise based on the seed
        pt = [max(0, min(100, x + random.randint(-15, 15))) for x in pt]
        
        # STRICT OVERRIDE: Ensure 00:00 - 05:00 is absolutely 0
        for i in range(6):
            pt[i] = 0

        return {
            "platform": "Google Maps (API+Sim)",
            "name": api_data.get("name", ""),
            "score": simulated_score,
            "review_count": simulated_reviews,
            "scale": 5,
            "popular_times": pt, 
            "coords": api_data.get("coords", {"lat": 41.0082, "lng": 28.9784}),
            "reviews": api_data.get("reviews", []),
            "rating_distribution": generate_rating_distribution(simulated_score, simulated_reviews),
            "url": api_data.get("url", ""),
            "website": api_data.get("website", "")
        }
    else:
        # Fallback with Simulated Data
        # Even mock data should be seeded so it looks different for "Starbucks" vs "Kahve Dunyasi"
        seed_key = f"{query}_mock"
        random.seed(seed_key)
        
        mock_pt = [0, 0, 0, 0, 0, 0, 10, 30, 60, 70, 60, 80, 85, 80, 70, 60, 50, 40, 30, 20, 10, 5, 0, 0]
        mock_pt = [max(0, min(100, x + random.randint(-20, 20))) for x in mock_pt]
        
        # STRICT OVERRIDE: Ensure 00:00 - 05:00 is absolutely 0
        for i in range(6):
            mock_pt[i] = 0
        
        return {
            "platform": "Google Maps (Simulated)",
            "score": round(random.uniform(3.5, 4.9), 1),
            "review_count": random.randint(500, 5000),
            "scale": 5,
            "popular_times": mock_pt,
            "coords": {"lat": 41.0 + random.uniform(-0.1, 0.1), "lng": 29.0 + random.uniform(-0.1, 0.1)},
            "reviews": MOCK_REVIEWS_DB,
            "rating_distribution": generate_rating_distribution(4.2, 1000),
            "url": f"https://www.google.com/maps/search/?api=1&query={query.replace(' ', '+')}",
            "website": "https://www.akinsoft.com.tr"
        }

def scrape_trendyol(query: str):
    return {
        "platform": "Trendyol Yemek",
        "score": 8.8,
        "review_count": 420,
        "scale": 10
    }

# --- Scoring Logic (REAL DATA ONLY) ---
def calculate_score(google_data):
    # 1. Reputation Score (60%) - Based on pure Rating
    # 4.5 rating -> 90 points -> 54 weighted points
    rating = google_data.get('score', 0)
    reputation_score = (rating / 5.0) * 100
    
    # 2. Credibility Score (20%) - Based on Review Volume
    # Using Log scale so 1000 reviews doesn't dwarf 100 reviews linearly
    review_count = google_data.get('review_count', 0)
    if review_count > 0:
        # log10(100) = 2, log10(1000) = 3, log10(10000) = 4
        # Target: 500 reviews => full 100 points for this metric
        volume_score = min(100, math.log10(review_count) * 33) 
    else:
        volume_score = 0
        
    # 3. Recent Sentiment Score (20%) - Based on last 5 reviews
    reviews = google_data.get('reviews', [])
    if reviews:
        recent_sum = sum(r.get('rating', 0) for r in reviews)
        recent_avg = recent_sum / len(reviews)
        sentiment_score = (recent_avg / 5.0) * 100
    else:
        sentiment_score = reputation_score # Fallback to overall rating if no text reviews
    
    # Weighted Final Score
    final_score = (reputation_score * 0.60) + (volume_score * 0.20) + (sentiment_score * 0.20)
    
    return round(final_score, 1)

# --- Endpoints ---
@app.post("/search_branches")
async def search_branches(request: SearchRequest):
    """
    Returns a list of branches matching the query.
    """
    print(f"Searching for: {request.query} in city: {request.city}")
    results = search_places(request.query, request.city)
    return results

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_branch(request: BranchRequest):
    try:
        g_data = await scrape_google_maps(request.location_query, request.place_id, request.target_date)
        # t_data = scrape_trendyol(request.location_query) # REMOVED: Focus on Real Google Data
        
        final_name = g_data.get("name") or request.branch_name
        health_score = calculate_score(g_data)
        
        analysis_text = "Mükemmel" if health_score >= 80 else "İyi" if health_score >= 60 else "Geliştirilmeli"
        
        final_reviews = g_data.get("reviews")
        if not final_reviews:
            final_reviews = MOCK_REVIEWS_DB
            
        # AI Review Analysis & Categorization
        critical_alerts = []
        for review in final_reviews:
            text = review.get("text", "").lower()
            rating = review.get("rating", 5)
            categories = []
            
            if any(word in text for word in ["yavaş", "bekle", "geç", "hız"]):
                categories.append("Hız")
            if any(word in text for word in ["kaba", "personel", "ilgi", "saygı", "çalışan", "garson"]):
                categories.append("Personel")
            if any(word in text for word in ["pis", "kir", "temiz", "hijyen", "böcek"]):
                categories.append("Temizlik")
            if any(word in text for word in ["pahalı", "fiyat", "ücret", "hesap"]):
                categories.append("Fiyat")
                
            if not categories and rating <= 3:
                categories.append("Genel")
                
            review["ai_categories"] = categories
            
            # Create Alert for highly negative reviews
            if rating <= 2 or (rating <= 3 and ("Temizlik" in categories or "Personel" in categories)):
                critical_alerts.append({
                    "category": categories[0] if categories else "Kritik",
                    "text": review.get("text", ""),
                    "author": review.get("author_name", "Anonim"),
                    "time": review.get("relative_time_description", "")
                })
            
        final_url = g_data.get("url")
        if not final_url:
            if request.place_id:
                final_url = f"https://www.google.com/maps/place/?q=place_id:{request.place_id}"
            else:
                lat = g_data.get("coords", {}).get("lat", 0)
                lng = g_data.get("coords", {}).get("lng", 0)
                final_url = f"https://www.google.com/maps/search/?api=1&query={lat},{lng}"
                
        # Generate 3-month score history (12 weeks) based on Google Score
        score_history = []
        current_date = datetime.now()
        google_score = g_data.get("score", 0)
        
        # Seed consistently based on branch name so chart is stable
        random.seed(final_name) 
        
        for i in range(12, -1, -1):
            past_date = current_date - timedelta(weeks=i)
            # Add some volatility, ending exactly at google_score
            vol = random.uniform(-0.4, 0.4) if i > 0 else 0
            # Smooth out the trend
            hist_score = max(1.0, min(5.0, google_score + vol * (i / 12.0)))
            score_history.append({
                "date": past_date.strftime("%d %b"),
                "score": round(hist_score, 1)
            })

        # Early Warning System for Dropping Trend
        if len(score_history) >= 4:
            recent_scores = [x["score"] for x in score_history[-4:]] # Last 4 points (approx 1 month)
            # If score dropped continuously or dropped significantly
            if (recent_scores[0] > recent_scores[1] > recent_scores[2] > recent_scores[-1]) or (recent_scores[0] - recent_scores[-1] >= 0.3):
                critical_alerts.insert(0, {
                    "category": "Trend Alarmı",
                    "text": f"Son 1 ayda şube puanında keskin düşüş tespit edildi ({recent_scores[0]} -> {recent_scores[-1]}). Acil müdahale önerilir.",
                    "author": "Yapay Zeka Erken Uyarı"
                })

        # --- E-Posta Bildirim Simülasyonu ---
        if final_reviews:
            receivers = [a for a in admins_db if a.get("receive_emails", False)]
            if receivers:
                print("\n" + "="*40)
                print(f" ✉️  [E-POSTA SİSTEMİ TETİKLENDİ]")
                for r in receivers:
                    print(f"    -> ALICI: {r['email']} (Yönetici: {r['name']})")
                    print(f"    -> KONU: Yeni Yorum Bildirimi")
                    print(f"    -> MESAJ: Sayın {r['name']}, {final_name} şubesinden yeni bir müşteri yorumu aldınız. Lütfen kontrol ediniz.")
                print("="*40 + "\n")
        # ------------------------------------
        
        return {
            "branch_name": final_name,
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
            "popular_times": g_data["popular_times"],
            "coords": g_data["coords"],
            "analysis_date": request.target_date or datetime.now().isoformat(),
            "reviews": final_reviews,
            "rating_distribution": g_data.get("rating_distribution", {}),
            "map_url": final_url,
            "website": g_data.get("website", ""),
            "score_history": score_history,
            "critical_alerts": critical_alerts,
            "manager_phone": branch_phones_db.get(request.place_id, {}).get("phone", "")
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Scraping failed")

# --- Log Endpoints ---
complaints_db = []

@app.post("/log_complaint")
async def log_complaint(complaint: ComplaintLog):
    complaints_db.insert(0, complaint.dict()) # Insert at the beginning for newest first
    return {"status": "success"}

@app.get("/complaint_logs")
async def get_complaint_logs():
    return complaints_db

branch_phones_db = {} # Format: { "place_id": {"phone": "...", "name": "..."} }

class PhoneUpdateRequest(BaseModel):
    place_id: str
    phone: str
    branch_name: str = ""

@app.post("/update_phone")
async def update_phone(req: PhoneUpdateRequest):
    if req.place_id:
        branch_phones_db[req.place_id] = {"phone": req.phone, "name": req.branch_name}
    return {"status": "success", "phone": req.phone}

@app.get("/all_phones")
async def get_all_phones():
    res = []
    for pid, data in branch_phones_db.items():
        res.append({"place_id": pid, "name": data.get("name", "Bilinmeyen Şube"), "phone": data.get("phone", "")})
    return res

admins_db = [
    {
        "id": "1",
        "name": "Ahmet Yılmaz",
        "email": "ahmet@franceye.com",
        "phone": "0532 123 45 67",
        "receive_emails": True
    }
]

@app.get("/admins")
async def get_admins():
    return admins_db

class AdminProfileCreate(BaseModel):
    name: str
    email: str
    phone: str
    receive_emails: bool = False

import uuid

@app.post("/admins")
async def add_admin(data: AdminProfileCreate):
    new_admin = {
        "id": str(uuid.uuid4()),
        "name": data.name,
        "email": data.email,
        "phone": data.phone,
        "receive_emails": data.receive_emails
    }
    admins_db.append(new_admin)
    return {"status": "success", "admin": new_admin}

@app.delete("/admins/{admin_id}")
async def delete_admin(admin_id: str):
    global admins_db
    admins_db = [a for a in admins_db if a["id"] != admin_id]
    return {"status": "success"}

@app.put("/admins/{admin_id}")
async def update_admin(admin_id: str, data: AdminProfileCreate):
    for a in admins_db:
        if a["id"] == admin_id:
            a["name"] = data.name
            a["email"] = data.email
            a["phone"] = data.phone
            a["receive_emails"] = data.receive_emails
            return {"status": "success", "admin": a}
    return {"status": "error", "message": "Admin not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
