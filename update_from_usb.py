#!/usr/bin/env python3
"""
Cập nhật bảng giá từ USB VLHT
Chạy: python3 update_from_usb.py

Quy trình:
1. Đọc tất cả bảng giá PDF/JPG từ USB
2. So sánh với PRICE_MAP trong products.js
3. Chỉ cập nhật những code ĐÃ TỒN TẠI (tránh false positive)
4. Tạo báo cáo
"""

import pdfplumber, re, json, os, datetime
from pathlib import Path

USB_BASE = '/run/media/huu-minh/VLHT/bảng giá các hãng/docs'
PRODUCTS_FILE = 'js/products.js'
REPORT_DIR = 'reports'

# Brand codes (chỉ cập nhật những brand này)
KNOWN_BRANDS = ['munich', 'nano', 'sika', 'dulux', 'jotun', 'kova', 'nippon']

def get_prices_from_products():
    """Đọc PRICE_MAP hiện tại từ products.js"""
    with open(PRODUCTS_FILE) as f:
        content = f.read()
    
    price_map = {}
    for brand in KNOWN_BRANDS:
        # Tìm section của brand trong PRICE_MAP
        pm_start = content.find("const PRICE_MAP")
        brand_start = content.find(f"  {brand}: {{", pm_start)
        brand_end = len(content)
        for nb in KNOWN_BRANDS:
            if nb == brand: continue
            pos = content.find(f"  {nb}: {{", brand_start + 5)
            if pos != -1 and pos < brand_end:
                brand_end = pos
        # Break at function getPrice
        func_pos = content.find("function getPrice", brand_start)
        if func_pos != -1 and func_pos < brand_end:
            brand_end = func_pos
        
        section = content[brand_start:brand_end]
        codes = re.findall(r"'([^']+)':\s*\{\s*price:'([^']+)'", section)
        price_map[brand] = {code: price for code, price in codes}
    
    return price_map, content

def read_pdf_text(filepath):
    """Đọc text từ PDF bằng pdfplumber"""
    try:
        with pdfplumber.open(filepath) as pdf:
            text = ""
            for page in pdf.pages:
                t = page.extract_text()
                if t:
                    text += t + "\n"
            return text
    except Exception as e:
        print(f"  ⚠️ Lỗi đọc PDF: {e}")
        return ""

def read_jpg_text(filepath):
    """Đọc text từ JPG bằng tesseract OCR"""
    import subprocess
    try:
        result = subprocess.run(
            ['tesseract', filepath, 'stdout', '-l', 'vie'],
            capture_output=True, text=True, timeout=30
        )
        return result.stdout
    except Exception as e:
        print(f"  ⚠️ Lỗi OCR: {e}")
        return ""

def parse_prices_from_text(text, brand_code_patterns):
    """Parse giá từ text, chỉ lấy các code khớp với brand"""
    results = {}  # {code: price}
    lines = text.split('\n')
    
    for line in lines:
        line = line.strip()
        if not line: continue
        
        # Tìm giá VNĐ (số có dấu phẩy/chấm)
        prices = re.findall(r'[\d,]+\.?[\d]*', line)
        if not prices: continue
        
        # Lấy giá cuối cùng trong dòng (thường là giá)
        raw_price = prices[-1].replace(',', '').replace('.', '')
        if not raw_price.isdigit() or len(raw_price) < 4:
            continue
        
        price_val = int(raw_price)
        
        # Với từng brand, kiểm tra code có trong line không
        for brand, codes in brand_code_patterns.items():
            for code in codes:
                # Kiểm tra code xuất hiện trong line (case-insensitive)
                code_lower = code.lower()
                line_lower = line.lower()
                if code_lower in line_lower:
                    # Nếu code có khoảng cách, kiểm tra từng phần
                    code_parts = code_lower.split()
                    if all(part in line_lower for part in code_parts):
                        results[f"{brand}/{code}"] = price_val
    
    return results

def update_products_with_prices(updates, content):
    """Cập nhật giá trong products.js"""
    changes = []
    
    for key, new_price in updates.items():
        brand, code = key.split('/', 1)
        
        # Tìm trong PRICE_MAP
        pm_start = content.find("const PRICE_MAP")
        brand_start = content.find(f"  {brand}: {{", pm_start)
        if brand_start == -1:
            continue
        
        # Tìm entry: 'CODE': { price:'XXX', spec:'...' }
        pattern = f"'{re.escape(code)}':\\s*{{\\s*price:'[^']+'"
        match = re.search(pattern, content[brand_start:])
        if not match:
            continue
        
        old_entry = match.group()
        old_price = re.search(r"price:'([^']+)'", old_entry)
        if not old_price:
            continue
        
        old_price_str = old_price.group(1)
        old_price_val = ''.join(c for c in old_price_str if c.isdigit() or c == ',')
        
        # Format giá mới
        new_price_str = f"{new_price:,}đ".replace(',', '.')
        
        # Chỉ cập nhật nếu giá khác
        if new_price_str != old_price_str:
            new_entry = old_entry.replace(f"price:'{old_price_str}'", f"price:'{new_price_str}'")
            content = content.replace(old_entry, new_entry, 1)
            changes.append(f"  • {brand}/{code}: {old_price_str} → {new_price_str}")
    
    return content, changes

