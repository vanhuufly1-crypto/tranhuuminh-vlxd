#!/usr/bin/env python3
"""
Fetch product images for VLHT Trần Hữu Minh website.
Downloads from official brand pages and converts to WebP.
"""
import requests
import re
import os
import sys
from PIL import Image
from io import BytesIO
import urllib.parse
import time

IMAGES_DIR = "/home/huu-minh/.openclaw/workspace/tranhuuminh-vlxd/images"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
}

session = requests.Session()
session.headers.update(HEADERS)

def download_and_convert(url, filename, max_width=600):
    """Download image from URL and convert to WebP."""
    filepath = os.path.join(IMAGES_DIR, filename)
    if os.path.exists(filepath):
        print(f"  ✓ Already exists: {filename}")
        return True
    
    try:
        resp = session.get(url, timeout=20)
        resp.raise_for_status()
        
        content_type = resp.headers.get('Content-Type', '')
        if 'image' not in content_type:
            print(f"  ✗ Not an image: {content_type} for {url[:80]}")
            return False
        
        img = Image.open(BytesIO(resp.content))
        
        # Convert to RGB if necessary
        if img.mode in ('RGBA', 'P', 'PA'):
            img = img.convert('RGBA')
        else:
            img = img.convert('RGB')
        
        # Resize if larger than max_width
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.LANCZOS)
        
        # Save as WebP
        img.save(filepath, 'WEBP', quality=82, method=6)
        print(f"  ✓ Saved {filename} ({img.width}x{img.height})")
        return True
    except Exception as e:
        print(f"  ✗ Error: {e} for {url[:80]}")
        return False


