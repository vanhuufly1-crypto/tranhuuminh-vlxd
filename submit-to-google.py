#!/usr/bin/env python3
"""
Submit website to Google Search Console + Indexing API
Helps Google discover new content faster.
"""
import os, json, time

SITE_URL = "https://tranhuuminhvlxd.id.vn"
SITEMAP_URL = f"{SITE_URL}/sitemap.xml"

def ping_google():
    """Simple ping to tell Google to crawl sitemap."""
    import urllib.request
    url = f"https://www.google.com/ping?sitemap={SITEMAP_URL}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            code = resp.getcode()
            print(f"✅ Google ping: HTTP {code}")
            return True
    except Exception as e:
        print(f"⚠️ Google ping failed: {e}")
        return False

def ping_bing():
    """Ping Bing IndexNow API."""
    import urllib.request
    # Bing IndexNow
    payload = json.dumps({
        "url": SITE_URL,
        "host": SITE_URL.replace("https://", ""),
        "key": "tranhuuminh-vlxd-key"
    }).encode()
    try:
        req = urllib.request.Request(
            "https://api.indexnow.org/indexnow",
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(f"✅ Bing IndexNow: HTTP {resp.getcode()}")
    except Exception as e:
        print(f"⚠️ Bing IndexNow: {e}")

def generate_indexnow_key():
    """Generate IndexNow verification key file."""
    key = "tranhuuminh-vlxd-key"
    # Create key file at root
    with open(f"/home/huu-minh/website-vlxd/{key}.txt", "w") as f:
        f.write(key)
    print(f"✅ IndexNow key file created: {key}.txt")

def main():
    print("=" * 50)
    print("📡 SUBMIT TO SEARCH ENGINES")
    print("=" * 50)
    
    # Generate IndexNow key
    generate_indexnow_key()
    
    # Ping Google
    ping_google()
    time.sleep(1)
    
    # Ping Bing
    ping_bing()
    
    print("\n📋 Next steps:")
    print("1. Add site to Google Search Console manually")
    print("2. Add site to Bing Webmaster Tools")
    print("3. Wait 24-48h for indexing")
    print("=" * 50)

if __name__ == "__main__":
    main()