def main():
    print(f"\n{'='*60}")
    print(f"  CẬP NHẬT BẢNG GIÁ TỪ USB VLHT")
    print(f"  {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'='*60}\n")
    
    # 1. Đọc danh sách code từ products.js
    print("1. Đọc PRICE_MAP từ products.js...")
    price_map, content = get_prices_from_products()
    total_codes = sum(len(codes) for codes in price_map.values())
    print(f"   Tổng số code có giá: {total_codes}")
    
    # 2. Đọc bảng giá từ USB
    all_updates = {}  # {brand/code: price_int}
    
    # --- PDF: Munich, Jotun, Nippon ---
    pdf_files = {
        'munich': [
            f'{USB_BASE}/bảng giá munich/Bang-gia-Munich-04-2026.pdf',
            f'{USB_BASE}/bảng giá munich/Bang-gia-Munich-ChongTham-04-2026.pdf',
            f'{USB_BASE}/bảng giá munich/Bang-gia-son-nuoc-Munich-04-2026.pdf',
        ],
        'jotun': [
            f'{USB_BASE}/bảng giá jotun/EndUser Price List_01st Apr 2026_Revised.pdf',
        ],
        'nippon': [
            f'{USB_BASE}/bảng giá nipon/Bang-gia-Nippon-ChinhHang-07-2025.pdf',
        ],
    }
    
    print("\n2. Đọc bảng giá từ USB...")
    for brand, files in pdf_files.items():
        print(f"\n   📄 {brand.upper()} ({len(files)} file PDF)")
        brand_codes = price_map.get(brand, {})
        if not brand_codes:
            print(f"      ⚠️ Không có code trong PRICE_MAP, bỏ qua")
            continue
        
        for fpath in files:
            if not os.path.exists(fpath):
                print(f"      ⚠️ Không tìm thấy: {os.path.basename(fpath)}")
                continue
            
            text = read_pdf_text(fpath)
            if not text:
                continue
            
            # Parse giá
            parsed = parse_prices_from_text(text, {brand: list(brand_codes.keys())})
            for key, val in parsed.items():
                if key not in all_updates or all_updates[key] != val:
                    all_updates[key] = val
        
        print(f"      Tìm thấy {sum(1 for k in all_updates if k.startswith(f'{brand}/'))} cập nhật giá")
    
    # --- JPG: Dulux, Sika ---
    jpg_brands = {
        'dulux': f'{USB_BASE}/bảng giá dulux',
        'sika': f'{USB_BASE}/bảng giá sika',
    }
    
    for brand, img_dir in jpg_brands.items():
        print(f"\n   📸 {brand.upper()} (JPG - OCR)")
        brand_codes = price_map.get(brand, {})
        if not brand_codes:
            print(f"      ⚠️ Không có code trong PRICE_MAP, bỏ qua")
            continue
        
        jpg_files = sorted(glob(img_dir, '*.jpg') + glob(img_dir, '*.jpeg'))
        if not jpg_files:
            print(f"      ⚠️ Không tìm thấy file JPG")
            continue
        
        for fpath in jpg_files:
            print(f"      OCR {os.path.basename(fpath)}...")
            text = read_jpg_text(fpath)
            if not text:
                continue
            parsed = parse_prices_from_text(text, {brand: list(brand_codes.keys())})
            for key, val in parsed.items():
                if key not in all_updates or all_updates[key] != val:
                    all_updates[key] = val
    
    # 3. Cập nhật vào products.js
    print(f"\n3. Cập nhật products.js...")
    updated_content, changes = update_products_with_prices(all_updates, content)
    
    if not changes:
        print("   ✅ Không có thay đổi giá nào")
    else:
        # Ghi file
        with open(PRODUCTS_FILE, 'w') as f:
            f.write(updated_content)
        
        # Kiểm tra syntax
        import subprocess
        result = subprocess.run(['node', '-c', PRODUCTS_FILE], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"   ✅ Đã cập nhật {len(changes)} thay đổi")
        else:
            print(f"   ⚠️ Syntax error sau khi cập nhật!")
            print(result.stderr)
            # Restore
            with open(PRODUCTS_FILE, 'w') as f:
                f.write(content)
            print("   ✅ Đã restore về bản gốc")
            return
    
    # 4. Tạo báo cáo
    print(f"\n{'='*60}")
    print(f"  BÁO CÁO CẬP NHẬT")
    print(f"{'='*60}")
    
    if changes:
        print(f"\n  📝 Cập nhật giá ({len(changes)}):")
        for c in changes:
            print(f"    {c}")
    else:
        print(f"\n  ✅ Không có thay đổi")
    
    # Lưu báo cáo
    os.makedirs(REPORT_DIR, exist_ok=True)
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M')
    report_file = f'{REPORT_DIR}/update_report_{timestamp}.txt'
    with open(report_file, 'w') as f:
        f.write(f"Báo cáo cập nhật bảng giá USB VLHT\n")
        f.write(f"Thời gian: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
        f.write(f"{'='*60}\n\n")
        if changes:
            f.write(f"Cập nhật giá ({len(changes)}):\n")
            for c in changes:
                f.write(f"{c}\n")
        else:
            f.write("Không có thay đổi\n")
    
    print(f"\n📄 Báo cáo: {report_file}")
    print(f"{'='*60}\n")

def glob(directory, pattern):
    """Find files matching pattern"""
    from pathlib import Path
    return [str(p) for p in Path(directory).glob(pattern)]

if __name__ == '__main__':
    main()
