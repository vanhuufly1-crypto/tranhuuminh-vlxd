#!/usr/bin/env python3
# blog-auto.py [N] — Thợ 3.1 (Ollama may3.1:8b) viết N bài blog Munich, script dựng HTML rồi đăng.
# Công ty TNHH XD & TM TRẦN HỮU MINH — NPP Munich (Hải Phòng - Quảng Ninh - Hưng Yên)
import json, os, re, subprocess, sys, time, urllib.request
from datetime import datetime

WS = "/home/huu-minh/website-vlxd"
BLOG = os.path.join(WS, "blog")
MODEL = "may3.1:8b"
os.chdir(WS)

TOPICS = [
    "Chống thấm mái bê tông bằng Munich G20 (màng 2 thành phần)",
    "Sơn chống nóng mái tôn Munich UV20 giảm nhiệt mùa hè",
    "Chống thấm nhà vệ sinh, ban công bằng Munich G20C",
    "Sơn nội thất Munich Luxury chống bám bẩn, lau chùi",
    "Sơn ngoại thất Munich chịu mặn ven biển Hải Phòng",
    "Chống thấm bể nước ăn, bể cá Koi bằng Munich G20C-Đen",
    "Sơn epoxy sàn nhà xưởng Munich EP11/EP12",
    "Xử lý tường ẩm mốc, muối nở mùa mưa ở Hải Phòng",
    "Keo chống thấm sân thượng Munich PU S700 chịu nứt động",
    "Vữa rót không co ngót Munich Grout G650 cho chân cột",
    "Chống thấm tầng hầm, bể bơi bằng Munich G20S",
    "Sơn chống gỉ Munich MK1 cho cổng sắt, hàng rào trước Tết",
    "Keo dán gạch Munich Tile G07 chống bong tróc",
    "Chống thấm cổ điển: chọn đúng sản phẩm Munich cho từng hạng mục",
]

def existing_slugs():
    return set(os.listdir(BLOG)) if os.path.isdir(BLOG) else set()

def corpus():
    txt = ""
    try:
        names = os.listdir(BLOG)
    except Exception:
        names = []
    for fn in names:
        if not fn.endswith(".html"):
            continue
        try:
            txt += open(os.path.join(BLOG, fn), encoding="utf-8", errors="ignore").read().lower()
        except Exception:
            pass
    return txt

def ask31(topic):
    sysmsg = ("Bạn là Mây, nhân viên viết nội dung cho CÔNG TY TNHH XD & TM TRẦN HỮU MINH "
              "(Nhà phân phối Munich, phục vụ Hải Phòng - Quảng Ninh - Hưng Yên). "
              "CHỈ dùng thương hiệu Munich, không nhắc hãng khác. "
              "Trả lời ĐÚNG định dạng: dòng đầu 'TIÊU ĐỀ: <tiêu đề hấp dẫn>', "
              "rồi đến các đoạn văn ngăn cách bằng dòng trống. Không in JSON, không markdown, không giải thích thêm.")
    user = (f"Viết 1 bài blog 450-600 từ, chủ đề: {topic}.\n"
            "Mở bài bằng tình huống thực tế gần gũi (nhà ở Hải Phòng/Quảng Ninh/Hưng Yên). "
            "Thân bài: kiến thức + quy trình/cách làm + lưu ý thi công, gắn với sản phẩm Munich phù hợp. "
            "Cuối bài mời liên hệ Hotline/Zalo 0378.679.633. "
            "Viết tiếng Việt chuẩn chính tả, xưng 'bên em', gọi khách 'anh/chị'. "
            "Nêu tên đầy đủ công ty 'CÔNG TY TNHH XD & TM TRẦN HỮU MINH' ở cuối bài.")
    body = json.dumps({"model": MODEL,
        "messages": [{"role": "system", "content": sysmsg}, {"role": "user", "content": user}],
        "stream": False, "options": {"num_ctx": 8192, "temperature": 0.6}, "keep_alive": -1}).encode()
    req = urllib.request.Request("http://127.0.0.1:11434/api/chat", data=body,
                                 headers={"Content-Type": "application/json"})
    r = json.load(urllib.request.urlopen(req, timeout=900))
    return r.get("message", {}).get("content", "")

