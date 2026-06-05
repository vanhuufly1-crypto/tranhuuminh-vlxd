#!/usr/bin/env python3
"""
Crawl ảnh sản phẩm chính hãng từ web nhà cung cấp.
Map vào products trong prices.js, convert .webp 300x300.
"""
import json, os, re, sys, time, hashlib
from io import BytesIO
from PIL import Image
import requests
from bs4 import BeautifulSoup
import urllib.parse

# === CONFIG ===
BASE_DIR = "/home/huu-minh/.openclaw/workspace/web-vlht"
IMAGES_DIR = os.path.join(BASE_DIR, "images", "products")
PRICES_JS = os.path.join(BASE_DIR, "js", "prices.js")
REPORT_FILE = os.path.join(BASE_DIR, "qc-images-report.md")

os.makedirs(IMAGES_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
}
session = requests.Session()
session.headers.update(HEADERS)

# === TRACKING ===
stats = {}  # brand -> {total, downloaded, failed, mapped}

# === PARSE prices.js ===
def load_prices():
    """Parse prices.js để lấy danh sách sản phẩm mỗi brand."""
    with open(PRICES_JS, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Parse the PRICES object
    brands = {}
    current_brand = None
    in_brand = False
    
    # Find all brand sections
    brand_matches = re.finditer(r'(\w+)\s*:\s*\{', content)
    # Find the PRICES object
    prices_match = re.search(r'const PRICES\s*=\s*\{', content)
    if not prices_match:
        print("Không tìm thấy const PRICES")
        return {}
    
    prices_start = prices_match.end()
    
    # Find function after PRICES
    func_match = re.search(r'\};\s*\n\s*function', content)
    if func_match:
        prices_end = func_match.start() + 1
    else:
        prices_end = content.rfind('};')
        if prices_end > 0:
            prices_end += 1
        else:
            return {}
    
    prices_text = content[prices_start:prices_end]
    
    # Extract brand blocks
    brand_blocks = {}
    depth = 0
    start = 0
    current_key = None
    
    for i, ch in enumerate(prices_text):
        if ch == '{':
            if depth == 0:
                # Check what key this belongs to
                before = prices_text[start:i]
                key_match = re.search(r'(\w+)\s*:\s*$', before[:before.rfind('\n')] if '\n' in before else before)
                if key_match:
                    current_key = key_match.group(1)
                    brand_blocks[current_key] = {'start': i, 'content_start': i+1}
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and current_key:
                brand_blocks[current_key]['end'] = i
                brand_blocks[current_key]['text'] = prices_text[brand_blocks[current_key]['content_start']:i]
                current_key = None
        elif ch == '\n' and depth == 0:
            start = i + 1
    
    # Parse products within each brand
    result = {}
    for brand, block in brand_blocks.items():
        text = block['text']
        products = {}
        
        # Find product entries
        entries = re.findall(r"'([^']+)'\s*:\s*\{[^}]+\}',?", text)
        
        # Alternative: find all product blocks
        prod_matches = re.finditer(r"'([^']+)'\s*:\s*\{([^}]+)\}", text)
        for m in prod_matches:
            name = m.group(1)
            props = m.group(2)
            price_m = re.search(r"price\s*:\s*'([^']+)'", props)
            spec_m = re.search(r"spec\s*:\s*'([^']+)'", props)
            products[name] = {
                'price': price_m.group(1) if price_m else '',
                'spec': spec_m.group(1) if spec_m else ''
            }
        
        result[brand] = products
    
    return result

# === IMAGE PROCESSING ===
def process_image(img_data, filename, target_size=300):
    """Convert image data to 300x300 WebP with white background."""
    filepath = os.path.join(IMAGES_DIR, filename)
    if os.path.exists(filepath):
        return True
    
    try:
        img = Image.open(BytesIO(img_data))
        
        # Convert to RGBA for proper background handling
        if img.mode in ('P', 'PA'):
            img = img.convert('RGBA')
        elif img.mode in ('1', 'L', 'I', 'F'):
            img = img.convert('RGB')
        elif img.mode not in ('RGB', 'RGBA'):
            img = img.convert('RGBA')
        
        # Create white background
        bg = Image.new('RGB', (target_size, target_size), (255, 255, 255))
        
        # Resize maintaining aspect ratio
        img.thumbnail((target_size, target_size), Image.LANCZOS)
        
        # Paste onto white background
        if img.mode == 'RGBA':
            bg.paste(img, ((target_size - img.width) // 2, (target_size - img.height) // 2), img)
        else:
            bg.paste(img, ((target_size - img.width) // 2, (target_size - img.height) // 2))
        
        bg.save(filepath, 'WEBP', quality=85, method=6)
        return True
    except Exception as e:
        print(f"  ✗ Lỗi xử lý ảnh {filename}: {e}")
        return False

def download_image(url, filename):
    """Download image from URL and process."""
    filepath = os.path.join(IMAGES_DIR, filename)
    if os.path.exists(filepath):
        return True
    
    try:
        resp = session.get(url, timeout=15)
        resp.raise_for_status()
        
        ct = resp.headers.get('Content-Type', '')
        if 'image' not in ct and 'octet-stream' not in ct:
            # Try anyway based on extension
            pass
        
        return process_image(resp.content, filename)
    except Exception as e:
        print(f"  ✗ Lỗi download {url[:60]}: {e}")
        return False

def find_images_in_page(url):
    """Tìm tất cả image URLs trong 1 page."""
    try:
        resp = session.get(url, timeout=15)
        resp.raise_for_status()
        html = resp.text
        
        # img tags
        soup = BeautifulSoup(html, 'lxml')
        urls = set()
        
        for img in soup.find_all('img'):
            src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
            if src:
                urls.add(src)
            # srcset
            srcset = img.get('srcset')
            if srcset:
                for part in srcset.split(','):
                    part = part.strip().split(' ')[0]
                    if part:
                        urls.add(part)
        
        # Background images in style
        for tag in soup.find_all(style=True):
            bg_matches = re.findall(r'background-image\s*:\s*url\(["\']?([^"\'\)]+)["\']?\)', tag['style'])
            for u in bg_matches:
                urls.add(u)
        
        # Resolve URLs
        resolved = set()
        for u in urls:
            if not u or u.startswith('data:') or 'logo' in u.lower() or 'icon' in u.lower():
                continue
            # Filter image extensions
            if any(ext in u.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp', '.gif']):
                resolved.add(urllib.parse.urljoin(url, u))
        
        return list(resolved)
    except Exception as e:
        print(f"  ✗ Lỗi fetch {url}: {e}")
        return []

def find_product_in_page(url, keywords):
    """Tìm ảnh trong page và ưu tiên ảnh match keyword."""
    images = find_images_in_page(url)
    
    # Score images - prefer large, product-like images
    scored = []
    for img_url in images:
        score = 0
        url_lower = img_url.lower()
        
        # Prefer images matching product name
        for kw in keywords:
            kw_lower = kw.lower().replace(' ', '-').replace(' ', '_')
            if kw_lower in url_lower:
                score += 5
        
        # Prefer main product images (not thumbs, not icons)
        if any(x in url_lower for x in ['product', 'san-pham', 'sp-', 'main', 'large', 'big']):
            score += 3
        
        # Penalize small/banner/logo
        if any(x in url_lower for x in ['thumb', 'small', 'banner', 'logo', 'icon']):
            score -= 3
        
        scored.append((score, img_url))
    
    scored.sort(reverse=True)
    return [u for _, u in scored]

# === BRAND CRAWLERS ===

def crawl_munich(products):
    """Crawl ảnh sản phẩm Munich từ munichgroup.vn"""
    print("\n=== MUNICH ===")
    stats['munich'] = {'total': len(products), 'downloaded': 0, 'failed': 0, 'mapped': 0}
    
    # Munich products are in categories on their site
    categories = {
        'vat-lieu-chong-tham': ['Nano AB', 'Economy', 'CT0', 'CT0-Tuong', 'C20', 'G20S', 'G20C', 'G20C-Đen',
                                'S902', 'C631', 'S632', 'S909 Noi', 'S909 Ngoai', 'S208', 'S302', 'S208',
                                'Walling', 'Stone SF', 'Water Plug', 'Grout G650', 'Repair G50', 'Gel G-01', 'Tile G07'],
        'son-chong-nong': ['UV20', 'UV20 Primer'],
        'son-epoxy': ['EP11 Phủ', 'EP11 Tự san', 'EP12 Lót', 'EP12 Phủ', 'G68', 'G10'],
        'som-kim-loai': ['PU S700', 'PU S400', 'PU S800F', 'Pu Glass', 'Glass 2K', 'Liquid Glass 2K'],
        'keo-dan-gach-vua-xay-dung': ['Grout G650', 'Repair G50', 'Gel G-01', 'Tile G07', 'Walling', 'Stone SF', 'Water Plug'],
    }
    
    # Try to find product images from specific product pages
    product_urls = {}
    for name, info in products.items():
        slug = name.lower().replace(' ', '-').replace('/', '-')
        product_urls[name] = f"https://munichgroup.vn/san-pham/{slug}"
    
    # Download from known image sources if possible
    for name, info in products.items():
        kw = name[:30]
        slug = name.lower().replace(' ', '-').replace('/', '-').replace('--', '-')
        filename = f"munich-{slug[:30]}.webp"
        
        if os.path.exists(os.path.join(IMAGES_DIR, filename)):
            stats['munich']['downloaded'] += 1
            continue
        
        print(f"  → Đang tìm ảnh: {name}")
        
        # Try direct search from site
        found = False
        for cat, cat_prods in categories.items():
            if name in cat_prods:
                page_url = f"https://munichgroup.vn/{cat}/"
                images = find_product_in_page(page_url, [name, kw])
                for img_url in images[:3]:
                    if download_image(img_url, filename):
                        print(f"    ✓ {filename}")
                        stats['munich']['downloaded'] += 1
                        stats['munich']['mapped'] += 1
                        found = True
                        break
                if found:
                    break
        
        if not found:
            stats['munich']['failed'] += 1
        
        time.sleep(0.5)

def crawl_kova(products):
    """Crawl ảnh sản phẩm Kova từ kova-paint.com"""
    print("\n=== KOVA ===")
    stats['kova'] = {'total': len(products), 'downloaded': 0, 'failed': 0, 'mapped': 0}
    
    # Kova-paint.com has detailed product pages
    # URL pattern: https://kova-paint.com/san-pham/<product-slug>/
    for name, info in products.items():
        # Create safe filename
        safe_name = name.lower().replace(' - ', '-').replace(' ', '-')
        safe_name = re.sub(r'[^a-z0-9-]', '', safe_name)[:40]
        filename = f"kova-{safe_name}.webp"
        
        if os.path.exists(os.path.join(IMAGES_DIR, filename)):
            stats['kova']['downloaded'] += 1
            continue
        
        print(f"  → Đang tìm ảnh: {name}")
        
        # Try common URL patterns on Kova site
        base_name = name.split('-')[0].strip().split(' ')[0].strip()
        search_urls = [
            f"https://kova-paint.com/san-pham/{safe_name.replace('-', '-')}/",
            f"https://kova-paint.com/?s={urllib.parse.quote(name[:30])}",
            f"https://kovavietnam.com/?s={urllib.parse.quote(name[:30])}",
        ]
        
        found = False
        for page_url in search_urls:
            images = find_product_in_page(page_url, [name[:20], base_name])
            for img_url in images[:5]:
                if download_image(img_url, filename):
                    print(f"    ✓ {filename}")
                    stats['kova']['downloaded'] += 1
                    stats['kova']['mapped'] += 1
                    found = True
                    break
            if found:
                break
            time.sleep(0.5)
        
        if not found:
            # Try direct product page patterns
            alt_urls = [
                f"https://kova-paint.com/san-pham/son-kova-{safe_name}/",
                f"https://kovavietnam.com/san-pham/son-kova-{safe_name}/",
            ]
            for page_url in alt_urls:
                images = find_product_in_page(page_url, [name[:20]])
                for img_url in images[:5]:
                    if download_image(img_url, filename):
                        print(f"    ✓ {filename}")
                        stats['kova']['downloaded'] += 1
                        stats['kova']['mapped'] += 1
                        found = True
                        break
                if found:
                    break
                time.sleep(0.5)
        
        if not found:
            stats['kova']['failed'] += 1
        
        time.sleep(0.5)

def crawl_nano(products):
    """Crawl ảnh sản phẩm Nano House từ nanohouse.vn"""
    print("\n=== NANO HOUSE ===")
    stats['nano'] = {'total': len(products), 'downloaded': 0, 'failed': 0, 'mapped': 0}
    
    for name, info in products.items():
        safe_name = name.lower().strip()
        filename = f"nano-{safe_name}.webp"
        
        if os.path.exists(os.path.join(IMAGES_DIR, filename)):
            stats['nano']['downloaded'] += 1
            continue
        
        print(f"  → Đang tìm ảnh: {name}")
        print(f"    ✗ Chưa crawl được - web nanohouse.vn không khả dụng")
        stats['nano']['failed'] += 1

def crawl_dulux(products):
    """Crawl ảnh sản phẩm Dulux từ dulux.vn"""
    print("\n=== DULUX ===")
    stats['dulux'] = {'total': len(products), 'downloaded': 0, 'failed': 0, 'mapped': 0}
    
    # Dulux products are code-based (RS86, GJ8, etc.)
    # Try to find from dulux.vn product listings
    unique_products = set()
    for name in products:
        key = name.split(' - ')[0].split(' ')[0] if ' ' in name else name
        unique_products.add(key)
    
    for name in unique_products:
        safe_name = name.lower().replace(' ', '-')
        filename = f"dulux-{safe_name}.webp"
        
        if os.path.exists(os.path.join(IMAGES_DIR, filename)):
            stats['dulux']['downloaded'] += 1
            continue
        
        print(f"  → Đang tìm ảnh: {name}")
        
        # Try Dulux Vietnam product pages
        search_urls = [
            f"https://www.dulux.com.vn/vi/search?q={urllib.parse.quote(name)}",
            f"https://www.dulux.com.vn/vi/our-products/search/{urllib.parse.quote(name)}",
        ]
        
        found = False
        for page_url in search_urls:
            images = find_product_in_page(page_url, [name])
            for img_url in images[:3]:
                if download_image(img_url, filename):
                    print(f"    ✓ {filename}")
                    stats['dulux']['downloaded'] += 1
                    stats['dulux']['mapped'] += 1
                    found = True
                    break
            if found:
                break
            time.sleep(0.5)
        
        if not found:
            stats['dulux']['failed'] += 1
        
        time.sleep(0.5)

def crawl_jotun(products):
    """Crawl ảnh sản phẩm Jotun từ jotun.vn"""
    print("\n=== JOTUN ===")
    stats['jotun'] = {'total': len(products), 'downloaded': 0, 'failed': 0, 'mapped': 0}
    
    # Jotun products - unique product names
    unique_products = set()
    for name in products:
        # Extract base product name
        base = name.split(' - ')[0] if ' - ' in name else name
        base = base.replace('JT_', '').replace('_', ' ').strip()
        unique_products.add(base)
    
    for name in sorted(unique_products):
        safe_name = name.lower().replace(' ', '-').replace('/', '-')
        filename = f"jotun-{safe_name}.webp"
        
        if os.path.exists(os.path.join(IMAGES_DIR, filename)):
            stats['jotun']['downloaded'] += 1
            continue
        
        print(f"  → Đang tìm ảnh: {name}")
        
        # Jotun product pages
        slug = name.lower().replace(' ', '-')
        search_urls = [
            f"https://www.jotun.com/vn-vn/decorative/products/{slug}/",
            f"https://www.jotun.com/vn-vn/search-results?q={urllib.parse.quote(name)}",
        ]
        
        found = False
        for page_url in search_urls:
            images = find_product_in_page(page_url, [name.lower(), slug])
            for img_url in images[:3]:
                if download_image(img_url, filename):
                    print(f"    ✓ {filename}")
                    stats['jotun']['downloaded'] += 1
                    stats['jotun']['mapped'] += 1
                    found = True
                    break
            if found:
                break
            time.sleep(0.5)
        
        if not found:
            stats['jotun']['failed'] += 1
        
        time.sleep(0.5)

def crawl_nippon(products):
    """Crawl ảnh sản phẩm Nippon từ nipponpaint.vn"""
    print("\n=== NIPPON ===")
    stats['nippon'] = {'total': len(products), 'downloaded': 0, 'failed': 0, 'mapped': 0}
    
    unique_products = set()
    for name in products:
        # Extract base product name
        base = name.replace('NP_', '').replace('NP_', '').replace('NP_', '')
        # Truncate long names
        base = base.strip()[:30]
        unique_products.add(base)
    
    for name in sorted(unique_products):
        safe_name = name.lower().replace(' ', '-').replace('/', '-').replace('--', '-')
        filename = f"nippon-{safe_name}.webp"
        
        if os.path.exists(os.path.join(IMAGES_DIR, filename)):
            stats['nippon']['downloaded'] += 1
            continue
        
        print(f"  → Đang tìm ảnh: {name}")
        
        slug = name.lower().replace(' ', '-')
        search_urls = [
            f"https://www.nipponpaint.com.vn/vi/san-pham/{slug}",
            f"https://professional.nipponpaint.com.vn/en/architectural-paint/{slug}",
        ]
        
        found = False
        for page_url in search_urls:
            images = find_product_in_page(page_url, [name.lower()[:15], slug])
            for img_url in images[:3]:
                if download_image(img_url, filename):
                    print(f"    ✓ {filename}")
                    stats['nippon']['downloaded'] += 1
                    stats['nippon']['mapped'] += 1
                    found = True
                    break
            if found:
                break
            time.sleep(0.5)
        
        if not found:
            stats['nippon']['failed'] += 1
        
        time.sleep(0.5)

def crawl_sika(products):
    """Crawl ảnh sản phẩm Sika từ vnm.sika.com"""
    print("\n=== SIKA ===")
    stats['sika'] = {'total': len(products), 'downloaded': 0, 'failed': 0, 'mapped': 0}
    
    unique_products = set()
    for name in products:
        # Truncate long Sika names
        base = name.strip()
        if len(base) > 25:
            base = base[:25]
        unique_products.add(base)
    
    for name in sorted(unique_products):
        safe_name = name.lower().replace(' ', '-').replace('/', '-')
        safe_name = re.sub(r'[^a-z0-9-]', '', safe_name)[:30]
        filename = f"sika-{safe_name}.webp"
        
        if os.path.exists(os.path.join(IMAGES_DIR, filename)):
            stats['sika']['downloaded'] += 1
            continue
        
        print(f"  → Đang tìm ảnh: {name}")
        
        # Try Sika Vietnam product pages
        slug = name.lower().replace(' ', '-').replace('/', '-')
        search_urls = [
            f"https://vnm.sika.com/vi/search/?q={urllib.parse.quote(name[:20])}",
            f"https://vnm.sika.com/en/search/?q={urllib.parse.quote(name[:20])}",
        ]
        
        found = False
        for page_url in search_urls:
            images = find_product_in_page(page_url, [name.lower()[:15], slug[:15]])
            for img_url in images[:5]:
                if download_image(img_url, filename):
                    print(f"    ✓ {filename}")
                    stats['sika']['downloaded'] += 1
                    stats['sika']['mapped'] += 1
                    found = True
                    break
            if found:
                break
            time.sleep(0.5)
        
        if not found:
            stats['sika']['failed'] += 1
        
        time.sleep(0.5)

def crawl_maxilite(products):
    """Crawl ảnh sản phẩm Maxilite"""
    print("\n=== MAXILITE ===")
    stats['maxilite'] = {'total': len(products), 'downloaded': 0, 'failed': 0, 'mapped': 0}
    
    unique_products = set()
    for name in products:
        base = name.split(' ')[0] if ' ' in name else name
        unique_products.add(base)
    
    for name in sorted(unique_products):
        safe_name = name.lower().replace(' ', '-').replace('/', '-')
        filename = f"maxilite-{safe_name}.webp"
        
        if os.path.exists(os.path.join(IMAGES_DIR, filename)):
            stats['maxilite']['downloaded'] += 1
            continue
        
        print(f"  → Đang tìm ảnh: {name}")
        print(f"    ✗ Chưa crawl được - web Maxilite không khả dụng")
        stats['maxilite']['failed'] += 1

# === SAVE MAPPING ===
def save_image_mapping():
    """Tạo file mapping giữa product names và image filenames."""
    mapping = {}
    for fname in os.listdir(IMAGES_DIR):
        if fname.endswith('.webp'):
            # Extract brand from filename
            parts = fname.split('-', 1)
            brand = parts[0]
            if brand not in mapping:
                mapping[brand] = {}
            # Get product name from filename
            name_part = parts[1].replace('.webp', '') if len(parts) > 1 else ''
            mapping[brand][name_part] = fname
    
    with open(os.path.join(BASE_DIR, 'image-mapping.json'), 'w') as f:
        json.dump(mapping, f, indent=2, ensure_ascii=False)
    
    return mapping

# === REPORT ===
def generate_report():
    """Tạo báo cáo QC images."""
    total_sp = 0
    total_dl = 0
    
    lines = [
        "# 📊 Báo Cáo QC - Crawl Ảnh Sản Phẩm\n",
        f"**Ngày tạo:** {time.strftime('%Y-%m-%d %H:%M')}\n",
        f"**Thư mục ảnh:** `{IMAGES_DIR}`\n\n",
        "| Hãng | Tổng SP | Ảnh crawl được | Tỉ lệ |\n",
        "|---|---|---|---:|\n",
    ]
    
    # Count images
    image_count = len([f for f in os.listdir(IMAGES_DIR) if f.endswith('.webp')])
    
    existing_images = set(os.listdir(IMAGES_DIR))
    
    for brand in ['munich', 'kova', 'nano', 'dulux', 'jotun', 'nippon', 'sika', 'maxilite']:
        s = stats.get(brand, {'total': 0, 'downloaded': 0, 'failed': 0})
        pct = f"{s['downloaded']/max(s['total'],1)*100:.0f}%" if s['total'] > 0 else "N/A"
        total_sp += s['total']
        total_dl += s['downloaded']
        lines.append(f"| **{brand.title()}** | {s['total']} | {s['downloaded']} | {pct} |\n")
    
    total_pct = f"{total_dl/max(total_sp,1)*100:.0f}%" if total_sp > 0 else "N/A"
    lines.append(f"| **TỔNG** | **{total_sp}** | **{total_dl}** | **{total_pct}** |\n")
    
    # List available images
    lines.append(f"\n## 📁 Danh sách ảnh đã crawl ({total_dl} files)\n")
    for fname in sorted(os.listdir(IMAGES_DIR)):
        if fname.endswith('.webp'):
            fsize = os.path.getsize(os.path.join(IMAGES_DIR, fname))
            lines.append(f"- `{fname}` ({fsize//1024}KB)\n")
    
    # Ghi chú
    lines.append(f"\n## 📝 Ghi chú\n")
    lines.append("- Ảnh đã được convert .webp, resize 300x300, nền trắng\n")
    lines.append("- Nguồn: Web chính hãng các hãng\n")
    lines.append("- Các hãng chưa crawl được: Nano House, Maxilite (web không hỗ trợ crawl)\n")
    lines.append("- MPE: Cần USB VLHT để extract từ PDF\n")
    
    with open(REPORT_FILE, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print(f"\n✅ Báo cáo: {REPORT_FILE}")


# === MAIN ===
if __name__ == '__main__':
    print("=== CRAWL ẢNH SẢN PHẨM ===\n")
    
    products = load_prices()
    if not products:
        print("❌ Không parse được prices.js")
        sys.exit(1)
    
    print(f"Tìm thấy {sum(len(p) for p in products.values())} sản phẩm trong {len(products)} hãng:")
    for brand, prods in products.items():
        print(f"  - {brand}: {len(prods)} SP")
    
    # Munich
    if 'munich' in products:
        crawl_munich(products['munich'])
    
    # Kova
    if 'kova' in products:
        crawl_kova(products['kova'])
    
    # Nano House
    if 'nano' in products:
        crawl_nano(products['nano'])
    
    # Dulux
    if 'dulux' in products:
        crawl_dulux(products['dulux'])
    
    # Jotun
    if 'jotun' in products:
        crawl_jotun(products['jotun'])
    
    # Nippon
    if 'nippon' in products:
        crawl_nippon(products['nippon'])
    
    # Sika
    if 'sika' in products:
        crawl_sika(products['sika'])
    
    # Maxilite
    if 'maxilite' in products:
        crawl_maxilite(products['maxilite'])
    
    # Save mapping
    save_image_mapping()
    
    # Report
    generate_report()
    
    print(f"\n=== KẾT THÚC ===")
    for brand, s in sorted(stats.items()):
        print(f"{brand}: {s['downloaded']}/{s['total']} ảnh (tỉ lệ {s['downloaded']/max(s['total'],1)*100:.0f}%)")
