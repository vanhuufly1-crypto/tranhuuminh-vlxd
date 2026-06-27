#!/bin/bash
# Start cloudflared quick tunnel and update api-config.js with the URL
# Runs via systemd tunnel.service

CONFIG_FILE="/home/huu-minh/website-vlxd/js/api-config.js"
TUNNEL_LOG="/home/huu-minh/website-vlxd/logs/tunnel.log"
PID_FILE="/tmp/cloudflared-tunnel.pid"

# Kill any existing cloudflared first
if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE")
    kill "$OLD_PID" 2>/dev/null || true
    rm -f "$PID_FILE"
fi
pkill -f "cloudflared tunnel --url" 2>/dev/null || true
sleep 1

# Clear old log
> "$TUNNEL_LOG"

echo "[$(date)] Starting tunnel..." | tee -a "$TUNNEL_LOG"

# Start tunnel
cloudflared tunnel --url http://localhost:3001 --no-autoupdate >> "$TUNNEL_LOG" 2>&1 &
CLOUDFLARED_PID=$!
echo "$CLOUDFLARED_PID" > "$PID_FILE"

# Wait for URL to appear
for i in $(seq 1 15); do
    sleep 2
    URL=$(grep -oP 'https://[a-z-]+\.trycloudflare\.com' "$TUNNEL_LOG" 2>/dev/null | head -1)
    if [ -n "$URL" ]; then
        echo "Tunnel URL: $URL" | tee -a "$TUNNEL_LOG"
        cat > "$CONFIG_FILE" <<- EOF
			// 🌐 API Configuration for Trần Hữu Minh website
			// Auto-updated by start-tunnel.sh
			var API_URL = '$URL';
		EOF
        echo "✅ Updated api-config.js with $URL" | tee -a "$TUNNEL_LOG"
        exit 0
    fi
done

echo "⚠️  Tunnel URL not found after 30s" | tee -a "$TUNNEL_LOG"
tail -10 "$TUNNEL_LOG" >&2
exit 1
