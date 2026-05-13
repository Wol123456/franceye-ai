import urllib.request
import json
import time

def test_backend():
    print("Testing Backend Connection...")
    try:
        # Test Root
        with urllib.request.urlopen("http://localhost:8002/", timeout=2) as response:
            print(f"Root Check: {response.getcode()}")
    except Exception as e:
        print(f"Backend root check result: {e}")
        # Proceed anyway because 404 means server is likely there (FastAPI default)
        
    print("\nTesting Analyze Endpoint (MOCK - Fast)...")
    url = "http://localhost:8002/analyze"
    
    # 1. Test Mock (Search Query without HTTP)
    data_mock = json.dumps({
        "branch_name": "Test Mock",
        "location_query": "Acibadem Kahve" # Should be instant
    }).encode('utf-8')
    
    try:
        req_mock = urllib.request.Request(url, data=data_mock, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req_mock, timeout=5) as response:
            print(f"Mock Status: {response.getcode()}")
            print("Mock Response:", response.read().decode('utf-8')[:100])
    except Exception as e:
        print(f"Mock Request Failed: {e}")

    # 2. Test Real (URL)
    print("\nTesting Analyze Endpoint (REAL - Slow)...")
    data_real = json.dumps({
        "branch_name": "Test Real",
        "location_query": "http://google.com/maps/..." # Triggers scraper
    }).encode('utf-8')
    
    try:
        req_real = urllib.request.Request(url, data=data_real, headers={'Content-Type': 'application/json'})
        # Increase timeout to 60s
        with urllib.request.urlopen(req_real, timeout=60) as response:
            print(f"Real Status: {response.getcode()}")
            print("Real Response:", response.read().decode('utf-8')[:100])
            return True
    except Exception as e:
        print(f"Real Request Failed: {e}")
        return False

if __name__ == "__main__":
    if test_backend():
        print("\nSUCCESS: Backend is responding.")
    else:
        print("\nFAILURE: Backend is NOT reachable.")
