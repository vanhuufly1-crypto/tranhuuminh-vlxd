#!/usr/bin/env python3
"""
PIPELINE TEST TỔNG THỂ — Kiểm tra toàn bộ website
Chạy: python3 pipeline-test.py
Xuất: pipeline-report.md
Yêu cầu: 100% CLEAN mới được deploy
"""
import re, os, sys, json

WEB_DIR = "/home/huu-minh/.openclaw/workspace/web-vlht"
PARENT_DIR = "/home/huu-minh/.openclaw/workspace"
DOCX_DIR = "/media/huu-minh/DATA/tai-lieu/bảng giá các hãng/báo giá chuẩn"
INBOUND_DIR = "/home/huu-minh/.openclaw/media/inbound"

errors = []
warnings = []
passed = []
failed = []

def log_test(name, status, detail=""):
    if status == "PASSED":
        passed.append(f"✅ {name}")
    else:
        failed.append(f"❌ {name}: {detail}")
        errors.append(detail)

# ==========================================
# 1. KIỂM TRA prices.js
# ==========================================
print("[TEST] 1. prices.js syntax + structure...")
with open(f"{WEB_DIR}/js/prices.js") as f:
    prices_content = f.read()
    
# Check syntax
assert "const PRICES = {" in prices_content, "Thiếu PRICES object"
log_test("prices.js — có PRICES object", "PASSED")

# Check brands
expected_brands = ['munich', 'nano', 'sika', 'dulux', 'jotun', 'kova', 'nippon', 'maxilite', 'mpe']
for b in expected_brands:
    if re.search(rf'\n  {b}: {{', prices_content):
        log_test(f"prices.js — brand {b}", "PASSED")
    else:
        log_test(f"prices.js — brand {b}", "FAILED", f"Không tìm thấy {b} trong prices.js")

# Count products per brand
brand_counts = {}
for b in expected_brands:
    m = re.search(rf'\n  {b}: {{\n(.*?)\n  }},', prices_content, re.DOTALL)
    if m:
        count = len(re.findall(r"price:", m.group(1)))
        brand_counts[b] = count
    else:
        brand_counts[b] = 0

print(f"[TEST] 1b. Brand counts: {brand_counts}")
total_prices = sum(brand_counts.values())
log_test(f"prices.js — tổng {total_prices} SP có giá", "PASSED" if total_prices >= 530 else "FAILED", f"Có {total_prices} SP, cần ≥530")

# ==========================================
# 2. KIỂM TRA products.js
# ==========================================
print("[TEST] 2. products.js...")
with open(f"{WEB_DIR}/js/products.js") as f:
    prods_content = f.read()

# Check BRANDS array
brands_match = re.search(r'const BRANDS = \[(.*?)\];', prods_content, re.DOTALL)
if brands_match:
    log_test("products.js — có BRANDS array", "PASSED")
    # Count brands
    brand_entries = re.findall(r"id:'(\w+)'", brands_match.group(1))
    log_test(f"products.js — {len(brand_entries)} brands", "PASSED")
else:
    log_test("products.js — BRANDS array", "FAILED", "Không tìm thấy BRANDS")

# Check HDPE không còn
if 'hdpe' in prods_content or 'HDPE' in prods_content:
    log_test("products.js — không còn HDPE", "FAILED", "HDPE vẫn còn trong products.js!")
else:
    log_test("products.js — không còn HDPE", "PASSED")

# ==========================================
# 3. KIỂM TRA index.html
# ==========================================
print("[TEST] 3. index.html...")
with open(f"{WEB_DIR}/index.html") as f:
    html_content = f.read()

# Check HDPE
if 'hdpe' in html_content.lower() or 'HDPE' in html_content:
    log_test("index.html — không còn HDPE", "FAILED", "HDPE vẫn còn trong index.html!")
else:
    log_test("index.html — không còn HDPE", "PASSED")

# Check các nút điều hướng
if 'href="#quote"' in html_content and 'showBrand' in html_content:
    log_test("index.html — nút Báo Giá + menu hãng", "PASSED")
else:
    log_test("index.html — nút Báo Giá + menu hãng", "FAILED", "Thiếu anchor hoặc showBrand")

# Check autocomplete
if 'autocomplete="off"' in html_content:
    log_test("index.html — autocomplete tắt", "PASSED")
else:
    log_test("index.html — autocomplete tắt", "WARNING", "Chưa tắt autocomplete trên input")

