#!/bin/bash
# blog-post.sh <file.html> — Đăng bài blog với kiểm tra chất lượng nghiêm ngặt
# Bài viết bởi Mây (AI) — chạy trước khi đăng: chính tả, từ lạ, độ dài, hotline
set -euo pipefail
FILE="${1:-}"
if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  echo "LỖI: cần file HTML bài viết"; exit 1
fi
cd /home/huu-minh/website-vlxd

# ===== 1. Kiểm tra chất lượng =====
CHECK_OUT=$(python3 - "$FILE" <<'PYEOF'
import re, sys
s = open(sys.argv[1], encoding='utf-8').read()
errors = []
if re.search(r'[\u4e00-\u9fff\u3400-\u4dbf]', s): errors.append("ký tự tiếng Trung")
if re.search(r'\bHCM\b|v witro|Reinforced Concrete|\bV4\b|Hebei|SeaStone|Son Valley|Trang Thanh|vay trang web vui', s, re.I): errors.append("từ bịa/ngoại lai")
if re.search(r'\b(\w{3,})\b(?:\s+\1){2,}', s): errors.append("lặp từ")
text = re.sub(r'<[^>]+>', ' ', s); text = re.sub(r'\s+', ' ', text).strip()
if len(text) < 1500: errors.append(f"quá ngắn ({len(text)} ký tự)")
if "0378.679.633" not in s: errors.append("thiếu hotline")
if "TRẦN HỮU MINH" not in s.upper(): errors.append("thiếu tên công ty")
if re.search(r'TM (?!TRAN)HUU MINH|TM (?!TRẦN)HỮU MINH', s, re.I): errors.append("tên công ty thiếu chữ TRẦN (vd 'TM HUU MINH')")
if errors:
    print("FAIL | " + " | ".join(errors)); sys.exit(1)
print("PASS")
PYEOF
) || true
CHECK="${CHECK_OUT:-FAIL | lỗi khi chạy kiểm tra}"
echo "Kiểm tra: $CHECK"
[ "$CHECK" = "PASS" ] || { echo "❌ KHÔNG ĐĂNG — bài chưa đạt chất lượng"; exit 1; }

# ===== 2. Đưa file vào blog/ =====
BASENAME=$(basename "$FILE")
[ "$(dirname "$FILE")" = "blog" ] || cp "$FILE" "blog/$BASENAME"
echo "✅ File: blog/$BASENAME"

# ===== 3. Thêm link vào blog/index.html =====
python3 - "$BASENAME" <<'PYEOF'
import re, sys
slug = sys.argv[1]
with open(f'blog/{slug}', encoding='utf-8') as fh: s = fh.read()
m = re.search(r'<h1>(.*?)</h1>', s, re.S)
title = m.group(1).strip() if m else slug.replace('-', ' ').title()
brand = slug.split('-')[0].lower()
icons = {"munich":"🛡️","nanohouse":"🏡","kova":"🏺","sika":"🧪","jotun":"🖌️","dulux":"🎨","nippon":"🇯🇵"}
icon = icons.get(brand, "📝")
md = re.search(r'(\d{4}-\d{2}-\d{2})', s)
today = md.group(1) if md else ''
entry = f'<a href="/blog/{slug}" class="blog-item"><span class="icon">{icon}</span><span class="info"><span class="title">{title} | Trần Hữu Minh</span><span class="date">📅 {today}</span></span></a>'
with open('blog/index.html', encoding='utf-8') as fh: idx = fh.read()
marker = '<div class="blog-list">'
if marker in idx:
    idx = idx.replace(marker, marker + '\n' + entry, 1)
else:
    idx = entry + '\n' + idx
with open('blog/index.html', 'w', encoding='utf-8') as fh: fh.write(idx)
print("✅ Đã thêm link vào blog/index.html")
PYEOF

# ===== 4. Sitemap + commit + push =====
./generate-sitemap.sh
git add -A
git commit -m "auto-blog (Mây): ${BASENAME}" > /dev/null
git push origin main > /dev/null 2>&1
echo "✅ ĐÃ ĐĂNG LÊN WEBSITE: blog/${BASENAME}"

# ===== 5. IndexNow — báo Bing/Yandex có bài mới (chờ GitHub Pages build) =====
SLUG="${BASENAME%.html}"
INDEXNOW_URL="https://tranhuuminhvlxd.id.vn/blog/${SLUG}.html"
for i in 1 2 3 4 5 6; do
  sleep 15
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "${INDEXNOW_URL}")
  if [ "$CODE" = "200" ]; then break; fi
done
RESULT=$(curl -s -o /dev/null -w "%{http_code}" -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" -H "User-Agent: Mozilla/5.0" \
  -d "{\"host\":\"tranhuuminhvlxd.id.vn\",\"key\":\"tranhuuminh-vlxd-key\",\"keyLocation\":\"https://tranhuuminhvlxd.id.vn/tranhuuminh-vlxd-key.txt\",\"urlList\":[\"${INDEXNOW_URL}\"]}")
if [ "$RESULT" = "200" ] || [ "$RESULT" = "202" ]; then
  echo "✅ IndexNow: đã báo bài mới (HTTP $RESULT)"
else
  echo "⚠️ IndexNow: HTTP $RESULT (thử lại lần sau)"
fi
