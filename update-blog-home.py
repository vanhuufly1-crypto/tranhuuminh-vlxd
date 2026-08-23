#!/usr/bin/env python3
# update-blog-home.py — Cập nhật mục "Bài viết mới nhất" trên trang chủ
# Lấy 6 bài mới nhất từ blog/index.html, thay vào index.html tại marker
# Chạy bởi blog-post.sh sau mỗi lần đăng bài (và chạy tay khi cần)
import re, os

BASE = os.path.dirname(os.path.abspath(__file__))
IDX = os.path.join(BASE, 'index.html')
BLOG_IDX = os.path.join(BASE, 'blog', 'index.html')
MAX = 6

with open(BLOG_IDX, encoding='utf-8') as f:
    blog = f.read()

# Lấy các entry blog-item theo thứ tự (entry đầu = mới nhất)
matches = list(re.finditer(r'<a href="(/blog/[^"]+)" class="blog-item">.*?</a>', blog, re.S))
if not matches:
    print("⚠️ Không tìm thấy entry nào trong blog/index.html")
    raise SystemExit(1)

cards = []
for m in matches[:MAX]:
    e = m.group(0)
    href = m.group(1)
    title_m = re.search(r'class="title">(.*?)</span>', e, re.S)
    date_m = re.search(r'class="date">📅\s*([^<]*)</span>', e, re.S)
    title = title_m.group(1).strip() if title_m else href.split('/')[-1]
    # Bỏ phần " | Trần Hữu Minh ..." phía sau cho gọn
    title = re.split(r'\s*\|\s*', title)[0].strip()
    date = date_m.group(1).strip() if date_m else ''
    cards.append(f'<a href="{href}" class="blog-card"><span class="bc-title">{title}</span><span class="bc-date">📅 {date}</span></a>')

block = '\n'.join(cards)

with open(IDX, encoding='utf-8') as f:
    html = f.read()

marker_start = '<!-- BLOG-MOI-NHAT-START -->'
marker_end = '<!-- BLOG-MOI-NHAT-END -->'
if marker_start in html and marker_end in html:
    new_html = re.sub(
        re.escape(marker_start) + r'.*?' + re.escape(marker_end),
        marker_start + '\n' + block + '\n' + marker_end,
        html, flags=re.S
    )
else:
    print("❌ Không thấy marker trong index.html — cần thêm section trước")
    raise SystemExit(1)

with open(IDX, 'w', encoding='utf-8') as f:
    f.write(new_html)
print(f"✅ Đã cập nhật {len(cards)} bài mới nhất lên trang chủ")