def slugify(s):
    s = s.lower()
    s = re.sub(r'[àáạảãâầấậẩẫăằắặẳẵ]', 'a', s)
    s = re.sub(r'[èéẹẻẽêềếệểễ]', 'e', s)
    s = re.sub(r'[ìíịỉĩ]', 'i', s)
    s = re.sub(r'[òóọỏõôồốộổỗơờớợởỡ]', 'o', s)
    s = re.sub(r'[ùúụủũưừứựửữ]', 'u', s)
    s = re.sub(r'[ỳýỵỷỹ]', 'y', s)
    s = re.sub(r'[đ]', 'd', s)
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s[:70]

def build_html(title, paras):
    body = "\n".join(f"<p>{p}</p>" for p in paras)
    return f"""<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>{title} | Trần Hữu Minh - VLXD &amp; Chống Thấm Hải Phòng</title>
<meta name="description" content="{title}. Tư vấn sản phẩm Munich chính hãng tại Hải Phòng - Quảng Ninh - Hưng Yên. Hotline 0378.679.633.">
<meta name="keywords" content="Munich, chống thấm, sơn, Trần Hữu Minh, Hải Phòng, Quảng Ninh, Hưng Yên">
</head>
<body style="font-family:Arial;max-width:800px;margin:auto;padding:20px;line-height:1.6;">
<h1>{title}</h1>
{body}
<p><strong>Công ty TNHH XD &amp; TM TRẦN HỮU MINH - MST: 0201961941 - Địa chỉ: TDP Quyết Tiến, P. Nam Đồ Sơn, Hải Phòng</strong></p>
<h2>📞 Liên hệ mua hàng</h2>
<p><strong>CÔNG TY TNHH XD &amp; TM TRẦN HỮU MINH</strong></p>
<p>Địa chỉ: TDP Quyết Tiến, P. Nam Đồ Sơn, Hải Phòng</p>
<p><strong>Hotline/Zalo: 0378.679.633</strong></p>
<p>Website: <a href="https://tranhuuminhvlxd.id.vn">tranhuuminhvlxd.id.vn</a></p>
</body>
</html>
"""

def today_count(date):
    n = 0
    try:
        for fn in os.listdir(BLOG):
            if fn.endswith(".html") and date in fn:
                n += 1
    except Exception:
        pass
    return n

def main():
    target = int(sys.argv[1]) if len(sys.argv) > 1 else 2
    date = datetime.now().strftime("%Y-%m-%d")
    # lock chong chay trung
    lock = "/tmp/blog-auto.lock"
    if os.path.exists(lock):
        print("Đang chạy rồi, bỏ qua."); return
    open(lock, "w").write(str(os.getpid()))
    try:
        need = target - today_count(date)
        print(f"Hôm nay đã có {today_count(date)}/{target} bài → cần thêm {max(0,need)}.")
        if need <= 0:
            print("Đã đủ bài hôm nay, không cần thêm."); return
        have = existing_slugs()
        corp = corpus()
        done = 0
        used = []
        for topic in TOPICS:
            if done >= need:
                break
            tslug = slugify(topic)
            codes = re.findall(r'[A-Z]{1,5}\s?\d{1,4}[A-Z]?', topic)
            key = (codes[-1].replace(" ", "").lower() if codes else tslug.split("-")[0])
            if key and key in corp:
                continue
            if any(tslug in s or key in s.lower() for s in have):
                continue
            if key in used:
                continue
            used.append(key)
            slug = tslug + f"-{date}"
            try:
                out = ask31(topic)
            except Exception as e:
                print("LOI goi 3.1:", e)
                continue
            lines = [l.strip() for l in out.splitlines()]
            title = ""
            for l in lines:
                if l.upper().startswith("TIÊU ĐỀ:"):
                    title = l.split(":", 1)[1].strip()
                    break
            if not title:
                title = topic
            paras = [l for l in lines if l and not l.upper().startswith("TIÊU ĐỀ:")]
            html = build_html(title, paras)
            fname = f"{slug}.html"
            fpath = os.path.join(WS, fname)
            open(fpath, "w", encoding="utf-8").write(html)
            print(f"--- Bài {done+1}: {title}")
            rc = subprocess.run(["bash", os.path.join(WS, "blog-post.sh"), fpath]).returncode
            if rc == 0:
                done += 1
                corp += html.lower()
            else:
                print("   ❌ blog-post.sh FAIL cho bài này")
        print(f"==> Đã đăng {done}/{need} bài")
    finally:
        try: os.remove(lock)
        except Exception: pass

if __name__ == "__main__":
    main()
