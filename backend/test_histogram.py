import urllib.request
import re
import traceback

def test():
    req = urllib.request.Request(
        "https://www.google.com/maps/place/?q=place_id:ChIJ9T_m0223thQR2Z1FkL3-Wf4",
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    )
    try:
        html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8')
        match = re.search(r'window\.APP_INITIALIZATION_STATE\s*=\s*(\[.+?\]);', html)
        if match:
            print("Found APP_INITIALIZATION_STATE")
            json_str = match.group(1)
            # A typical Google maps place has hundreds of reviews. Let's look for known review count or rating.
            # Usually the histogram is [1_star_count, 2_star_count, 3_star_count, 4_star_count, 5_star_count]
            # Wait, no, sometimes it's an array of arrays or just 5 sequential integers with commas and spaces
            import json
            try:
                # We can't parse the whole thing easily because it has variables, but we can search for the pattern
                # The total reviews is usually followed by a list of 5 counts.
                # Let's just find anything matching 5 comma separated numbers where the last one is the largest.
                matches = re.finditer(r'\[[ \n]*(\d+)[ \n]*,[ \n]*(\d+)[ \n]*,[ \n]*(\d+)[ \n]*,[ \n]*(\d+)[ \n]*,[ \n]*(\d+)[ \n]*\]', json_str)
                for m in matches:
                    print("Found 5-integer array:", m.group(0))
            except Exception as e:
                print("Regex Error:", e)
        else:
            print("Not found")
    except Exception as e:
        traceback.print_exc()

test()
