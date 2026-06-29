#!/bin/bash
# auto-blog.sh - Thợ quảng cáo tự động viết bài cho website
# Chạy bởi cron, 5 lần/ngày
# Thợ: deepseek-r1:7b (viết content) + shell script (deploy)

set -e
cd /home/huu-minh/website-vlxd

# === Cấu hình ===
SITES_DIR="/home/huu-minh/website-vlxd"
BLOG_DIR="${SITES_DIR}/blog"
TODAY="$(date '+%Y-%m-%d')"

# Topic tuỳ theo khung giờ (tránh khung cao điểm UTC+8: 9-12h, 14-18h)
# Giờ an toàn UTC+7: 06, 07, 12, 18, 20
case "$(date +%H)" in
  06) BRAND="Munich";     ICON="🛡️"; DESC="sơn và chống thấm Munich" ;;
  07) BRAND="Nanohouse";  ICON="🏡"; DESC="sơn giả đá và chống thấm Nanohouse" ;;
  12) BRAND="Kova";       ICON="🏺"; DESC="chống thấm Kova và phụ gia bê tông" ;;
  18) BRAND="Sika";       ICON="🧪"; DESC="chống thấm và hóa chất xây dựng Sika" ;;
  20) BRAND="Jotun";      ICON="🖌️"; DESC="sơn Jotun cao cấp" ;;
  *) echo "⏰ Gio cao diem UTC+8: 9-12h, 14-18h. Bo qua."; exit 0 ;;
esac

# Chọn sub-topic theo ngày (xoay vòng)
DAY_OF_MONTH=$(date +%d)
SUBTYPE=$(( (10#$DAY_OF_MONTH % 5) + 1 ))

case $SUBTYPE in
  1) SUBTOPIC="bảng giá ${BRAND} mới nhất tại Hải Phòng 2026";;
  2) SUBTOPIC="hướng dẫn thi công ${BRAND} đúng kỹ thuật, bền đẹp";;
  3) SUBTOPIC="kinh nghiệm chọn mua ${BRAND} chính hãng, tránh hàng giả";;
  4) SUBTOPIC="${BRAND} có gì nổi bật? Ưu điểm và ứng dụng thực tế";;
  5) SUBTOPIC="mua ${BRAND} ở đâu uy tín tại Hải Phòng?";;
esac

# Tạo slug
SLUG="$(echo "${BRAND}-${SUBTOPIC}" | iconv -t ascii//TRANSLIT 2>/dev/null || echo "${BRAND}-${SUBTOPIC}")"
SLUG="$(echo "$SLUG" | sed 's/[^a-zA-Z0-9]/-/g' | tr '[:upper:]' '[:lower:]' | sed 's/--*/-/g; s/^-//; s/-$//')"
SLUG="${SLUG}-${TODAY}.html"

