#!/bin/bash
# morning-report.sh — đọc check.log, xuất tóm tắt morning check gần nhất
LOG_FILE="/home/huu-minh/website-vlxd/logs/check.log"

if [ ! -f "$LOG_FILE" ]; then
    echo "⚠️ Không tìm thấy log"
    exit 1
fi

# Lấy dòng cuối chứa === MORNING CHECK ===
START_LINE=$(grep -n "=== MORNING CHECK ===" "$LOG_FILE" | tail -1 | cut -d: -f1)
if [ -z "$START_LINE" ]; then
    echo "⚠️ Không có dữ liệu check"
    exit 1
fi

# Đọc từ START_LINE đến hết file, lấy cho đến dòng ---
LATEST=$(sed -n "${START_LINE},\$p" "$LOG_FILE" | sed '/^---/q')

# Trích xuất thông tin
DATE=$(echo "$LATEST" | head -1 | grep -oP '\[\K[0-9\-]+')
BLOG=$(echo "$LATEST" | grep -oP '(?<=Blog: ).*')
WEB=$(echo "$LATEST" | grep -oP '(?<=Web: ).*')
GPU=$(echo "$LATEST" | grep -oP 'GPU: .*')
DISK=$(echo "$LATEST" | grep -oP 'Disk: .*')
SUMMARY=$(echo "$LATEST" | grep -oP '(?<=📊 Check: ).*')

echo "☀️  Morning Check — $DATE"
echo "📝 Blog: $BLOG"
echo "🌐 Web: $WEB"
echo "🎮 GPU: $(echo $GPU | sed 's/GPU: //')"
echo "💾 Disk: $(echo $DISK | sed 's/Disk: //')"
echo "📊 $SUMMARY"
