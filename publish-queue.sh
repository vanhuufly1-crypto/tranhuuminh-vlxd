#!/bin/bash
# publish-queue.sh - Tu dong dang cac bai blog moi (do Claude soan) len web
# Dat trong thu muc website-vlxd/, chay dinh ky bang cron
cd /home/huu-minh/website-vlxd || exit 1
LOCK=/tmp/publish-queue.lock
[ -f "$LOCK" ] && exit 0
touch "$LOCK"
trap 'rm -f "$LOCK"' EXIT

mkdir -p logs
for f in *.html; do
  case "$f" in
    index.html|gallery.html|lien-he.html|tinh-toan.html|tro-thanh-dai-ly.html|huong-dan-thi-cong.html|san-pham-munich.html|bang-gia-munich.html|blog-input-*.html) continue ;;
  esac
  [ -f "blog/$f" ] && continue
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Phat hien bai moi: $f" >> logs/publish-queue.log
  ./blog-post.sh "$f" >> logs/publish-queue.log 2>&1
done