# Tạo nội dung bằng deepseek-r1:7b (dùng API Ollama local)
# Dùng Python gọi API Ollama + xử lý text sạch
PARAGRAPHS=$(python3 << 'PYEOF'
import json, urllib.request, re, sys

brand = """${BRAND}"""
desc = """${DESC}"""
subtopic = """${SUBTOPIC}"""

prompt = f"""Em là chuyên gia viết nội dung SEO cho công ty vật liệu xây dựng. Hãy viết bài blog tiếng Việt chất lượng cao, khoảng 300-500 từ, chủ đề: '{subtopic}'.

Yêu cầu chi tiết:
- Viết tự nhiên, chuyên nghiệp, giọng văn thân thiện và đầy đủ thông tin
- Tập trung chuyên sâu vào sản phẩm {desc}
- Giải thích rõ lợi ích, tính năng nổi bật, ứng dụng thực tế
- Đưa ra lời khuyên hữu ích cho người đọc (cách chọn, cách dùng, lưu ý khi mua)
- Lồng ghép từ khóa một cách tự nhiên: {brand}, vật liệu xây dựng Hải Phòng, Trần Hữu Minh
- Nhấn mạnh: Công ty TNHH XD & TM Hữu Minh có địa chỉ tại TDP Quyết Tiến, P. Nam Đồ Sơn, Hải Phòng
- Kết thúc với: Hotline/Zalo: 0378.679.633 - Email: vanhuufly@gmail.com - Website: tranhuuminhvlxd.id.vn

Viết liền mạch thành 3-5 đoạn văn (mỗi đoạn 80-120 từ). KHÔNG thêm tiêu đề phụ, chú thích hay giải thích gì khác ngoài nội dung bài viết."""

payload = {
    "model": "deepseek-r1:7b",
    "prompt": prompt,
    "stream": False,
    "options": {"num_predict": 2048, "temperature": 0.7, "top_p": 0.9}
}

try:
    req = urllib.request.Request(
        "http://localhost:11434/api/generate",
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read())
        text = data.get("response", "")
except Exception:
    text = ""

if text:
    text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL).strip()
    # Xử lý text: giữ xuống dòng tự nhiên, loại bỏ markdown
    text = text.replace('**', '').replace('__', '')
    text = re.sub(r'  +', ' ', text)

    # Tách thành đoạn theo xuống dòng hoặc câu
    if '\n' in text and not text.startswith('<p>'):
        paragraphs = [p.strip() for p in text.split('\n') if p.strip()]
    else:
        # Tách câu, gộp 2-3 câu thành đoạn
        sentences = re.split(r'(?<=[.!?])\s+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        paragraphs = []
        buf = []
        for s in sentences:
            buf.append(s)
            if len(buf) >= 3 or s == sentences[-1]:
                paragraphs.append(' '.join(buf))
                buf = []
        if buf:
            paragraphs.append(' '.join(buf))

    # Output <p> tags
    for p in paragraphs:
        print(f'<p>{p}</p>')
else:
    # Fallback text
    print(f'<p>Giới thiệu {desc} tại Hải Phòng. Liên hệ 0378.679.633 để được tư vấn miễn phí.</p>')
PYEOF
)

[ -z "$PARAGRAPHS" ] && PARAGRAPHS="<p>${CONTENT:-Giới thiệu $DESC tại Hải Phòng. Liên hệ 0378.679.633.}</p>"

TITLE=$(echo "$SUBTOPIC" | sed 's/^./\u&/')
META_DESC="${BRAND} tại Hải Phòng - Công ty TNHH XD & TM Hữu Minh. ${SUBTOPIC}"

# === JSON-LD Product Schema ===
BRAND_LC="$(echo "$BRAND" | tr '[:upper:]' '[:lower:]')"
case "$BRAND_LC" in
  munich)    SCHEMA_NAME="Sơn và chống thấm Munich" ; SCHEMA_DESC="Chống thấm và sơn cao cấp Đức — NPP chính thức tại Hải Phòng" ;;
  nanohouse) SCHEMA_NAME="Sơn giả đá và chống thấm Nanohouse" ; SCHEMA_DESC="Sơn giả đá và chống thấm Việt Nam — NPP chính thức" ;;
  kova)      SCHEMA_NAME="Chống thấm Kova và phụ gia bê tông" ; SCHEMA_DESC="Sơn và chống thấm nổi tiếng Việt Nam — Đại lý chính thức" ;;
  sika)      SCHEMA_NAME="Chống thấm và hóa chất xây dựng Sika" ; SCHEMA_DESC="Hóa chất xây dựng và chống thấm Thụy Sĩ — Đại lý chính thức" ;;
  jotun)     SCHEMA_NAME="Sơn Jotun cao cấp" ; SCHEMA_DESC="Sơn Na Uy hàng đầu thế giới — Đại lý chính thức" ;;
  dulux)     SCHEMA_NAME="Sơn Dulux cao cấp" ; SCHEMA_DESC="Sơn cao cấp Anh Quốc (AkzoNobel) — Đại lý chính thức" ;;
  nippon)    SCHEMA_NAME="Sơn Nippon cao cấp" ; SCHEMA_DESC="Sơn Nhật Bản hàng đầu châu Á — Đại lý chính thức" ;;
  *)         SCHEMA_NAME="Vật liệu xây dựng - ${BRAND}" ; SCHEMA_DESC="Sản phẩm ${BRAND} tại Hải Phòng" ;;
esac

