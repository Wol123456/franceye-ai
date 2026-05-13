import re
import json

def analyze():
    with open("debug_page.html", "r", encoding="utf-8") as f:
        content = f.read()

    # Look for APP_INITIALIZATION_STATE
    match = re.search(r'window\.APP_INITIALIZATION_STATE\s*=\s*(\[.+?\]);', content)
    if match:
        json_str = match.group(1)
        print("Found APP_INITIALIZATION_STATE")
        try:
            # It might safely parse as JSON, but Google sometimes uses lenient JSON
            # We can try to clean it or just regex search within it
            # parse it?
            data = json.loads(json_str)
            print("Successfully parsed JSON.")
            # Verify if we can find rating
            # It's a huge nested list.
            # Let's search string representation of it
            print(str(data)[:500]) 
        except:
            print("Could not parse JSON (expected). Searching raw string.")
            
        # Search for rating in the raw string
        # Look for 4.x followed by a high integer (review count)
        # Pattern: [4.2, 1200]
        # Or just "4.2"
        
        # specific search for Kahve Dunyasi
        print(f"Name found: {'Kahve' in json_str}")
        
        # Regex for rating: number between 1.0 and 5.0
        # and review count > 10
        # usually they appear together in the array: [..., 4.2, 1253, ...]
        
        rating_matches = re.findall(r'([1-5]\.\d),(\d{2,})', json_str)
        print("Potential rating/count pairs:", rating_matches[:10])
        
    else:
        print("APP_INITIALIZATION_STATE not found")

def recursive_search(obj, target, path=[]):
    if isinstance(obj, list):
        for i, item in enumerate(obj):
            recursive_search(item, target, path + [i])
    elif isinstance(obj, dict):
        for k, v in obj.items():
            recursive_search(v, target, path + [k])
    elif isinstance(obj, str) and target in obj:
        print(f"Found target at path: {path}")
        print(f"Value: {obj}")
        # We can't easy print siblings here without passing parent, 
        # but the path helps.
        
if __name__ == "__main__":
    analyze()
    
    # Reload for recursive search
    with open("debug_page.html", "r", encoding="utf-8") as f:
        content = f.read()
    match = re.search(r'window\.APP_INITIALIZATION_STATE\s*=\s*(\[.+?\]);', content)
    if match:
        data = json.loads(match.group(1))
        print("\n--- Recursive Search for 'Veliefendi' ---")
        recursive_search(data, "Veliefendi")
        
        # Manually inspect the likely location based on path
        # from previous log: data[3][2] seems to be the place entity
        try:
            target_node = data[5]
            print("\n--- Target Node (data[5]) ---")
            print(json.dumps(target_node, indent=2)[:5000]) # Look deeper
        except Exception as e:
            print(f"Error printing node: {e}")
