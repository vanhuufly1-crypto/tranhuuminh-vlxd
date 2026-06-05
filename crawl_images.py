#!/usr/bin/env python3
"""
Tải ảnh sản phẩm từ web chính hãng, convert .webp 300x300, nền trắng.
Map vào prices.js.
"""
import os, re, sys, time, json
from io import BytesIO
from PIL import Image
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, quote

BASE = "/home/huu-minh/.openclaw/workspace/web-vlht"
IMGDIR = os.path.join(BASE, "images", "products")
os.makedirs(IMGDIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'text/html,image/webp,*/*',
    'Accept-Language': 'vi-VN,vi;q=0.9',
}
s = requests.Session()
s.headers.update(HEADERS)

# === Tools ===
def process(img_data, fname, size=300):
    """Convert ảnh → 300x300 WebP, nền trắng."""
    fp = os.path.join(IMGDIR, fname)
    if os.path.exists(fp) and os.path.getsize(fp) > 1000:
        return True
    try:
        im = Image.open(BytesIO(img_data))
        if im.mode in ('P','PA','RGBA'):
            im = im.convert('RGBA')
        else:
            im = im.convert('RGB')
        bg = Image.new('RGB', (size,size), (255,255,255))
        im.thumbnail((size,size), Image.LANCZOS)
        if im.mode == 'RGBA':
            bg.paste(im, ((size-im.width)//2, (size-im.height)//2), im)
        else:
            bg.paste(im, ((size-im.width)//2, (size-im.height)//2))
        bg.save(fp, 'WEBP', quality=85, method=6)
        return True
    except Exception as e:
        return False

def dl(url, fname):
    """Download + process ảnh."""
    fp = os.path.join(IMGDIR, fname)
    if os.path.exists(fp) and os.path.getsize(fp) > 1000:
        return True
    try:
        r = s.get(url, timeout=15)
        r.raise_for_status()
        ct = r.headers.get('Content-Type','')
        if 'image' not in ct and len(r.content) < 1000:
            return False
        return process(r.content, fname)
    except:
        return False

def fetch_page(url):
    """Fetch HTML page."""
    try:
        r = s.get(url, timeout=15)
        r.raise_for_status()
        return r.text
    except:
        return None

def find_imgs(html, page_url):
    """Tìm tất cả ảnh trong HTML."""
    soup = BeautifulSoup(html, 'lxml')
    urls = []
    for img in soup.find_all('img'):
        for attr in ['src', 'data-src', 'data-lazy-src']:
            src = img.get(attr)
            if src and not src.startswith('data:'):
                urls.append(urljoin(page_url, src))
                break
    return list(set(urls))

def score_img(url, keywords):
    """Score ảnh theo keywords."""
    u = url.lower()
    score = 0
    for kw in keywords:
        kwl = kw.lower().replace(' ','-').replace(' ','_')
        if kwl in u: score += 10
    if any(x in u for x in ['product','san-pham','main','large']): score += 5
    if any(x in u for x in ['thumb','small','banner','logo','icon','avatar']): score -= 5
    # Prefer larger dimensions in URL
    if any(x in u for x in ['600x','800x','1024x','1200x','1536x']): score += 3
    return score

# === LOAD products from prices.js ===
def load_products():
    with open(os.path.join(BASE, 'js', 'prices.js'), 'r') as f:
        c = f.read()
    
    brands = {}
    start = c.index('{', c.index('const PRICES =')) + 1
    depth = 1
    i = start
    while depth > 0 and i < len(c):
        if c[i] == '{': depth += 1
        elif c[i] == '}': depth -= 1
        i += 1
    
    prices_text = c[start:i-1]  # -1 to exclude the closing }
    
    # Find top-level keys (brand names)
    brand_positions = []
    for m in re.finditer(r'^\s+(\w+)\s*:\s*\{', prices_text, re.MULTILINE):
        brand_positions.append((m.start(), m.group(1)))
    
    for idx, (pos, bname) in enumerate(brand_positions):
        end_pos = brand_positions[idx+1][0] if idx+1 < len(brand_positions) else len(prices_text)
        block = prices_text[pos:end_pos]
        
        products = {}
        prod_matches = re.finditer(r"'([^']+)'\s*:\s*\{([^}]+)\}", block)
        for m in prod_matches:
            name = m.group(1)
            props = m.group(2)
            price_m = re.search(r"price\s*:\s*'([^']+)'", props)
            spec_m = re.search(r"spec\s*:\s*'([^']+)'", props)
            products[name] = {
                'price': price_m.group(1) if price_m else '',
                'spec': spec_m.group(1) if spec_m else ''
            }
        brands[bname] = products
    
    return brands

# === KOVA CRAWLER ===
def crawl_kova(products):
    print("\n=== KOVA ===")
    stats = {'total': len(products), 'dl': 0, 'fail': 0, 'mapped': []}
    
    # Known product page slugs for Kova
    slug_map = {
        'K871 - GOLD': 'son-kova-sieu-bong-cao-cap-trong-nha-k871-gold',
        'K5500 - GOLD': 'son-kova-ban-bong-cao-cap-trong-nha-k5500-gold',
        'K260 - GOLD': 'son-kova-khong-bong-cao-cap-trong-nha-k260-gold',
        'K771 - GOLD': 'son-kova-khong-bong-trong-nha-k771-gold',
        'K10 - GOLD': 'son-kova-trang-tran-trong-nha-k10-gold',
        'K109 - GOLD': 'son-kova-lot-khang-kiem-cao-cap-trong-nha-k109-gold',
        'K360 - GOLD': 'son-kova-bong-cao-cap-ngoai-troi-k360-gold',
        'CT04T - GOLD': 'son-kova-trang-tri-chong-tham-cao-cap-ngoai-troi-ct04t-gold',
        'K5800 - GOLD': 'son-kova-ban-bong-cao-cap-ngoai-troi-k5800-gold',
        'K5501 - GOLD': 'son-kova-khong-bong-cao-cap-ngoai-troi-k5501-gold',
        'K261 - GOLD': 'son-kova-khong-bong-ngoai-troi-k261-gold',
        'K209 - GOLD': 'son-kova-lot-khang-kiem-cao-cap-ngoai-troi-k209-gold',
        'K180 - GOLD': 'son-kova-mau-pha-san-trong-nha-k180-gold',
        'K280 - GOLD': 'son-kova-mau-pha-san-ngoai-troi-k280-gold',
        'CT08 - GOLD': 'son-kova-chong-tham-san-be-tong-xi-mang-ct08-gold',
        'CT-11A GOLD': 'son-kova-chong-tham-san-be-tong-xi-mang-ct11a-gold-chai',
        'CT-11B GOLD': 'son-kova-chong-tham-phu-gia-tron-vua-be-tong-xi-mang-ct11b-gold',
        'CT-14 GOLD': 'chat-chong-tham-co-gian-chong-ap-luc-nguoc-ct14-gold',
        'Clear N - GOLD': 'son-phu-bong-khong-mau-trong-suot-clear-n-gold',
        'Clear KL5 - GOLD': 'son-phu-bong-chong-tham-chiu-mai-mon-clear-kl5-gold',
        'KSP - GOLD': 'son-kova-gia-da-ksp-vay-trung',
        'TNA - GOLD': 'son-kova-trang-tri-noi-that-tna-gold',
        'KL5T - GOLD': 'son-kova-matit-kl5-hai-thanh-phan-chiu-mai-mon-kl5t-gold',
        'KL5T Aqua - GOLD': 'son-kova-matit-kl5-aqua-gold',
        'MT KL5T - GOLD mịn': 'matit-kl5-hai-thanh-phan-chiu-mai-mon-loai-min',
        'MT KL5T - GOLD thô': 'matit-kl5-hai-thanh-phan-chiu-mai-mon-loai-tho',
        'MT KL5T Aqua - GOLD': 'matit-kl5-aqua-gold',
        'MTT - GOLD': 'matit-trong-nha-mtt-gold',
        'MTN - GOLD': 'matit-ngoai-troi-mtn-gold',
        'MB - T': 'bot-ba-trong-nha-mb-t',
        'MB - N': 'bot-ba-ngoai-troi-mb-n-gold',
        'SK - 6': 'sk-6-matit-chiu-am-uot-dung-cho-san-tennis-chan-tuong',
        'CN-05': 'son-chiu-nhiet-kova-cn-05-gold',
        'KGP': 'son-chiu-nhiet-kova-kgp-gold',
        'NT26': 'son-phu-bong-khong-mau-nt26',
    }
    
    done = set()
    for name, info in sorted(products.items()):
        key = name.strip()
        uniq = f"kova-{key[:20]}"
        if uniq in done: continue
        done.add(uniq)
        
        # Create filename
        safe = re.sub(r'[^a-z0-9-]', '', key.lower().replace(' ','-').replace(' - ','-'))[:30]
        fname = f"kova-{safe}.webp"
        
        if os.path.exists(os.path.join(IMGDIR, fname)):
            stats['dl'] += 1
            continue
        
        print(f"  → {key[:30]}...", end=' ')
        
        # Find slug
        slug = slug_map.get(key)
        if not slug:
            # Try to find by partial match
            base_key = key.split('-')[0].strip().split(' ')[0]
            for k, v in slug_map.items():
                if base_key in k:
                    slug = v
                    break
        
        found = False
        if slug:
            # Try kova-paint.com
            for suffix in ['', '-thung-20kg', '-thung-25kg', '-thung-05kg', '-thung-04kg', '-chai-20kg', '-thung-18kg']:
                url = f"https://kova-paint.com/san-pham/{slug}{suffix}/"
                html = fetch_page(url)
                if html and 'wp-content/uploads' in html:
                    imgs = find_imgs(html, url)
                    for img_url in imgs:
                        if 'wp-content/uploads' in img_url and img_url.endswith(('.jpg','.jpeg','.png','.webp')):
                            if dl(img_url, fname):
                                print(f"✓ {fname}")
                                stats['dl'] += 1
                                stats['mapped'].append((key, fname))
                                found = True
                                break
                if found: break
                time.sleep(0.3)
        
        if not found:
            # Try kovavietnam.com
            alt_slug = slug or key.lower().replace(' - ','-').replace(' ','-').replace('--','-')
            alt_slug = re.sub(r'[^a-z0-9-]', '', alt_slug)
            for suffix in ['']:
                url = f"https://kovavietnam.com/san-pham/{alt_slug}/"
                html = fetch_page(url)
                if html:
                    imgs = find_imgs(html, url)
                    for img_url in imgs:
                        if any(x in img_url for x in ['.jpg','.png','.webp']):
                            if dl(img_url, fname):
                                print(f"✓ {fname}")
                                stats['dl'] += 1
                                stats['mapped'].append((key, fname))
                                found = True
                                break
        
        if not found:
            print("✗")
            stats['fail'] += 1
        
        time.sleep(0.5)
    
    return stats

# === MAIN ===
if __name__ == '__main__':
    print("=== CRAWL ẢNH SẢN PHẨM ===\n")
    
    brands = load_products()
    print(f"Tìm thấy {sum(len(p) for p in brands.values())} SP trong {len(brands)} hãng\n")
    
    all_stats = {}
    
    # Kova trước (nhiều ảnh nhất)
    if 'kova' in brands:
        all_stats['kova'] = crawl_kova(brands['kova'])
    
    # Tổng kết
    print(f"\n=== KẾT QUẢ ===")
    for brand, st in all_stats.items():
        total = st['total']
        dl = st['dl']
        pct = f"{dl/max(total,1)*100:.0f}%"
        print(f"{brand}: {dl}/{total} ({pct})")
    
    # Report
    total_sp = sum(st['total'] for st in all_stats.values())
    total_dl = sum(st['dl'] for st in all_stats.values())
    
    report = [
        "# 📊 Báo Cáo QC - Crawl Ảnh Sản Phẩm\n",
        f"**Ngày:** {time.strftime('%Y-%m-%d %H:%M')}\n\n",
        "| Hãng | Tổng SP | Đã crawl | Tỉ lệ |\n",
        "|---|---|---|---:|\n",
    ]
    for brand, st in sorted(all_stats.items()):
        pct = f"{st['dl']/max(st['total'],1)*100:.0f}%" if st['total'] else "N/A"
        report.append(f"| {brand.title()} | {st['total']} | {st['dl']} | {pct} |\n")
    pct = f"{total_dl/max(total_sp,1)*100:.0f}%"
    report.append(f"| **TỔNG** | **{total_sp}** | **{total_dl}** | **{pct}** |\n")
    
    report.append(f"\n## Phương pháp\n")
    report.append("- Crawl từ web chính hãng (kova-paint.com, kovavietnam.com)\n")
    report.append("- Resize 300x300, WebP quality 85, nền trắng\n")
    report.append("- Map theo mã sản phẩm\n\n")
    
    report.append(f"## Chưa crawl được\n")
    report.append("- Munich, Dulux, Jotun, Nippon, Sika, Maxilite, Nano: Web các hãng dùng JavaScript render, cần Selenium\n")
    report.append("- MPE: Cần USB VLHT để extract từ PDF\n")
    
    rp = os.path.join(BASE, "qc-images-report.md")
    with open(rp, 'w') as f:
        f.writelines(report)
    print(f"\n✅ {rp}")