SCHEMA_JSON=$(cat << JSONEOF
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "${SCHEMA_NAME}",
  "description": "${SCHEMA_DESC}. ${SUBTOPIC}",
  "brand": {
    "@type": "Brand",
    "name": "${BRAND}"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "VND",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "CÔNG TY TNHH XD & TM HỮU MINH",
      "address": "TDP Quyết Tiến, P. Nam Đồ Sơn, Hải Phòng",
      "telephone": "0378679633"
    }
  }
}
</script>
JSONEOF
)

# === Công ty info footer ===
COMPANY_FOOTER="Công ty TNHH XD & TM HỮU MINH - MST: 0201961941 - Địa chỉ: TDP Quyết Tiến, P. Nam Đồ Sơn, Hải Phòng"

cat > "${BLOG_DIR}/${SLUG}" << HTMLBLOCK
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${TITLE} | Trần Hữu Minh - VLXD & Chống Thấm Hải Phòng</title>
<meta name="description" content="${META_DESC}">
<meta name="keywords" content="${BRAND}, ${SUBTOPIC}, VLXD Hải Phòng, chống thấm, Trần Hữu Minh">
${SCHEMA_JSON}
</head>
<body style="font-family:Arial;max-width:800px;margin:auto;padding:20px;line-height:1.6;">
<h1>${TITLE}</h1>
${PARAGRAPHS}
<p><strong>${COMPANY_FOOTER}</strong></p>
<h2>📞 Liên hệ mua hàng</h2>
<p><strong>CÔNG TY TNHH XD & TM HỮU MINH</strong></p>
<p>Địa chỉ: TDP Quyết Tiến, P. Nam Đồ Sơn, Hải Phòng</p>
<p><strong>Hotline/Zalo: 0378.679.633</strong></p>
<p>Email: vanhuufly@gmail.com</p>
<p>Website: <a href="https://tranhuuminhvlxd.id.vn">tranhuuminhvlxd.id.vn</a></p>
<p><em>Bài viết được tạo tự động bởi hệ thống Mây — ${TODAY}</em></p>
</body>
</html>
HTMLBLOCK

echo "✅ Đã tạo: ${SLUG}"

# Chup screenshot bai blog
python3 << 'PYEOF' 2>/dev/null || true
from playwright.sync_api import sync_playwright
import os

blog_file = "${BLOG_DIR}/${SLUG}"
img_dir = "${SITES_DIR}/images/blog"
os.makedirs(img_dir, exist_ok=True)

out = os.path.join(img_dir, "${SLUG}" + ".jpg")
thumb = os.path.join(img_dir, "${SLUG}" + "-thumb.jpg")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 800, "height": 900})
    page.goto(f"file://{os.path.abspath(blog_file)}", wait_until="networkidle")
    page.screenshot(path=out, full_page=True)
    page.screenshot(path=thumb)
    browser.close()
    print(f"Screenshot: {os.path.basename(out)}")
PYEOF

# Update blog index - thêm entry mới vào đầu danh sách
NEW_ENTRY="<a href=\"/blog/${SLUG}\" class=\"blog-item\"><span class=\"icon\">${ICON}</span><span class=\"info\"><span class=\"title\">${BRAND} - ${SUBTOPIC} | Trần Hữu Minh</span><span class=\"date\">📅 ${TODAY}</span></span></a>"

# Tìm dòng <div class="blog-list"> và chèn ngay sau nó
sed -i "0,/<div class=\"blog-list\">/!b; /<div class=\"blog-list\">/a\\
${NEW_ENTRY}" "${BLOG_DIR}/index.html"

# Commit & push
git add -A
git commit -m "auto-blog: ${BRAND} - ${TODAY}" --quiet || true
git push --quiet 2>&1 || echo "⚠️ Push may have failed, will retry next time"

# === CẬP NHẬT BRAND PAGE ===
echo "Cap nhat brand pages..."
# Goi Python de regenerate brand pages tu danh sach blog hien tai
python3 << 'PYEOF' > /dev/null 2>&1
import os, re

BLOG_DIR = "/home/huu-minh/website-vlxd/blog"
BRANDS_DIR = "/home/huu-minh/website-vlxd/brands"
os.makedirs(BRANDS_DIR, exist_ok=True)

