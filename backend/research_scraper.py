import requests
from bs4 import BeautifulSoup
import time

def test_trendyol_html(query):
    print(f"\n--- Testing Trendyol HTML for: {query} ---")
    url = f"https://www.trendyol.com/yemek/ara?q={query}"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
        "Referer": "https://www.trendyol.com/"
    }
    
    try:
        res = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {res.status_code}")
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            # Try to find a restaurant card. Classes usually obfucscated but let's try generic
            print(f"Page Title: {soup.title.string.strip() if soup.title else 'No Title'}")
            print("Successfully fetched HTML.")
            # TODO: Inspect HTML structure if successful
            return True
        else:
            print("Failed to fetch Trendyol HTML.")
            return False
            
    except Exception as e:
        print(f"Trendyol Error: {e}")
        return False

def test_yemeksepeti_html(query):
    print(f"\n--- Testing Yemeksepeti HTML for: {query} ---")
    url = f"https://www.yemeksepeti.com/istanbul/restaurants?q={query}" # Common pattern
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
    }
    
    try:
        res = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {res.status_code}")
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            print(f"Page Title: {soup.title.string.strip() if soup.title else 'No Title'}")
            return True
        else:
            print(f"Failed to fetch Yemeksepeti (Code {res.status_code})")
            return False
    except Exception as e:
        print(f"Yemeksepeti Error: {e}")
        return False

if __name__ == "__main__":
    test_trendyol_html("Starbucks")
    test_yemeksepeti_html("Starbucks")
