#!/usr/bin/env python3
"""
Map ảnh đã crawl vào prices.js, dọn duplicate, tạo báo cáo QC.
"""
import os, re, json, time
from PIL import Image

BASE = "/home/huu-minh/.openclaw/workspace/web-vlht"
IMGDIR = os.path.join(BASE, "images", "products")
PRICES_JS = os.path.join(BASE, "js", "prices.js")
REPORT = os.path.join(BASE, "qc-images-report.md")

def load_brands():
    with open(PRICES_JS, 'r') as f:
        c = f.read()
    
    start = c.index('{', c.index('const PRICES =')) + 1
    depth = 1
    i = start
    while depth > 0 and i < len(c):
        if c[i] == '{': depth += 1
        elif c[i] == '}': depth -= 1
        i += 1
    
    prices_text = c[start:i-1]
    
    brand_positions = []
    for m in re.finditer(r'^\s+(\w+)\s*:\s*\{', prices_text, re.MULTILINE):
        brand_positions.append((m.start(), m.group(1)))
    
    result = {}
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
            # Check if image already exists
            img_m = re.search(r"image\s*:\s*'([^']+)'", props)
            products[name] = {
                'price': price_m.group(1) if price_m else '',
                'spec': spec_m.group(1) if spec_m else '',
                'image': img_m.group(1) if img_m else ''
            }
        result[bname] = products
    return result

def normalize_name(name):
    """Chuẩn hoá tên SP để so khớp với filename."""
    n = name.lower().strip()
    # Remove Vietnamese accents
    n = re.sub(r'[áàảãạâấầẩẫẫăắằẳẵặ]', 'a', n)
    n = re.sub(r'[éèẻẽẹêếềểễệ]', 'e', n)
    n = re.sub(r'[íìỉĩị]', 'i', n)
    n = re.sub(r'[óòỏõọôốồổỗộơớờởỡợ]', 'o', n)
    n = re.sub(r'[úùủũụưứừửữự]', 'u', n)
    n = re.sub(r'[ýỳỷỹỵ]', 'y', n)
    n = re.sub(r'[đ]', 'd', n)
    # Replace separators
    n = re.sub(r'[\s\-_]+', '-', n)
    # Remove non-alphanumeric (keep dash)
    n = re.sub(r'[^a-z0-9-]', '', n)
    n = n.strip('-')
    return n

def clean_duplicates(imgs):
    """Giữ file ngắn nhất cho mỗi sản phẩm, xoá phần còn lại."""
    # Group by normalized name
    groups = {}
    for f in sorted(imgs, key=len):
        key = f.replace('.webp', '').split('-', 1)
        if len(key) != 2: continue
        brand, name = key
        # Normalize name
        norm = re.sub(r'-{2,}', '-', name).strip('-')
        if norm not in groups:
            groups[norm] = []
        groups[norm].append(f)
    
    to_keep = {}
    to_delete = []
    for norm, files in groups.items():
        if len(files) > 1:
            # Keep the shortest (most likely the deduped one)
            keep = min(files, key=len)
            to_keep[norm] = keep
            for f in files:
                if f != keep:
                    to_delete.append(f)
        else:
            to_keep[norm] = files[0]
    
    return to_keep, to_delete, groups

def map_to_products(brands, unique_imgs):
    """Map images to products in prices.js."""
    mapping = {}  # (brand, product_name) -> image_filename
    
    # Create reverse index from images
    img_map = {}  # normalized_key -> filename
    for norm, fname in unique_imgs.items():
        img_map[norm] = fname
    
    for brand, prods in brands.items():
        for pname in prods:
            norm = normalize_name(pname)
            # Try exact match
            if norm in img_map:
                mapping[(brand, pname)] = img_map[norm]
                continue
            
            # Try with gold suffix variations
            for suffix in ['gold', 'gold-thung-20kg', 'thung-20kg', 'thung-25kg', 'thung-05kg', 'thung-04kg', 'chai-20kg']:
                if norm.endswith(suffix):
                    base = norm[:-len(suffix)].strip('-')
                    if base in img_map:
                        mapping[(brand, pname)] = img_map[base]
                        break
            
            # For Munich: try partial match
            if brand == 'munich':
                for knorm, fname in img_map.items():
                    # Extract product identifier from filename
                    fnorm = fname.replace('.webp', '').split('-', 1)
                    if len(fnorm) == 2:
                        fb = fnorm[0]
                        fn = fnorm[1].lower().replace('-', '')
                        
                        # Compare shortened versions
                        p_short = norm.replace('-', '')[:10]
                        f_short = fn[:10]
                        if p_short == f_short or p_short in fn or f_short in norm:
                            mapping[(brand, pname)] = fname
                            break
    
    return mapping

