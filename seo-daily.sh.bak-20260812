#!/bin/bash
# seo-daily.sh — Tự động SEO hàng ngày
# 1. Kiểm tra GPU trống
# 2. Gọi R1 local phân tích SEO: sitemap, blog count, brand pages
# 3. Tự động quay vòng topic: mỗi ngày chọn 1 brand viết bài chuyên sâu
# 4. Tái tạo sitemap
# 5. Ping Google
# 6. Ghi log vào logs/seo-daily.log

set -euo pipefail

BASE_DIR="/home/huu-minh/website-vlxd"
LOG_DIR="${BASE_DIR}/logs"
LOG_FILE="${LOG_DIR}/seo-daily.log"
GPU_GUARD_LOG="${HOME}/.openclaw/workspace/gpu-guard.log"
TODAY="$(date '+%Y-%m-%d')"
BLOG_DIR="${BASE_DIR}/blog"
BRANDS_DIR="${BASE_DIR}/brands"
TMPDIR="/tmp/seo-daily-$$"

mkdir -p "${LOG_DIR}" "${TMPDIR}"
trap 'rm -rf "${TMPDIR}"' EXIT

log() {
  local msg="$*"
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ${msg}" | tee -a "${LOG_FILE}"
}

log "============================================"
log "🚀 SEO DAILY START — ${TODAY}"
log "============================================"

cd "${BASE_DIR}"

# ===== 1. GPU GUARD CHECK =====
log "🔍 Kiem tra GPU..."
gpu_busy=false
if [ -f "/tmp/gpu-guard.lock" ]; then
  LOCK_PID=$(cat /tmp/gpu-guard.lock 2>/dev/null || echo "")
  if [ -n "$LOCK_PID" ] && kill -0 "$LOCK_PID" 2>/dev/null; then
    log "⚠️  GPU ban: lock PID $LOCK_PID dang chay"
    gpu_busy=true
  else
    rm -f /tmp/gpu-guard.lock
  fi
fi

if ! $gpu_busy; then
  OLLAMA_LOADED=$(ollama ps 2>/dev/null | tail -n +2 | wc -l)
  if [ "$OLLAMA_LOADED" -gt 0 ]; then
    log "⚠️  GPU ban: Ollama dang co $OLLAMA_LOADED model(s)"
    gpu_busy=true
  fi
fi

if ! $gpu_busy; then
  GPU_UTIL=$(nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader 2>/dev/null | tr -d ' %' || echo "0")
  GPU_MEM=$(nvidia-smi --query-gpu=memory.used --format=csv,noheader 2>/dev/null | tr -d ' MiB' || echo "0")
  if [ "${GPU_UTIL:-0}" -gt 5 ]; then
    log "⚠️  GPU ban: util ${GPU_UTIL}%"
    gpu_busy=true
  elif [ "${GPU_MEM:-0}" -gt 500 ]; then
    log "⚠️  GPU ban: mem ${GPU_MEM}MB"
    gpu_busy=true
  else
    log "✅ GPU ranh (util=${GPU_UTIL}% mem=${GPU_MEM}MB)"
  fi
fi

# ===== 2. SEO ANALYSIS =====
log ""
log "📊 PHAN TICH SEO..."

# 2a. Count blog posts
BLOG_COUNT=$(find "${BLOG_DIR}" -name '*.html' ! -name 'index.html' 2>/dev/null | wc -l)
log "📝 So blog posts: ${BLOG_COUNT}"

# 2b. Analyze sitemap
if [ -f "${BASE_DIR}/sitemap.xml" ]; then
  SITEMAP_URLS=$(grep -c '<loc>' "${BASE_DIR}/sitemap.xml" 2>/dev/null || echo "0")
  SITEMAP_SIZE=$(wc -c < "${BASE_DIR}/sitemap.xml" 2>/dev/null || echo "0")
  SITEMAP_LASTMOD=$(date -r "${BASE_DIR}/sitemap.xml" '+%Y-%m-%d' 2>/dev/null || echo "unknown")
  log "🗺️  Sitemap: ${SITEMAP_URLS} URLs, ${SITEMAP_SIZE} bytes, lastmod ${SITEMAP_LASTMOD}"
else
  log "⚠️  sitemap.xml KHONG TON TAI!"
  SITEMAP_URLS=0
fi

