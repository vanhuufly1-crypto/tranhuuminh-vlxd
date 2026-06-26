#!/bin/bash
# Start cloudflared quick tunnel and update api-config.js with the URL

LOGFILE="/home/huu-minh/website-vlxd/logs/tunnel.log"
CONFIG_FILE="/home/huu-minh/website-vlxd/js/api-config.js"

# Kill existing tunnel
pkill -f "cloudflared tunnel --url" 2>/dev/null

# Start tunnel and capture URL
cloudflared tunnel --url http://localhost:3001 --no-autoupdate > "$LOGFILE" 2>&1 &

# Wait for URL to appear
for i in $(seq 1 10); do
    sleep 2
    URL=$(grep -oP 'https://[a-z-]+\.trycloudflare\.com' "$LOGFILE" 2>/dev/null | head -1)
    if [ -n "$URL" ]; then
        echo "Tunnel URL: $URL"
        # Update api-config.js
        cat > "$CONFIG_FILE" << EOF
// 🌐 API Configuration for Trần Hữu Minh website
// Auto-updated by start-tunnel.sh
var API_URL = '$URL';
EOF
        echo "✅ Updated api-config.js with $URL"
        exit 0
    fi
done

echo "⚠️  Tunnel URL not found after 20s" >&2
exit 1
