import google_api_client
import json

# 1. search for starbucks
places = google_api_client.search_places("Starbucks Kadikoy")
if places:
    pid = places[0]['place_id']
    print("Found place_id:", pid)

    # 2. get details
    details = google_api_client.get_place_details(pid)
    if details:
        reviews = details.get('reviews', [])
        print("Reviews count:", len(reviews))
        if len(reviews) == 0:
            print("DETAILS RAW:", json.dumps(details, indent=2))
    else:
        print("Failed to get details.")