# 2c. Check brand pages
BRAND_FILES=()
for f in "${BRANDS_DIR}"/*.html; do
  [ -f "$f" ] && BRAND_FILES+=("$(basename "$f" .html)")
done
log "🏷️  Brand pages: ${#BRAND_FILES[@]} (${BRAND_FILES[*]})"

# 2d. Blog per brand analysis
if ! $gpu_busy; then
  log "🧠 Goi R1 phan tich SEO..."

  # Write Python analysis script to temp file to avoid heredoc-in-subshell issues
  cat > "${TMPDIR}/seo_analysis.py" << 'PYEOF'
import json, urllib.request, os, re

blog_dir = "/home/huu-minh/website-vlxd/blog"
brands_dir = "/home/huu-minh/website-vlxd/brands"
sitemap_file = "/home/huu-minh/website-vlxd/sitemap.xml"

brand_posts = {}
brands = ["munich", "nanohouse", "kova", "sika", "jotun", "dulux", "nippon"]
for b in brands:
    brand_posts[b] = 0

total_posts = 0
if os.path.isdir(blog_dir):
    for f in os.listdir(blog_dir):
        if not f.endswith(".html") or f == "index.html":
            continue
        total_posts += 1
        f_lower = f.lower()
        for b in brands:
            if b in f_lower:
                brand_posts[b] += 1
                break

sitemap_ok = os.path.isfile(sitemap_file)
sitemap_urls = 0
if sitemap_ok:
    with open(sitemap_file) as sf:
        sitemap_urls = sf.read().count("<loc>")

today = os.popen("date +%Y-%m-%d").read().strip()
prompt = f"""Em la chuyen gia SEO phan tich website ban le vat lieu xay dung.
Hom nay la {today}.

Thong tin website:
- Tong so bai blog: {total_posts}
- So bai theo brand: {json.dumps(brand_posts, ensure_ascii=False)}
- So URL trong sitemap: {sitemap_urls}
- Trang brand: {', '.join(brands)}

Hay viet 1-2 doan phan tich trang thai SEO hien tai:
1. Danh gia tong quan (so luong bai viet, do phu brand)
2. Goi y cai thien (bai viet con thieu cho brand nao, toi uu sitemap)
3. Nhung gi dang tot va can duy tri

Viet ngan gon, thuc te, bang tieng Viet."""

payload = {
    "model": "deepseek-r1:7b",
    "prompt": prompt,
    "stream": False,
    "options": {"num_predict": 1024, "temperature": 0.5}
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
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()
    print(text)
except Exception as e:
    print(f"(Khong the phan tich: {e})")
PYEOF

  SEO_OUTPUT=$(python3 "${TMPDIR}/seo_analysis.py" 2>/dev/null || echo "")
  if [ -n "$SEO_OUTPUT" ]; then
    log "📋 Phan tich R1:"
    while IFS= read -r line; do
      [ -n "$line" ] && log "   ${line}"
    done <<< "$SEO_OUTPUT"
  fi
else
  log "⏭️  GPU ban - bo qua phan tich R1"
fi

# ===== 3. KEYWORD-TARGETED BLOG POST =====
log ""
log "📝 BAI VIET TU KHOA HOM NAY..."

# Try load keyword strategy brief
KEYWORD_BRIEF="/tmp/seo-keyword-brief.json"
if [ -f "$KEYWORD_BRIEF" ]; then
  HEAD_KW=$(python3 -c "import json; d=json.load(open('$KEYWORD_BRIEF')); print(d.get('head_keyword',''))" 2>/dev/null || echo "")
  TARGET_KWS=$(python3 -c "import json; d=json.load(open('$KEYWORD_BRIEF')); print('|'.join(d.get('target_keywords',[])))" 2>/dev/null || echo "")
  CLUSTER=$(python3 -c "import json; d=json.load(open('$KEYWORD_BRIEF')); print(d.get('cluster','munich'))" 2>/dev/null || echo "munich")
else
  # Fallback: brand rotation
  BRAND_LIST_S=("munich" "nanohouse" "kova" "sika" "jotun" "dulux" "nippon")
  DAY_OF_YEAR=$(date +%j)
  CLUSTER="${BRAND_LIST_S[$(( (10#$DAY_OF_YEAR) % 7 ))]}"
  HEAD_KW=""
  TARGET_KWS=""
fi

# Map cluster to brand info
case "${CLUSTER}" in
  munich) BRAND="Munich"; DESC="son va chong tham Munich"; ICON="🛡️"; BRAND_LC="munich" ;;
  nanohouse|nano*) BRAND="Nanohouse"; DESC="son gia da va chong tham Nanohouse"; ICON="🏡"; BRAND_LC="nanohouse" ;;
  kova) BRAND="Kova"; DESC="chong tham Kova va phu gia be tong"; ICON="🏺"; BRAND_LC="kova" ;;
  sika) BRAND="Sika"; DESC="chong tham va hoa chat xay dung Sika"; ICON="🧪"; BRAND_LC="sika" ;;
  jotun) BRAND="Jotun"; DESC="son Jotun cao cap"; ICON="🖌️"; BRAND_LC="jotun" ;;
  dulux) BRAND="Dulux"; DESC="son Dulux cao cap"; ICON="🎨"; BRAND_LC="dulux" ;;
  nippon) BRAND="Nippon"; DESC="son Nippon cao cap"; ICON="🇯🇵"; BRAND_LC="nippon" ;;
  *) BRAND="VLXD"; DESC="vat lieu xay dung tai Hai Phong"; ICON="🏪"; BRAND_LC="vlxd" ;;
esac

# Build keyword-focused topic
if [ -n "$HEAD_KW" ]; then
  # Derive slug from keyword
  DEEP_TOPIC=$(echo "${HEAD_KW}" | sed 's/ /-/g' | sed 's/[àáạảãâầấậẩẫăằắặẳẵ]/a/g; s/[èéẹẻẽêềếệểễ]/e/g; s/[ìíịỉĩ]/i/g; s/[òóọỏõôồốộổỗơờớợởỡ]/o/g; s/[ùúụủũưừứựửữ]/u/g; s/[ỳýỵỷỹ]/y/g; s/[đ]/d/g')
  DEEP_TITLE_CASE=$(echo "${HEAD_KW}" | sed 's/^./\U&/')
  log "🎯 Target keyword: ${HEAD_KW}"
  if [ -n "$TARGET_KWS" ]; then
    log "📌 Long-tail: $(echo $TARGET_KWS | tr '|' ', ')"
  fi
else
  # Fallback: rotation topic
  DEEP_TOPICS_F=(
    "so-sanh-${BRAND_LC}-voi-doi-thu-cung-phan-khuc"
    "danh-gia-chi-tiet-${BRAND_LC}-chat-luong-gia-thanh"
    "kinh-nghiem-su-dung-${BRAND_LC}-hieu-qua"
  )
  DAY_OF_YEAR=$(date +%j)
  SUB_INDEX=$(( (10#$DAY_OF_YEAR) % 3 ))
  DEEP_TOPIC="${DEEP_TOPICS_F[$SUB_INDEX]}"
  DEEP_TITLE_CASE=$(echo "${DEEP_TOPIC}" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')
fi

log "📖 Bai viet: ${DEEP_TITLE_CASE}"

# Generate article only if GPU is free
if ! $gpu_busy; then
  log "⚡ Dang tao bai viet..."
  DEEP_SLUG=$(echo "${DEEP_TOPIC}" | sed 's/[àáạảãâầấậẩẫăằắặẳẵ]/a/g; s/[èéẹẻẽêềếệểễ]/e/g; s/[ìíịỉĩ]/i/g; s/[òóọỏõôồốộổỗơờớợởỡ]/o/g; s/[ùúụủũưừứựửữ]/u/g; s/[ỳýỵỷỹ]/y/g; s/[đ]/d/g; s/ /-/g; s/[^a-zA-Z0-9-]//g')
  DEEP_SLUG="${DEEP_SLUG}-${TODAY}.html"
  DEEP_FILE="${BLOG_DIR}/${DEEP_SLUG}"

  # Write Python generation script to temp file
  cat > "${TMPDIR}/gen_deep.py" << PYEOF
import json, urllib.request, re, os

brand = "${BRAND}"
desc = "${DESC}"
topic = "${DEEP_TOPIC}"
topic_title = "${DEEP_TITLE_CASE}"
brand_lc = "${BRAND_LC}"

today = os.popen("date +%Y-%m-%d").read().strip()

# Load target keywords from brief if available
import json
try:
    with open('/tmp/seo-keyword-brief.json') as bf:
        brief = json.load(bf)
    head_kw = brief.get('head_keyword', '')
    target_kws = '; '.join(brief.get('target_keywords', []))
except:
    head_kw = ''
    target_kws = ''

kw_instruction = ""
if head_kw:
    kw_instruction = f"""
TU KHOA CHINH can tap trung: "{head_kw}"
TU KHOA DANG LONG-TAIL can long ghep:
{chr(10).join('- ' + kw for kw in brief.get('target_keywords', []))}

Yeu cau bo sung:
- Dua "{head_kw}" vao: tieu de (H1), doan mo dau, it nhat 2-3 lan trong than bai
- Dat tu khoa o vi tri tu nhien, khong nhen nhot (keyword stuffing)
- Long ghep it nhat 2 trong cac tu khoa long-tail vao noi dung"""

prompt = f"""Em la chuyen gia viet noi dung SEO chuyen sau cho cong ty vat lieu xay dung. Hay viet bai blog tieng Viet chat luong cao, 500-700 tu, chu de: '{topic_title} cho {brand}'.{kw_instruction}

Yeu cau chi tiet:
- Viet tu nhien, chuyen nghiep, giong van than thien va day du thong tin
- Tap trung chuyen sau vao san pham {desc}
- Phan tich chi tiet: tinh nang, loi ich, ung dung thuc te, kinh nghiem su dung
- Dua ra loi khuyen huu ich cho nguoi doc (cach chon, cach dung, luu y khi mua)
- Long ghep tu khoa mot cach tu nhien: {brand}, vat lieu xay dung Hai Phong, Tran Huu Minh
- Nhan manh: Cong ty TNHH XD & TM Huu Minh co dia chi tai TDP Quyet Tien, P. Nam Do Son, Hai Phong
- Long ghep it nhat 1 lan ten quan/huyen cu the cua Hai Phong (vi du: Do Son, Ngo Quyen, Hong Bang, Le Chan, Duong Kinh, Hai An, Kien An, An Duong, Thuy Nguyen)
- Ket thuc voi: Hotline/Zalo: 0378.679.633 - Email: vanhuufly@gmail.com - Website: tranhuuminhvlxd.id.vn

Viet lien mach thanh 4-7 doan van (moi doan 80-120 tu). KHONG them tieu de phu, chu thich hay giai thich gi khac ngoai noi dung bai viet."""

payload = {
    "model": "deepseek-r1:7b",
    "prompt": prompt,
    "stream": False,
    "options": {"num_predict": 3072, "temperature": 0.65, "top_p": 0.9}
}

try:
    req = urllib.request.Request(
        "http://localhost:11434/api/generate",
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=180) as resp:
        data = json.loads(resp.read())
        text = data.get("response", "")
except Exception:
    text = ""

if not text:
    text = "Bai viet chuyen sau ve {desc} tai Hai Phong. Lien he 0378.679.633 de duoc tu van mien phi."

text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()
text = text.replace("**", "").replace("__", "")
text = re.sub(r"  +", " ", text)

if "\n" in text and not text.startswith("<p>"):
    paragraphs = [p.strip() for p in text.split("\n") if p.strip()]
else:
    sentences = re.split(r"(?<=[.!?])\s+", text)
    sentences = [s.strip() for s in sentences if s.strip()]
    paragraphs = []
    buf = []
    for s in sentences:
        buf.append(s)
        if len(buf) >= 3 or s == sentences[-1]:
            paragraphs.append(" ".join(buf))
            buf = []
    if buf:
        paragraphs.append(" ".join(buf))

for p in paragraphs:
    print(f"<p>{p}</p>")
PYEOF

  DEEP_CONTENT=$(python3 "${TMPDIR}/gen_deep.py" 2>/dev/null || echo "")

  if [ -z "$DEEP_CONTENT" ]; then
    DEEP_CONTENT="<p>Bai viet chuyen sau ve ${DESC} tai Hai Phong. Lien he 0378.679.633 de duoc tu van mien phi.</p>"
  fi

  # Deep article metadata
  DEEP_META="${BRAND} - ${DEEP_TITLE_CASE} | Tran Huu Minh - VLXD & Chong Tham Hai Phong"
  DEEP_DESC="${BRAND} tai Hai Phong - Cong ty TNHH XD & TM Huu Minh. ${DEEP_TITLE_CASE}."

  # JSON-LD Schema
  case "${BRAND_LC}" in
    munich)    SCHEMA_N="Son va chong tham Munich" ; SCHEMA_D="Chong tham va son cao cap Đức -- NPP chinh thuc tai Hai Phong" ;;
    nanohouse) SCHEMA_N="Son gia da va chong tham Nanohouse" ; SCHEMA_D="Son gia da va chong tham Viet Nam -- NPP chinh thuc" ;;
    kova)      SCHEMA_N="Chong tham Kova va phu gia be tong" ; SCHEMA_D="Son va chong tham noi tieng Viet Nam -- Dai ly chinh thuc" ;;
    sika)      SCHEMA_N="Chong tham va hoa chat xay dung Sika" ; SCHEMA_D="Hoa chat xay dung va chong tham Thuy Sy -- Dai ly chinh thuc" ;;
    jotun)     SCHEMA_N="Son Jotun cao cap" ; SCHEMA_D="Son Na Uy hang dau the gioi -- Dai ly chinh thuc" ;;
    dulux)     SCHEMA_N="Son Dulux cao cap" ; SCHEMA_D="Son cao cap Anh Quoc (AkzoNobel) -- Dai ly chinh thuc" ;;
    nippon)    SCHEMA_N="Son Nippon cao cap" ; SCHEMA_D="Son Nhat Ban hang dau chau A -- Dai ly chinh thuc" ;;
    *)         SCHEMA_N="Vat lieu xay dung - ${BRAND}" ; SCHEMA_D="San pham ${BRAND} tai Hai Phong" ;;
  esac

  COMPANY_FOOTER="Cong ty TNHH XD & TM HUU MINH - MST: 0201961941 - Dia chi: TDP Quyet Tien, P. Nam Do Son, Hai Phong"

  cat > "${DEEP_FILE}" << HTMLBLOCK
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${DEEP_META}</title>
<meta name="description" content="${DEEP_DESC}">
<meta name="keywords" content="${BRAND}, ${DEEP_TOPIC}, VLXD Hai Phong, chong tham, Tran Huu Minh">
<meta property="og:title" content="${DEEP_META}">
<meta property="og:description" content="${DEEP_DESC}">
<meta property="og:image" content="https://tranhuuminhvlxd.id.vn/images/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://tranhuuminhvlxd.id.vn/blog/${DEEP_SLUG}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://tranhuuminhvlxd.id.vn/images/og-image.jpg">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${BRAND} - ${DEEP_TITLE_CASE}",
  "description": "${DEEP_DESC}",
  "author": {
    "@type": "Organization",
    "name": "CONG TY TNHH XD & TM HUU MINH"
  },
  "publisher": {
    "@type": "Organization",
    "name": "CONG TY TNHH XD & TM HUU MINH",
    "address": "TDP Quyet Tien, P. Nam Do Son, Hai Phong"
  }
}
</script>
</head>
<body style="font-family:Arial;max-width:800px;margin:auto;padding:20px;line-height:1.6;">
<h1>${BRAND} - ${DEEP_TITLE_CASE}</h1>
${DEEP_CONTENT}
<p><strong>${COMPANY_FOOTER}</strong></p>
<h2>📞 Lien he mua hang</h2>
<p><strong>CONG TY TNHH XD & TM HUU MINH</strong></p>
<p>Dia chi: TDP Quyet Tien, P. Nam Do Son, Hai Phong</p>
<p><strong>Hotline/Zalo: 0378.679.633</strong></p>
<p>Email: vanhuufly@gmail.com</p>
<p>Website: <a href="https://tranhuuminhvlxd.id.vn">tranhuuminhvlxd.id.vn</a></p>
<p><em>Bai viet chuyen sau duoc tao tu dong boi he thong May -- ${TODAY}</em></p>
</body>
</html>
HTMLBLOCK

  log "✅ Da tao bai viet chuyen sau: ${DEEP_SLUG}"

  # Update blog index
  NEW_ENTRY="<a href=\"/blog/${DEEP_SLUG}\" class=\"blog-item\"><span class=\"icon\">${ICON}</span><span class=\"info\"><span class=\"title\">${BRAND} - ${DEEP_TITLE_CASE} | Tran Huu Minh</span><span class=\"date\">📅 ${TODAY}</span></span></a>"

  if [ -f "${BLOG_DIR}/index.html" ]; then
    sed -i "0,/<div class=\"blog-list\">/!b; /<div class=\"blog-list\">/a\\
${NEW_ENTRY}" "${BLOG_DIR}/index.html" 2>/dev/null || true
    log "✅ Da cap nhat blog index"
  fi

  # Update brand page (via temp Python script)
  cat > "${TMPDIR}/update_brand.py" << PYEOF
import os, re

blog_dir = "/home/huu-minh/website-vlxd/blog"
brands_dir = "/home/huu-minh/website-vlxd/brands"
brand_lc = "${BRAND_LC}"
brand_name = "${BRAND}"

brands = [
    {"key": "munich", "name": "Munich"},
    {"key": "nanohouse", "name": "Nano House"},
    {"key": "dulux", "name": "Dulux"},
    {"key": "jotun", "name": "Jotun"},
    {"key": "kova", "name": "Kova"},
    {"key": "sika", "name": "Sika"},
    {"key": "nippon", "name": "Nippon"},
]

posts = []
for f in os.listdir(blog_dir):
    if not f.endswith(".html") or f == "index.html":
        continue
    fp = os.path.join(blog_dir, f)
    try:
        content = open(fp, encoding="utf-8").read()
        title_m = re.search(r"<title>(.*?)</title>", content)
        title = title_m.group(1).strip() if title_m else f
        date_m = re.search(r"(\d{4}-\d{2}-\d{2})", f)
        date = date_m.group(1) if date_m else ""
        b_key = "khac"
        for b in brands:
            if b["key"] in title.lower() or b["key"] in f.lower():
                b_key = b["key"]
                break
        posts.append({"file": f, "title": title, "date": date, "brand_key": b_key})
    except:
        continue

posts.sort(key=lambda x: x["date"], reverse=True)

bp_file = os.path.join(brands_dir, f"{brand_lc}.html")
if not os.path.isfile(bp_file):
    exit(0)

brand_posts = [p for p in posts if p["brand_key"] == brand_lc]
blog_items = ""
for p in brand_posts[:25]:
    blog_items += f'        <a href="/blog/{p["file"]}" class="brand-post-item">\n          <span class="post-title">{p["title"]}</span>\n          <span class="post-date">📅 {p["date"]}</span>\n        </a>\n'

html = open(bp_file, encoding="utf-8").read()
html = re.sub(
    r'<div class="brand-posts">.*?</div>',
    f'<div class="brand-posts">\n  <h2>📰 Bài viết về {brand_name}</h2>\n{blog_items}</div>',
    html, flags=re.DOTALL
)
with open(bp_file, "w", encoding="utf-8") as f:
    f.write(html)
print(f"Updated {bp_file}")
PYEOF

  python3 "${TMPDIR}/update_brand.py" 2>/dev/null || true
  log "✅ Da cap nhat brand page: ${BRAND_LC}.html"

else
  log "⏭️  GPU ban - bo qua bai viet chuyen sau"
fi

# ===== 4. REGENERATE SITEMAP =====
log ""
log "🗺️  TAO LAI SITEMAP..."
if [ -f "${BASE_DIR}/generate-sitemap.sh" ]; then
  SITEMAP_OUTPUT=$(bash "${BASE_DIR}/generate-sitemap.sh" 2>&1 || true)
  while IFS= read -r line; do
    [ -n "$line" ] && log "   ${line}"
  done <<< "$SITEMAP_OUTPUT"
  log "✅ Sitemap da duoc tao lai"
else
  log "⚠️  generate-sitemap.sh khong tim thay"
fi

# ===== 5. GIT COMMIT & PUSH =====
log ""
log "📤 GIT PUSH..."
cd "${BASE_DIR}"
git add -A 2>/dev/null || true
git commit -m "seo-daily: ${BRAND}-${TODAY}" --quiet 2>/dev/null || true
git push --quiet 2>&1 || log "⚠️  Git push that bai (se thu lai sau)"

# ===== 6. PING GOOGLE =====
log ""
log "📡 PING GOOGLE..."
curl -s "https://www.google.com/ping?sitemap=https://tranhuuminhvlxd.id.vn/sitemap.xml" > /dev/null 2>&1 && \
  log "✅ Google pinged" || log "⚠️  Google ping that bai"

# ===== 7. WEB CHECK =====
log ""
log "🔍 WEB CHECK..."
if [ -f "${BASE_DIR}/web-check.sh" ]; then
  CHECK_RESULT=$(bash "${BASE_DIR}/web-check.sh" 2>&1 || true)
  if echo "$CHECK_RESULT" | tail -1 | grep -q "OK"; then
    log "✅ Web-check OK"
  else
    log "⚠️  Web-check phat hien loi"
  fi
fi

# ===== CLEANUP GPU LOCK (neu co) =====
rm -f /tmp/gpu-guard.lock 2>/dev/null || true

# ===== KET THUC =====
log ""
log "============================================"
log "✅ SEO DAILY HOAN TAT — ${TODAY}"
log "============================================"