def find_images_in_page(url, img_pattern=None):
    """Find image URLs in a page."""
    try:
        resp = session.get(url, timeout=20)
        resp.raise_for_status()
        html = resp.text
        
        # Find all img tags
        urls = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html, re.IGNORECASE)
        
        # Find background-image style
        bg_urls = re.findall(r'background-image\s*:\s*url\(["\']?([^"\'\)]+)["\']?\)', html, re.IGNORECASE)
        
        all_urls = urls + bg_urls
        
        # Filter for product images - prefer larger ones
        product_urls = []
        for u in all_urls:
            if any(ext in u.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                if 'logo' not in u.lower() and 'icon' not in u.lower() and 'banner' not in u.lower() and 'avatar' not in u.lower():
                    if not u.startswith('http'):
                        # Handle relative URLs
                        parsed = urllib.parse.urlparse(url)
                        base = f"{parsed.scheme}://{parsed.netloc}"
                        if u.startswith('//'):
                            u = f"https:{u}"
                        elif u.startswith('/'):
                            u = f"{base}{u}"
                        else:
                            u = f"{base}/{u}"
                    product_urls.append(u)
        
        return product_urls
    except Exception as e:
        print(f"  ✗ Error fetching page: {e}")
        return []


# ============================================================
# SIKA PRODUCTS
# ============================================================
def fetch_sika_images():
    print("\n=== SIKA PRODUCTS ===")
    
    sika_products = {
        'sika_top107.webp': [
            ('Sika Top 107', 'https://vnm.sika.com/en/construction/waterproofing-systems/waterproofing-mortar/sikatop-107-sealvn.html'),
            ('Sika Top 107', 'https://sikavietnam.vn/xem-san-pham/sikatop-seal-107.html'),
        ],
        'sika_sikalastic1k.webp': [
            ('Sikalastic 1K', 'https://vnm.sika.com/vi/kenh-phan-ph-i-banl/chong-tham/ch-ng-th-m-san-mai/sikalastic-110.html'),
            ('Sikalastic 1K', 'https://vnsika.com/san-pham/sikalastic-110/'),
        ],
        'sika_sikalatex.webp': [
            ('Sika Latex', 'https://sikavietnam.vn/xem-san-pham/sika-latex-th.html'),
            ('Sika Latex', 'https://vnm.sika.com/vi/kenh-phan-ph-i-banl/chong-tham/ph-gia-x-y-d-ng/sika-latex-th.html'),
        ],
        'sika_sikaflex11fc.webp': [
            ('Sikaflex 11FC', 'https://vnm.sika.com/en/distribution-retail/sealing-and-bonding/sikaflex-11-fc.html'),
            ('Sikaflex 11FC', 'https://www.sika.com/en/brands/purform-construction/sikaflex-11fc.html'),
        ],
        'sika_sikagrout214.webp': [
            ('SikaGrout 214', 'https://vnm.sika.com/en/construction/concrete/grouting/sikagrout-214-11.html'),
            ('SikaGrout 214', 'https://sikavietnam.vn/xem-san-pham/sikagrout-214-11.html'),
        ],
    }
    
    for filename, sources in sika_products.items():
        filepath = os.path.join(IMAGES_DIR, filename)
        if os.path.exists(filepath):
            print(f"  ✓ Already exists: {filename}")
            continue
        
        print(f"  → Searching for {filename}...")
        found = False
        for name, url in sources:
            images = find_images_in_page(url)
            for img_url in images:
                if download_and_convert(img_url, filename):
                    found = True
                    break
            if found:
                break
            time.sleep(1)
        
        if not found:
            print(f"  ✗ Could not find image for {filename}")


# ============================================================
# KOVA PRODUCTS
# ============================================================
def fetch_kova_images():
    print("\n=== KOVA PRODUCTS ===")
    
    kova_urls = {
        'kova_k871gold.webp': 'https://kovavietnam.com/san-pham/son-bong-cao-cap-trong-nha-k871-gold-2/',
        'kova_ct11a.webp': 'https://kovavietnam.com/san-pham/son-kova-chong-tham-san-be-tong-xi-mang-ct11a-gold-thung-4kg/',
        'kova_ct14.webp': 'https://kovavietnam.com/san-pham/chat-chong-tham-co-gian-chong-ap-luc-nguoc-ct14-gold/',
        'kova_ct04t.webp': 'https://kovavietnam.com/san-pham/son-kova-trang-tri-chong-tham-ct04t-gold/',
        'kova_k360gold.webp': 'https://kovavietnam.com/san-pham/son-bong-cao-cap-ngoai-that-k360-gold/',
    }
    
    for filename, url in kova_urls.items():
        filepath = os.path.join(IMAGES_DIR, filename)
        if os.path.exists(filepath):
            print(f"  ✓ Already exists: {filename}")
            continue
        
        print(f"  → Searching for {filename}...")
        images = find_images_in_page(url)
        for img_url in images:
            if download_and_convert(img_url, filename):
                break
        time.sleep(1)


# ============================================================
# NIPPON PRODUCTS
# ============================================================
def fetch_nippon_images():
    print("\n=== NIPPON PRODUCTS ===")
    
    nippon_urls = {
        'nippon_matex.webp': 'https://www.nipponpaint.com.vn/vi/son-noi-that/sieu-pham-matex/',
        'nippon_weatherbond.webp': 'https://professional.nipponpaint.com.vn/en/architectural-paint/weatherbond',
        'nippon_weathergard.webp': 'https://professional.nipponpaint.com.vn/en/architectural-paint/weathergard',
        'nippon_supertech.webp': 'https://www.nipponpaint.com.vn/vi/son-noi-that/super-tech/',
    }
    
    for filename, url in nippon_urls.items():
        filepath = os.path.join(IMAGES_DIR, filename)
        if os.path.exists(filepath):
            print(f"  ✓ Already exists: {filename}")
            continue
        
        print(f"  → Searching for {filename}...")
        images = find_images_in_page(url)
        for img_url in images:
            if download_and_convert(img_url, filename):
                break
        time.sleep(1)


# ============================================================
# DULUX PRODUCTS
# ============================================================
def fetch_dulux_images():
    print("\n=== DULUX PRODUCTS ===")
    
    dulux_urls = {
        'dulux_weathershield.webp': 'https://www.dulux.com.vn/vi/our-products/exterior/weathershield.html',
        'dulux_inspire.webp': 'https://www.dulux.com.vn/vi/our-products/interior/inspire.html',
        'dulux_5in1.webp': 'https://www.dulux.com.vn/vi/our-products/interior/5in1.html',
        'dulux_ambiance.webp': 'https://www.dulux.com.vn/vi/our-products/interior/ambiance.html',
        'dulux_aquatech.webp': 'https://www.dulux.com.vn/vi/our-products/waterproofing/aquatech.html',
    }
    
    for filename, url in dulux_urls.items():
        filepath = os.path.join(IMAGES_DIR, filename)
        if os.path.exists(filepath):
            print(f"  ✓ Already exists: {filename}")
            continue
        
        print(f"  → Searching for {filename}...")
        images = find_images_in_page(url)
        for img_url in images:
            if download_and_convert(img_url, filename):
                break
        time.sleep(1)


# ============================================================
# JOTUN PRODUCTS
# ============================================================
def fetch_jotun_images():
    print("\n=== JOTUN PRODUCTS ===")
    
    jotun_urls = {
        'jotun_jotashield.webp': 'https://www.jotun.com/vn-vn/decorative/products/jotashield/',
        'jotun_gardex.webp': 'https://www.jotun.com/vn-vn/decorative/products/gardex/',
        'jotun_fenomastic.webp': 'https://www.jotun.com/vn-vn/decorative/products/fenomastic/',
    }
    
    for filename, url in jotun_urls.items():
        filepath = os.path.join(IMAGES_DIR, filename)
        if os.path.exists(filepath):
            print(f"  ✓ Already exists: {filename}")
            continue
        
        print(f"  → Searching for {filename}...")
        images = find_images_in_page(url)
        for img_url in images:
            if download_and_convert(img_url, filename):
                break
        time.sleep(1)


if __name__ == '__main__':
    os.makedirs(IMAGES_DIR, exist_ok=True)
    
    fetch_sika_images()
    fetch_kova_images()
    fetch_nippon_images()
    fetch_dulux_images()
    fetch_jotun_images()
    
    print("\n=== DONE ===")