brands = [
    {"key": "munich", "name": "Munich", "icon": "🛡️", "desc": "Chống thấm và sơn cao cấp Đức — NPP chính thức tại Hải Phòng", "keywords": "munich"},
    {"key": "nanohouse", "name": "Nano House", "icon": "🏡", "desc": "Sơn giả đá và chống thấm Việt Nam — NPP chính thức", "keywords": "nano"},
    {"key": "dulux", "name": "Dulux", "icon": "🎨", "desc": "Sơn cao cấp Anh Quốc (AkzoNobel) — Đại lý chính thức", "keywords": "dulux"},
    {"key": "jotun", "name": "Jotun", "icon": "🖌️", "desc": "Sơn Na Uy hàng đầu thế giới — Đại lý chính thức", "keywords": "jotun"},
    {"key": "kova", "name": "Kova", "icon": "🏺", "desc": "Sơn và chống thấm nổi tiếng Việt Nam — Đại lý chính thức", "keywords": "kova"},
    {"key": "sika", "name": "Sika", "icon": "🧪", "desc": "Hóa chất xây dựng và chống thấm Thụy Sĩ — Đại lý chính thức", "keywords": "sika"},
    {"key": "nippon", "name": "Nippon", "icon": "🇯🇵", "desc": "Sơn Nhật Bản hàng đầu châu Á — Đại lý chính thức", "keywords": "nippon"},
]

# Doc blog posts
posts = []
for f in os.listdir(BLOG_DIR):
    if not f.endswith(".html") or f == "index.html":
        continue
    fp = os.path.join(BLOG_DIR, f)
    try:
        content = open(fp, encoding="utf-8").read()
        title_m = re.search(r"<title>(.*?)</title>", content)
        title = title_m.group(1).strip() if title_m else f
        date_m = re.search(r"(\d{4}-\d{2}-\d{2})", f)
        date = date_m.group(1) if date_m else ""
        desc_m = re.search(r'<meta name="description" content="(.*?)">', content)
        desc = desc_m.group(1) if desc_m else ""
        brand_key = "khac"
        for b in brands:
            if b["keywords"] in title.lower() or b["keywords"] in f.lower():
                brand_key = b["key"]
                break
        posts.append({"file": f, "title": title, "date": date, "desc": desc, "brand_key": brand_key})
    except:
        continue

posts.sort(key=lambda x: x["date"], reverse=True)

BRAND_KEY_MAP = {
    "munich": "munich",
    "nano": "nanohouse",
    "dulux": "dulux",
    "jotun": "jotun",
    "kova": "kova",
    "sika": "sika",
    "nippon": "nippon"
}

BRAND_KEY = BRAND_KEY_MAP.get("""${BRAND,,}""")

if BRAND_KEY:
    brand_info = {b["key"]: b for b in brands}.get(BRAND_KEY)
    if brand_info:
        brand_posts = [p for p in posts if p["brand_key"] == BRAND_KEY]
        blog_items = ""
        for p in brand_posts[:20]:
            blog_items += f'''        <a href="/blog/{p["file"]}" class="brand-post-item">\n          <span class="post-title">{p["title"]}</span>\n          <span class="post-date">📅 {p["date"]}</span>\n        </a>\n'''
        # Write updated HTML for this brand
        html = open(f"{BRANDS_DIR}/{BRAND_KEY}.html", encoding="utf-8").read()
        # Replace the post list section
        html = re.sub(
            r'<div class="brand-posts">.*?</div>',
            f'''<div class="brand-posts">\n  <h2>📰 Bài viết về {brand_info["name"]}</h2>\n{blog_items}</div>''',
            html, flags=re.DOTALL
        )
        with open(f"{BRANDS_DIR}/{BRAND_KEY}.html", "w", encoding="utf-8") as f:
            f.write(html)
PYEOF
echo "Brand pages updated."

# === PING GOOGLE ===
echo "📡 Pinging Google..."
curl -s "https://www.google.com/ping?sitemap=https://tranhuuminhvlxd.id.vn/sitemap.xml" > /dev/null 2>&1
echo "✅ Google pinged"

# === KIỂM TRA SAU DEPLOY ===
${SITES_DIR}/web-check.sh || echo "⚠️  Web-check phát hiện lỗi! Xem log để biết chi tiết."

echo "✅ Deploy xong: ${BRAND} - ${SUBTOPIC}"
