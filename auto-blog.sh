#!/bin/bash
# auto-blog.sh - Thợ quảng cáo tự động viết bài cho website
# Chạy bởi cron, 5 lần/ngày
# Thợ: llama3.2:3b (viết content) + shell script (deploy)

set -e
cd /home/huu-minh/website-vlxd

# === Cấu hình ===
SITES_DIR="/home/huu-minh/website-vlxd"
BLOG_DIR="${SITES_DIR}/blog"
TODAY="$(date '+%Y-%m-%d')"

# Topic tuỳ theo khung giờ
case "$(date +%H)" in
  08) BRAND="Munich";     ICON="🛡️"; DESC="sơn và chống thấm Munich" ;;
  10) BRAND="Nanohouse";  ICON="🏡"; DESC="sơn giả đá và chống thấm Nanohouse" ;;
  14) BRAND="Kova";       ICON="🏺"; DESC="chống thấm Kova và phụ gia bê tông" ;;
  16) BRAND="Sika";       ICON="🧪"; DESC="chống thấm và hóa chất xây dựng Sika" ;;
  20) BRAND="Jotun";      ICON="🖌️"; DESC="sơn Jotun cao cấp" ;;
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

# Tạo nội dung bằng llama3.2:3b
PROMPT="Em là nhân viên viết nội dung cho công ty vật liệu xây dựng. Hãy viết bài blog SEO tiếng Việt, khoảng 150-250 từ, chủ đề: '${SUBTOPIC}'.

Yêu cầu:
- Viết tự nhiên, chuyên nghiệp, dễ đọc
- Tập trung vào sản phẩm ${DESC}
- Nhấn mạnh: Công ty TNHH XD & TM Hữu Minh có địa chỉ tại TDP Quyết Tiến, P. Nam Đồ Sơn, Hải Phòng
- Kết thúc với: Hotline/Zalo: 0378.679.633 - Email: vanhuufly@gmail.com - Website: tranhuuminhvlxd.id.vn

Viết liền mạch, không xuống dòng. KHÔNG thêm chú thích hay giải thích gì khác."

CONTENT=$(ollama run llama3.2:3b "$PROMPT" 2>/dev/null)
# Làm sạch ANSI và ký tự điều khiển
CONTENT=$(echo "$CONTENT" | sed 's/\x1b\[[0-9;]*[a-zA-Z]//g; s/\[[0-9]\+D//g; s/\[K//g; s/\[[0-9]\+[a-zA-Z]//g' | tr -s '[:space:]')

# Tạo HTML từ nội dung (mỗi dòng là 1 đoạn văn)
PARAGRAPHS=""
while IFS= read -r line; do
  line=$(echo "$line" | xargs)
  [ -z "$line" ] && continue
  PARAGRAPHS="${PARAGRAPHS}<p>${line}</p>"
done <<< "$CONTENT"

TITLE=$(echo "$SUBTOPIC" | sed 's/^./\u&/')
META_DESC="${BRAND} tại Hải Phòng - Công ty TNHH XD & TM Hữu Minh. ${SUBTOPIC}"

cat > "${BLOG_DIR}/${SLUG}" << HTMLBLOCK
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${TITLE} | Trần Hữu Minh - VLXD & Chống Thấm Hải Phòng</title>
<meta name="description" content="${META_DESC}">
<meta name="keywords" content="${BRAND}, ${SUBTOPIC}, VLXD Hải Phòng, chống thấm, Trần Hữu Minh">
</head>
<body style="font-family:Arial;max-width:800px;margin:auto;padding:20px;line-height:1.6;">
<h1>${TITLE}</h1>
${PARAGRAPHS}
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

# Update blog index - thêm entry mới vào đầu danh sách
NEW_ENTRY="<a href=\"/blog/${SLUG}\" class=\"blog-item\"><span class=\"icon\">${ICON}</span><span class=\"info\"><span class=\"title\">${BRAND} - ${SUBTOPIC} | Trần Hữu Minh</span><span class=\"date\">📅 ${TODAY}</span></span></a>"

# Tìm dòng <div class="blog-list"> và chèn ngay sau nó
sed -i "0,/<div class=\"blog-list\">/!b; /<div class=\"blog-list\">/a\\
${NEW_ENTRY}" "${BLOG_DIR}/index.html"

# Commit & push
git add -A
git commit -m "auto-blog: ${BRAND} - ${TODAY}" --quiet || true
git push --quiet 2>&1 || echo "⚠️ Push may have failed, will retry next time"

# === KIỂM TRA SAU DEPLOY ===
${SITES_DIR}/web-check.sh || echo "⚠️  Web-check phát hiện lỗi! Xem log để biết chi tiết."

echo "✅ Deploy xong: ${BRAND} - ${SUBTOPIC}"