# ==========================================
# 4. KIỂM TRA style.css
# ==========================================
print("[TEST] 4. style.css...")
with open(f"{WEB_DIR}/css/style.css") as f:
    css_content = f.read()

if '.scroll-top' in css_content:
    log_test("style.css — scroll-top button", "PASSED")
else:
    log_test("style.css — scroll-top button", "FAILED", "Thiếu .scroll-top")

# ==========================================
# 5. KIỂM TRA ẢNH SẢN PHẨM
# ==========================================
print("[TEST] 5. Product images...")
img_dir = f"{WEB_DIR}/images/products"
if os.path.exists(img_dir):
    img_count = len([f for f in os.listdir(img_dir) if f.endswith('.webp')])
    log_test(f"images — {img_count} ảnh .webp", "PASSED" if img_count > 0 else "WARNING", f"Có {img_count} ảnh")
else:
    log_test("images — thư mục ảnh", "WARNING", "Chưa có thư mục images/products")

# ==========================================
# 6. KIỂM TRA SIKA — cột giá đúng
# ==========================================
print("[TEST] 6. Sika price column check...")
import docx
try:
    doc = docx.Document(f"{DOCX_DIR}/bang-gia-sika-22-05-2026.docx")
    table = doc.tables[0]
    # Check row 3 (Sika Lite, Can 5L)
    row3_price_col3 = table.rows[3].cells[3].text.strip()  # Giá niêm yết
    row3_price_col4 = table.rows[3].cells[4].text.strip()  # Giá sau CK
    
    # Parse to compare
    p3 = re.search(r'\d+', row3_price_col3.replace('.',''))
    p4 = re.search(r'\d+', row3_price_col4.replace('.',''))
    
    if p3 and p4:
        # Check prices.js uses col3 value
        # Check giá niêm yết (format: '323.000đ')
        price_str = f"{int(p3.group(0)):,}đ".replace(',', '.')
        if price_str in prices_content:
            log_test("Sika — đúng cột GIÁ NIÊM YẾT", "PASSED")
        else:
            log_test("Sika — đúng cột GIÁ NIÊM YẾT", "FAILED", f"Giá {p3.group(0)} không tìm thấy trong prices.js")
    else:
        log_test("Sika — đúng cột giá", "WARNING", "Không parse được giá DOCX")
except Exception as e:
    log_test("Sika — đúng cột giá", "WARNING", f"Lỗi đọc DOCX: {e}")

# ==========================================
# 7. KIỂM TRA MUNICH — tách quy cách
# ==========================================
print("[TEST] 7. Munich spec split...")
# Count entries with specific spec (containing L, kg, ml etc)
size_pattern = re.findall(r"spec: '\d+", prices_content)
total_sized = len(size_pattern)
if total_sized > 50:
    log_test(f"Munich — tách quy cách ({total_sized} entries có size)", "PASSED")
else:
    log_test(f"Munich — tách quy cách", "WARNING", f"Chỉ {total_sized} entries có size, có thể chưa tách hết")

# ==========================================
# SUMMARY
# ==========================================
print("\n" + "="*60)
print("📊 PIPELINE TEST REPORT")
print("="*60)
for p in passed:
    print(p)
print()
for f in failed:
    print(f)
print()
print(f"✅ PASSED: {len(passed)}")
print(f"❌ FAILED: {len(failed)}")
print(f"⚠️ WARNINGS: {len(warnings)}")

if len(failed) == 0:
    print("\n🎉 [100% CLEAN - NO BUG FOUND]")
else:
    print(f"\n🚨 Còn {len(failed)} lỗi cần sửa")

# Write report
with open(f"{WEB_DIR}/pipeline-report.md", 'w') as f:
    f.write("# 📊 PIPELINE TEST REPORT\n")
    f.write(f"Thời gian: 05/06/2026\n\n")
    f.write("## Kết quả\n\n")
    for p in passed:
        f.write(f"- {p}\n")
    f.write("\n")
    for e in failed:
        f.write(f"- {e}\n")
    f.write("\n")
    f.write(f"**✅ PASSED: {len(passed)} | ❌ FAILED: {len(failed)}**\n")
    if len(failed) == 0:
        f.write("\n## 🎉 100% CLEAN - NO BUG FOUND\n")

sys.exit(0 if len(failed) == 0 else 1)
