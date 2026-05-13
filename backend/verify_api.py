from google_api_client import fetch_google_data

def test_api():
    print("Testing Google API Client...")
    # Test with a known place
    query = "Starbucks Kadıköy"
    print(f"Query: {query}")
    
    data = fetch_google_data(query)
    
    if data:
        print("SUCCESS! Data received:")
        print(f"Name (Implicit): {query}")
        print(f"Score: {data['score']}")
        print(f"Reviews: {data['review_count']}")
        print(f"Coords: {data['coords']}")
    else:
        print("FAILURE: No data returned. Check API Key or Quota.")

if __name__ == "__main__":
    test_api()
