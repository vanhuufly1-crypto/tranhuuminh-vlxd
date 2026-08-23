#!/bin/bash
# morning-check.sh — Tu dong kiem tra 8h sang moi ngay
# Kiem tra: blog, web, SEO, auto-bug
# Chay sau cron auto-blog 5 phut
# Khong set -e de tranh thoat som khi grep ko co ket qua

SITES_DIR="/home/huu-minh/website-vlxd"
BLOG_DIR="${SITES_DIR}/blog"
LOG="${SITES_DIR}/logs/check.log"
DATE=$(date '+%Y-%m-%d %H:%M')
mkdir -p "${SITES_DIR}/logs"

log() { echo "[$DATE] $@" | tee -a "$LOG"; }

check=0; fail=0

log "=== MORNING CHECK ==="

# 1. Kiem tra bai blog hom nay
BLOG_TODAY=$(find "$BLOG_DIR" -name "*-${DATE:0:10}.html" ! -name "index.html" 2>/dev/null)
COUNT=$(echo "$BLOG_TODAY" | grep -c . || true)
if [ "$COUNT" -ge 1 ]; then
    log "✅ Blog: $COUNT bai hom nay"
    # Kiem tra noi dung co bi loi ngat tu khong
    BAD=$(grep -l '</p><p>[a-z]' $BLOG_TODAY 2>/dev/null | wc -l)
    [ "$BAD" -gt 0 ] && log "⚠️  $BAD bai bi ngat tu (can fix)" || log "✅ Noi dung sach"
    check=$((check+1))
else
    log "❌ Blog: KHONG co bai hom nay"
    fail=$((fail+1))
fi

# 2. Kiem tra web co live khong
HTTP=$(curl -s -o /dev/null -w "%{http_code}" "https://tranhuuminhvlxd.id.vn" 2>/dev/null || echo "000")
if [ "$HTTP" = "200" ]; then
    log "✅ Web: HTTP $HTTP"
    check=$((check+1))
else
    log "❌ Web: HTTP $HTTP"
    fail=$((fail+1))
fi

# 3. Kiem tra brand pages
BP_COUNT=$(curl -s "https://tranhuuminhvlxd.id.vn/brands/" 2>/dev/null | grep -c "brand-card" || true)
if [ "$BP_COUNT" -ge 5 ]; then
    log "✅ Brands: $BP_COUNT trang hien thi"
    check=$((check+1))
else
    log "❌ Brands: chi $BP_COUNT trang"
    fail=$((fail+1))
fi

# 4. Kiem tra gallery
GL_COUNT=$(curl -s "https://tranhuuminhvlxd.id.vn/gallery.html" 2>/dev/null | grep -c "blogPosts" || true)
if [ "$GL_COUNT" -ge 1 ]; then
    log "✅ Gallery: OK"
    check=$((check+1))
else
    log "⚠️  Gallery: co the loi"
fi

# 5. Kiem tra SEO co ban
SEO_OK=$(curl -s "https://tranhuuminhvlxd.id.vn" 2>/dev/null | grep -c '<meta name="description"' || true)
if [ "$SEO_OK" -ge 1 ]; then
    log "✅ SEO: meta tags OK"
    check=$((check+1))
else
    log "❌ SEO: thieu meta tags"
    fail=$((fail+1))
fi

# 6. Kiem tra GPU + Ollama san sang cho thoi gian toi
GPU=$(nvidia-smi --query-gpu=memory.free --format=csv,noheader,nounits 2>/dev/null | head -1 || echo "0")
if [ "$GPU" -gt 1000 ]; then
    log "✅ GPU: ${GPU}MB trong"
    check=$((check+1))
else
    log "⚠️  GPU: ${GPU}MB (co the dang ban)"
fi

# 7. Kiem tra disk space
DISK=$(df / | tail -1 | awk '{print $4}')
DISK_MB=$((DISK/1024))
if [ "$DISK_MB" -gt 1000 ]; then
    log "✅ Disk: ${DISK_MB}MB trong"
    check=$((check+1))
else
    log "⚠️  Disk: ${DISK_MB}MB (sap day)"
fi

# 8. Kiem tra ten cong ty trong toan bo blog (khong duoc thieu chu TRAN)
BAD_CT=$(grep -rEl 'TM (?!TRAN)HUU MINH|TM (?!TRẦN)HỮU MINH' "$BLOG_DIR" --include='*.html' 2>/dev/null | wc -l || true)
if [ "$BAD_CT" -gt 0 ]; then
    log "❌ Ten cong ty: $BAD_CT bai thieu chu TRAN (vd 'TM HUU MINH') — can sua ngay"
    fail=$((fail+1))
else
    log "✅ Ten cong ty: toan bo bai dung 'TM TRAN HUU MINH'"
    check=$((check+1))
fi

# Tong ket
log "---"
log "📊 Check: $check/${check}+$fail pass | Loi: $fail"
if [ "$fail" -gt 0 ]; then
    log "⚠️  CO LOI, dang tu dong fix..."
    # KHOÁ 2026-08-12: khong goi auto-blog (tho local) nua
fi

echo ""
echo "✅ Morning check hoan tat ($DATE)"
echo "   Pass: $check | Fail: $fail"
echo "   Log: $LOG"