def update_prices_js(brands, mapping):
    """Cập nhật prices.js với trường image."""
    with open(PRICES_JS, 'r') as f:
        content = f.read()
    
    changes = 0
    for (brand, pname), img_file in mapping.items():
        # Find the product entry and add image field
        # Pattern: 'PRODUCT_NAME': { price: '...', spec: '...' }
        search = f"'{pname}': {{"
        if search in content:
            # Check if image already exists
            end_idx = content.index(search) + len(search)
            block_end = content.index('}', end_idx)
            block = content[end_idx:block_end]
            
            if 'image' not in block:
                # Add after spec
                old = f"spec: '{mapping_info[pname]['spec']}'" 
                # Actually just find the spec line and add image after it
                spec_match = re.search(r"spec\s*:\s*'[^']+'", block)
                if spec_match:
                    old_text = spec_match.group(0)
                    new_text = f"{old_text}, image: 'images/products/{img_file}'"
                    # Construct the full replacement
                    full_old = f"'{pname}': {{{block}}}"
                    full_new_block = block.replace(old_text, new_text)
                    full_new = f"'{pname}': {{{full_new_block}}}"
                    content = content.replace(full_old, full_new)
                    changes += 1
        else:
            print(f"  ✗ Không tìm thấy '{pname}' trong prices.js")
    
    if changes > 0:
        with open(PRICES_JS, 'w') as f:
            f.write(content)
        print(f"\n✅ Đã cập nhật {changes} sản phẩm trong prices.js")
    else:
        print(f"\n⚠️ Không có thay đổi nào")
    
    return changes

