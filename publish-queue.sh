#!/bin/bash
# publish-queue.sh - Tu dong dang bai blog moi (do Claude soan) len web
# Gioi han: toi da 3 bai/ngay. Dat trong thu muc website-vlxd/, chay dinh ky bang cron
cd /home/huu-minh/website-vlxd || exit 1
LOCK_DIR=/tmp/publish-queue.lock.d
mkdir "$LOCK_DIR" 2>/dev/null || exit 0
trap 'rmdir "$LOCK_DIR"' EXIT

mkdir -p logs
TODAY=$(date '+%Y-%m-%d')
COUNT_FILE="logs/publish-count-${TODAY}.txt"
COUNT=$(cat "$COUNT_FILE" 2>/dev/null || echo 0)
MAX_PER_DAY=3

for f in *.html; do
  if [ "$COUNT" -ge "$MAX_PER_DAY" ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Da dat gioi han ${MAX_PER_DAY} bai/ngay, dung lai." >> logs/publish-queue.log
    break
  fi
  case "$f" in
    index.html|gallery.html|lien-he.html|tinh-toan.html|tro-thanh-dai-ly.html|huong-dan-thi-cong.html|san-pham-munich.html|bang-gia-munich.html|blog-input-*.html) continue ;;
  esac
  [ -f "blog/$f" ] && continue
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Phat hien bai moi: $f" >> logs/publish-queue.log
  if ./blog-post.sh "$f" >> logs/publish-queue.log 2>&1; then
    COUNT=$((COUNT+1))
    echo "$COUNT" > "$COUNT_FILE"
  fi
done
