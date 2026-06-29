#!/bin/bash
# generate-sitemap.sh - Tự động tạo sitemap.xml cho website Trần Hữu Minh VLXD
# Thợ R1: deepseek-r1:7b

set -e
cd /home/huu-minh/website-vlxd

BASE_URL="https://tranhuuminhvlxd.id.vn"
SITEMAP="sitemap.xml"
TODAY="$(date '+%Y-%m-%d')"

echo "🔧 Đang tạo sitemap.xml..."

# Bắt đầu XML
cat > "${SITEMAP}" << 'XMLHEAD'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
XMLHEAD

# Hàm lấy ngày sửa đổi cuối từ file
get_lastmod() {
    local file="$1"
    if [ -f "$file" ]; then
        date -r "$file" '+%Y-%m-%d' 2>/dev/null || echo "${TODAY}"
    else
        echo "${TODAY}"
    fi
}

# === 1. Trang chủ ===
echo "  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>" >> "${SITEMAP}"

# === 2. Gallery ===
LASTMOD=$(get_lastmod "gallery.html")
echo "  <url>
    <loc>${BASE_URL}/gallery.html</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>" >> "${SITEMAP}"

# === 3. Các trang brands/ ===
if [ -d "brands" ]; then
    for f in brands/*.html; do
        [ -f "$f" ] || continue
        filename=$(basename "$f")
        LASTMOD=$(get_lastmod "$f")
        echo "  <url>
    <loc>${BASE_URL}/${f}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>" >> "${SITEMAP}"
    done
fi

# === 4. Blog index ===
LASTMOD=$(get_lastmod "blog/index.html")
echo "  <url>
    <loc>${BASE_URL}/blog/index.html</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>" >> "${SITEMAP}"

# === 5. Các bài blog (trừ index.html) ===
if [ -d "blog" ]; then
    for f in blog/*.html; do
        [ -f "$f" ] || continue
        filename=$(basename "$f")
        [ "$filename" = "index.html" ] && continue
        LASTMOD=$(get_lastmod "$f")
        echo "  <url>
    <loc>${BASE_URL}/${f}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>" >> "${SITEMAP}"
    done
fi

# === Đóng XML ===
echo "</urlset>" >> "${SITEMAP}"

echo "✅ Đã tạo sitemap.xml với $(grep -c '<loc>' "${SITEMAP}") URL"