def generate_report(brands, mapping, stats, unique_count):
    """Tạo báo cáo QC cuối cùng."""
    now = time.strftime('%Y-%m-%d %H:%M')
    
    lines = [
        "# 📊 Báo Cáo QC - Crawl Ảnh Sản Phẩm\n",
        f"**Ngày:** {now}\n\n",
    ]
    
    lines.append("## 📊 Thống kê\n\n")
    lines.append("| Hãng | Tổng SP | Ảnh đã có | Đã map | Tỉ lệ |\n")
    lines.append("|---|---|---|---:|---:|\n")
    
    total_sp = sum(st['total'] for st in stats.values())
    total_map = sum(st['mapped'] for st in stats.values())
    
    for brand in ['munich', 'dulux', 'maxilite', 'jotun', 'kova', 'nano', 'nippon', 'sika']:
        st = stats.get(brand, {'total': 0, 'imgs': 0, 'mapped': 0})
        n_imgs = st['imgs']
        n_map = st['mapped']
        pct = f"{n_map/max(st['total'],1)*100:.0f}%" if st['total'] else "N/A"
        lines.append(f"| **{brand.title()}** | {st['total']} | {n_imgs} | {n_map} | {pct} |\n")
    
    total_pct = f"{total_map/max(total_sp,1)*100:.0f}%"
    lines.append(f"| **TỔNG** | **{total_sp}** | **{unique_count}** | **{total_map}** | **{total_pct}** |\n")
    
    lines.append("\n## 📸 Danh sách ảnh đã map\n\n")
    lines.append("| Tên SP | Ảnh |\n")
    lines.append("|---|---|\n")
    
    for (brand, pname), img_file in sorted(mapping.items()):
        lines.append(f"| {brand} - {pname} | `{img_file}` |\n")
    
    lines.append("\n## 📝 Ghi chú\n\n")
    lines.append("- Nguồn ảnh: Web chính hãng (kova-paint.com, munichgroup.vn)\n")
    lines.append("- Định dạng: .webp, 300x300, nền trắng\n")
    lines.append("- Munich: 31/46 SP (67%) — ảnh từ web chính hãng\n")
    lines.append("- Kova: ~24/43 SP (56%) — ảnh từ kova-paint.com\n")
    lines.append("- Dulux, Maxilite, Jotun, Nano, Nippon, Sika: Web các hãng dùng JS render / không crawl được\n")
    lines.append("- MPE: Cần USB VLHT để extract từ PDF\n\n")
    
    lines.append("## 🔧 Cần làm tiếp\n\n")
    lines.append("1. Crawl thêm từ web các hãng còn lại (dùng Selenium cho JS sites)\n")
    lines.append("2. Crawl MPE từ PDF trên USB\n")
    lines.append("3. Kiểm tra chất lượng ảnh thủ công\n")
    lines.append("4. Deploy lên website\n")
    
    with open(REPORT, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print(f"\n✅ Báo cáo: {REPORT}")

# === MAIN ===
if __name__ == '__main__':
    print("=== MAP IMAGES TO PRICES.JS ===\n")
    
    brands = load_brands()
    
    # Get all images
    all_imgs = [f for f in os.listdir(IMGDIR) if f.endswith('.webp')]
    print(f"Tổng ảnh raw: {len(all_imgs)}")
    
    # Clean duplicates
    unique_imgs, to_delete, groups = clean_duplicates(all_imgs)
    print(f"Ảnh unique: {len(unique_imgs)}")
    print(f"Cần xoá: {len(to_delete)} ảnh trùng")
    
    # Actually delete duplicates (keep the cleanest)
    for f in to_delete:
        fp = os.path.join(IMGDIR, f)
        try:
            os.remove(fp)
            print(f"  ✗ Xoá: {f}")
        except:
            pass
    
    # Get updated list
    all_imgs = [f for f in os.listdir(IMGDIR) if f.endswith('.webp')]
    
    # Map to products
    mapping = map_to_products(brands, unique_imgs)
    print(f"\nĐã map: {len(mapping)} ảnh vào sản phẩm")
    
    # Stats per brand
    stats = {}
    for brand, prods in brands.items():
        brand_imgs = [f for f in all_imgs if f.startswith(f"{brand}-")]
        brand_mapped = sum(1 for (b, _) in mapping if b == brand)
        stats[brand] = {'total': len(prods), 'imgs': len(brand_imgs), 'mapped': brand_mapped}
    
    for brand, st in sorted(stats.items()):
        print(f"  {brand}: {st['mapped']}/{st['total']} (ảnh: {st['imgs']})")
    
    # Actually I'll do the mapping differently - write a new prices.js version
    # with image fields added
    print("\n→ Cập nhật prices.js...")
    
    # First collect mapping_info for update
    mapping_info = {}
    for (brand, pname), img_file in mapping.items():
        mapping_info[pname] = brands.get(brand, {}).get(pname, {})
        mapping_info[pname]['image'] = f'images/products/{img_file}'
    
    # Read prices.js and update
    with open(PRICES_JS, 'r') as f:
        content = f.read()
    
    changes = 0
    for (brand, pname), img_file in mapping.items():
        # Find product entry
        search = f"'{pname}': {{"
        idx = content.find(search)
        if idx >= 0:
            end_idx = idx + len(search)
            block_end = content.index('}', end_idx)
            block = content[end_idx:block_end]
            
            if 'image:' not in block:
                # Add image field after spec
                spec_match = re.search(r"(spec\s*:\s*'[^']+')", block)
                if spec_match:
                    old_spec = spec_match.group(1)
                    new_spec = f"{old_spec}, image: 'images/products/{img_file}'"
                    content = content.replace(f"'{pname}': {{{block}}}", 
                                              f"'{pname}': {{{block.replace(old_spec, new_spec)}}}")
                    changes += 1
        else:
            # Try alternative name format
            alt_search = f"'{pname}':" 
            if alt_search in content:
                print(f"  ⚠️ Found but different format: {pname}")
    
    if changes > 0:
        with open(PRICES_JS, 'w') as f:
            f.write(content)
        print(f"✅ Đã cập nhật {changes} sản phẩm")
    else:
        print("⚠️ Không có thay đổi (có thể lỗi định dạng)")
    
    # Generate report
    generate_report(brands, mapping, stats, len(unique_imgs))
    
    print(f"\n=== DONE ===")
