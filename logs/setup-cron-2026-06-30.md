# Hướng Dẫn Setup Cron cho SEO Daily

**Ngày:** 2026-06-30  
**Tác vụ:** Chạy seo-daily.sh mỗi ngày lúc 09:00 (Asia/Bangkok)

## Cấu hình OpenClaw Cron

Sử dụng lệnh sau để tạo cron job qua OpenClaw CLI:

```bash
openclaw cron create --name "seo-daily" \
  --schedule "0 9 * * *" \
  --timezone "Asia/Bangkok" \
  --task "/home/huu-minh/website-vlxd/seo-daily.sh"
```

## Hoặc dùng systemd timer (nếu không có OpenClaw CLI)

### 1. Tạo service file

```bash
sudo tee /etc/systemd/system/seo-daily.service << 'SERVICE'
[Unit]
Description=SEO Daily - Auto blog & SEO analysis for tranhuuminhvlxd.id.vn
After=network.target ollama.service

[Service]
Type=oneshot
ExecStart=/home/huu-minh/website-vlxd/seo-daily.sh
User=huu-minh
Group=huu-minh
WorkingDirectory=/home/huu-minh/website-vlxd
StandardOutput=append:/home/huu-minh/website-vlxd/logs/seo-daily.log
StandardError=append:/home/huu-minh/website-vlxd/logs/seo-daily.log
SERVICE
```

### 2. Tạo timer file

```bash
sudo tee /etc/systemd/system/seo-daily.timer << 'TIMER'
[Unit]
Description=Run SEO Daily at 09:00 daily

[Timer]
OnCalendar=daily
Persistent=true
RandomizedDelaySec=300

[Install]
WantedBy=timers.target
TIMER
```

### 3. Enable & start

```bash
sudo systemctl daemon-reload
sudo systemctl enable seo-daily.timer
sudo systemctl start seo-daily.timer
```

## Script liên quan

| File | Mô tả |
|---|---|
| `/home/huu-minh/website-vlxd/seo-daily.sh` | Script SEO chính |
| `/home/huu-minh/website-vlxd/auto-blog.sh` | Script auto-blog (5 bài/ngày) |
| `/home/huu-minh/website-vlxd/generate-sitemap.sh` | Tạo sitemap.xml |
| `/home/huu-minh/website-vlxd/web-check.sh` | Kiểm tra website sau deploy |
| `/home/huu-minh/.openclaw/workspace/gpu-guard.sh` | GPU guard check |

## Log files

| File | Mô tả |
|---|---|
| `/home/huu-minh/website-vlxd/logs/seo-daily.log` | Log SEO daily |
| `/home/huu-minh/website-vlxd/logs/auto-blog.log` | Log auto-blog |
| `/home/huu-minh/.openclaw/workspace/gpu-guard.log` | Log GPU guard |

## Kiểm tra hoạt động

Kiểm tra timer đã chạy:
```bash
systemctl status seo-daily.timer
systemctl list-timers --all | grep seo-daily
```

Xem log gần nhất:
```bash
tail -f /home/huu-minh/website-vlxd/logs/seo-daily.log
```
