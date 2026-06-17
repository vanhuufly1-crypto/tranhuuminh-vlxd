#!/bin/bash
# auto-blog.sh - Thợ quảng cáo tự động viết bài cho website
# Chạy bởi cron, 5 lần/ngày
# Thợ: llama3.2:3b (viết content) + shell script (deploy)

set -e
cd /home/huu-minh/website-vlxd

# === Cấu hình ===
SITES_DIR="/home/huu-minh/website-vlxd"
BLOG_DIR="${SITES_DIR}/blog"
TODAY="$(date +%d-%m-%Y)"
HOUR="$(date +%H%M)"
ALLOW_DIRS=("Munich" "Nanohouse" "Kova" "Sika" "Jotun" "Nippon" "Dulux" "MPE")

# Topic tuỳ theo khung giờ
case "$(date +%H)" in
  08) TOPIC="Munich"; ICON="🛡️"; KEYWORDS="sơn Munich, chống thấm, NPP chính thức" ;;
  10) TOPIC="Nanohouse"; ICON="🏡"; KEYWORDS="sơn giả đá Nanohouse, trang trí ngoại thất, NPP" ;;
  14) TOPIC="Kova"; ICON="🏺"; KEYWORDS="chống thấm Kova, phụ gia bê tông, VLXD" ;;
  16) TOPIC="Sika"; ICON="🧪"; KEYWORDS="Sika, chống thấm, vật liệu xây dựng" ;;
  20) TOPIC="Jotun"; ICON="🖌️"; KEYWORDS="sơn Jotun, sơn nước, báo giá" ;;
  *) TOPIC="Munich"; ICON="🛡️"; KEYWORDS="Munich, VLXD" ;;
esac

# Chọn sub-topic theo ngày (xoay vòng)
DAY_OF_MONTH=$(date +%d)
SUBTYPE=$(( (DAY_OF_MONTH % 5) + 1 ))

case $SUBTYPE in
  1) SUBTOPIC="bảng giá ${TOPIC} mới nhất tại Hải Phòng"
     ANGLE="cập nhật giá, chiết khấu, ưu đãi" ;;
  2) SUBTOPIC="hướng dẫn thi công ${TOPIC} đúng kỹ thuật"
     ANGLE="quy trình thi công, mẹo, lưu ý" ;;
  3) SUBTOPIC="so sánh ${TOPIC} với các thương hiệu khác"
     ANGLE="ưu nhược điểm, giá cả, chất lượng" ;;
  4) SUBTOPIC="kinh nghiệm chọn mua ${TOPIC}"
     ANGLE="tips, lưu ý, tránh hàng giả" ;;
  5) SUBTOPIC="ứng dụng ${TOPIC} trong xây dựng nhà ở"
     ANGLE="công trình thực tế, mẫu, giải pháp" ;;
esac

# Tạo slug
SLUG="$(echo "${TOPIC}-${SUBTOPIC}" | iconv -t ascii//TRANSLIT | sed 's/[^a-zA-Z0-9]/-/g' | tr '[:upper:]' '[:lower:]' | sed 's/--*/-/g; s/^-//; s/-$//')"
SLUG="${SLUG}-$(date +%Y-%m-%d).html"

# Tạo nội dung bằng llama3.2:3b - thợ quảng cáo
PROMPT="Viết bài blog SEO tiếng Việt, 150-200 từ, chủ đề '${SUBTOPIC}'. 
Góc nhìn: ${ANGLE}. 
Phong cách chuyên nghiệp, tự nhiên. 
Nhấn mạnh: Công ty TNHH XD & TM Hữu Minh là địa chỉ tin cậy tại Hải Phòng. 
Kết thúc: Hotline/Zalo: 0378.679.633 - Email: vanhuufly@gmail.com - Website: https://tranhuuminhvlxd.id.vn
Chỉ viết nội dung bài blog, không thêm chú thích, không thêm giải thích."

CONTENT=$(ollama run llama3.2:3b "$PROMPT" 2>/dev/null | tr -d '\000-\010\016-\037' | sed 's/\x1b\[[0-9;]*[a-zA-Z]//g')

# Làm sạch ANSI codes
CONTENT_CLEAN=$(echo "$CONTENT" | sed 's/\x1b\[[0-9;]*[a-zA-Z]//g; s/\[[0-9]\+D//g; s/\[K//g; s/\[[0-9]\+[a-zA-Z]//g')

# Tạo file HTML
TITLE=$(echo "$SUBTOPIC" | sed 's/.*/\u&/')
META_DESC="${TOPIC} tại Hải Phòng | Công ty TNHH XD & TM Hữu Minh - ${SUBTOPIC}"

cat > "${BLOG_DIR}/${SLUG}" << HTMLBLOCK
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${TITLE} | Trần Hữu Minh</title>
<meta name="description" content="${META_DESC}">
</head>
<body style="font-family:Arial;max-width:800px;margin:auto;padding:20px;line-height:1.6;">
<h1>${TITLE}</h1>
$(echo "$CONTENT_CLEAN" | sed 's/^$/<\/p><p>/g' | sed 's/^/<p>/; s/$/<\/p>/')
<h2>📞 Liên hệ mua hàng</h2>
<p><strong>Hotline/Zalo: 0378.679.633</strong></p>
<p>Email: vanhuufly@gmail.com</p>
<p>Website: <a href="https://tranhuuminhvlxd.id.vn">tranhuuminhvlxd.id.vn</a></p>
<p><em>Bài viết được tạo tự động bởi hệ thống — $(date '+%d/%m/%Y')</em></p>
</body>
</html>
HTMLBLOCK

echo "Đã tạo: ${BLOG_DIR}/${SLUG}"

# Update blog index - thêm entry mới vào đầu danh sách
NEW_ENTRY="<a href=\"/blog/${SLUG}\" class=\"blog-item\"><span class=\"icon\">${ICON}</span><span class=\"info\"><span class=\"title\">${TOPIC} - ${SUBTOPIC} | Trần Hữu Minh</span><span class=\"date\">📅 $(date +%Y-%m-%d)</span></span></a>"

# Chèn ngay sau dòng có class="blog-list"
sed -i "0,/<div class=\"blog-list\">/!b; /<div class=\"blog-list\">/a\\${NEW_ENTRY}" "${BLOG_DIR}/index.html"

# Deploy
git add -A
git commit -m "auto-blog: ${TOPIC} - $(date '+%H:%M %d/%m/%Y')" --quiet
git push --quiet

echo "✅ Deploy xong: ${SLUG}"
