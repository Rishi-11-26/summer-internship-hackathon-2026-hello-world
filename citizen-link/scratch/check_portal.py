import requests
import sys

URL = "https://www.telangana.gov.in/"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}

try:
    print(f"Fetching {URL}...")
    resp = requests.get(URL, headers=HEADERS, timeout=15)
    print(f"Status Code: {resp.status_code}")
    resp.raise_for_status()
    print("Success!")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
