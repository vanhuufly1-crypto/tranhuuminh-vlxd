#!/bin/bash
# web-check.sh — Tự động kiểm tra website sau deploy
# Chạy sau mỗi git push / deploy
# 
# Usage: ./web-check.sh [url]
#   url: mặc định https://tranhuuminhvlxd.id.vn

set -euo pipefail

URL="${1:-https://tranhuuminhvlxd.id.vn}"
LOGFILE="${HOME}/.openclaw/workspace/web-check.log"
TEMP_FILE="/tmp/web-check-result.html"
BAD=false

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOGFILE"; }

log "🔍 Kiểm tra website: $URL"

# === 1. HTTP status ===
HTTP_CODE=$(curl -s -o "$TEMP_FILE" -w "%{http_code}" "$URL" --connect-timeout 10 --max-time 15)
if [ "$HTTP_CODE" != "200" ]; then
  log "❌ LỖI: HTTP $HTTP_CODE (phải là 200)"
  BAD=true
else
  log "✅ HTTP 200 OK"
fi

# === 2. Kích thước file (full version phải >= 20KB) ===
SIZE=$(wc -c < "$TEMP_FILE" 2>/dev/null || echo 0)
if [ "$SIZE" -lt 20000 ]; then
  log "❌ LỖI: index.html chỉ $SIZE bytes (< 20KB) — khả năng bị rút gọn!"
  BAD=true
else
  log "✅ index.html: $SIZE bytes (>= 20KB)"
fi

# === 3. Kiểm tra CSS link ===
if ! grep -q 'href="css/style.css"' "$TEMP_FILE" 2>/dev/null; then
  log "❌ LỖI: Thiếu link css/style.css"
  BAD=true
else
  log "✅ Có css/style.css"
fi

# === 4. Kiểm tra JS ===
if ! grep -q 'src="js/products.js"' "$TEMP_FILE" 2>/dev/null; then
  log "❌ LỖI: Thiếu js/products.js"
  BAD=true
else
  log "✅ Có js/products.js"
fi

if ! grep -q 'src="js/app.js"' "$TEMP_FILE" 2>/dev/null; then
  log "❌ LỖI: Thiếu js/app.js"
  BAD=true
else
  log "✅ Có js/app.js"
fi

# === 5. Kiểm tra nội dung chính ===
CONTENT_CHECKS=(
  "class=.nav.|Navigation menu"
  "class=.brand-content.|Khu vực sản phẩm"
  "class=.footer.|Footer"
  "class=.float-contact.|Nút liên hệ nổi"
  "id=.order-section.|Form đặt hàng"
  "ĐẶT HÀNG MUNICH|Tiêu đề form Munich"
  "id=.quote.|Form báo giá"
  "class=.brand-head.|Đầu danh mục hãng"
)

for check in "${CONTENT_CHECKS[@]}"; do
  PATTERN="${check%%|*}"
  LABEL="${check##*|}"
  if ! grep -qE "$PATTERN" "$TEMP_FILE" 2>/dev/null; then
    log "❌ LỖI: Thiếu '$LABEL'"
    BAD=true
  else
    log "✅ Có '$LABEL'"
  fi
done

# === 6. Kiểm tra blog index ===
BLOG_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/blog/" --connect-timeout 10 --max-time 10 2>/dev/null || echo "000")
if [ "$BLOG_CODE" != "200" ]; then
  log "⚠️  Blog: HTTP $BLOG_CODE (không phải 200)"
  # Không đánh BAD vì blog có thể chưa có
else
  log "✅ Blog: HTTP 200 OK"
fi

# === Kết luận ===
if $BAD; then
  log "🔥 CÓ LỖI — website cần kiểm tra lại!"
  echo ""
  echo "⚠️  WEB-CHECK: PHÁT HIỆN LỖI!"
  echo "   Xem log: $LOGFILE"
  echo "   Thời gian: $(date '+%Y-%m-%d %H:%M:%S')"
  exit 1
else
  log "🎉 OK — website hoạt động bình thường"
  echo ""
  echo "✅ WEB-CHECK: OK"
  exit 0
fi
