#!/usr/bin/env python3
"""
🎬 Mây Hoạt Hình — Bot làm video hoạt hình vui nhộn cho VLHT Trần Hữu Minh
Dùng: Pillow vẽ nhân vật stickman + MoviePy ghép video + ffmpeg
"""

import os, sys, json, math, random, textwrap
from PIL import Image, ImageDraw, ImageFont
import numpy as np
from moviepy import *

# ─── CẤU HÌNH ─────────────────────────────────────────────
W, H = 720, 1280  # TikTok 9:16
FPS = 24
OUTPUT_DIR = os.path.expanduser("~/.openclaw/workspace/tranhuuminh-vlxd/video-hoathinh")
FONT_DIR = os.path.dirname(os.path.abspath(__file__))

os.makedirs(OUTPUT_DIR, exist_ok=True)

# ─── MÀU SẮC ─────────────────────────────────────────────
COLORS = {
    "bg": "#E8F5E9",
    "skin": "#FFCC80",
    "skin_dark": "#E65100",
    "body": "#1565C0",      # Áo thợ sơn xanh
    "body2": "#2E7D32",     # Áo khách green
    "pants": "#424242",
    "shoe": "#212121",
    "text": "#1A237E",
    "bubble": "#FFFFFF",
    "bubble_border": "#BBDEFB",
    "caption": "#FF5722",
    "house_wall": "#FFE0B2",
    "house_roof": "#D84315",
    "rain": "#42A5F5",
    "floor": "#A1887F",
}

# ─── TÌM FONT ─────────────────────────────────────────────
def find_font():
    paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            return p
    # fallback
    for root, dirs, files in os.walk("/usr/share/fonts"):
        for f in files:
            if f.endswith(".ttf") and "Bold" in f:
                return os.path.join(root, f)
    return None

FONT_PATH = find_font()

def get_font(size=32):
    if FONT_PATH:
        try:
            return ImageFont.truetype(FONT_PATH, size)
        except:
            pass
    return ImageFont.load_default()

# ─── VẼ NHÂN VẬT STICKMAN ────────────────────────────────
def draw_stickman(draw, x, y, scale=1.0, color="blue", hat=False, holding=None, expression="normal"):
    """Vẽ stickman đơn giản, dễ thương"""
    s = scale
    skin = COLORS["skin"]
    body = COLORS["body"] if color == "blue" else COLORS["body2"]
    
    # Tỷ lệ: đầu = 40*scale, thân = 90*scale
    head_r = int(40 * s)
    head_cx, head_cy = x, y - int(125 * s)
    body_top = y - int(85 * s)
    body_bot = y + int(5 * s)
    
    # ═══ Vẽ thân ═══
    # Quần
    draw.rectangle([x - int(18*s), y - int(20*s), x + int(18*s), y + int(10*s)], 
                   fill=COLORS["pants"], outline=COLORS["shoe"], width=2)
    # Chân
    draw.line([x - int(10*s), y + int(10*s), x - int(20*s), y + int(45*s)], 
              fill=COLORS["shoe"], width=int(6*s))
    draw.line([x + int(10*s), y + int(10*s), x + int(20*s), y + int(45*s)], 
              fill=COLORS["shoe"], width=int(6*s))
    # Giày
    draw.ellipse([x - int(25*s), y + int(40*s), x - int(12*s), y + int(50*s)], 
                 fill=COLORS["shoe"])
    draw.ellipse([x + int(12*s), y + int(40*s), x + int(25*s), y + int(50*s)], 
                 fill=COLORS["shoe"])
    
    # Tay trái
    draw.line([x - int(18*s), body_top + int(20*s), x - int(45*s), y - int(40*s)], 
              fill=skin, width=int(5*s))
    draw.ellipse([x - int(48*s), y - int(44*s), x - int(40*s), y - int(36*s)], 
                 fill=skin)
    
    # Tay phải (có thể cầm đồ)
    if holding == "roller":
        # Cầm con lăn sơn
        draw.line([x + int(18*s), body_top + int(20*s), x + int(50*s), y - int(20*s)], 
                  fill=skin, width=int(5*s))
        draw.rectangle([x + int(45*s), y - int(35*s), x + int(62*s), y - int(18*s)], 
                       fill="#795548", outline="#4E342E", width=2)
        draw.ellipse([x + int(40*s), y - int(38*s), x + int(68*s), y - int(10*s)], 
                     fill="#BDBDBD", outline="#757575", width=2)
        draw.ellipse([x + int(45*s), y - int(33*s), x + int(63*s), y - int(15*s)], 
                     fill=COLORS["body"])
    elif holding == "phone":
        draw.line([x + int(18*s), body_top + int(20*s), x + int(40*s), y - int(30*s)], 
                  fill=skin, width=int(5*s))
        draw.rectangle([x + int(35*s), y - int(38*s), x + int(50*s), y - int(22*s)], 
                       fill="#333", outline="#666", width=2)
    elif holding == "bucket":
        draw.line([x + int(18*s), body_top + int(20*s), x + int(50*s), y], 
                  fill=skin, width=int(5*s))
        draw.rectangle([x + int(40*s), y - int(5*s), x + int(65*s), y + int(25*s)], 
                       fill="#FF5722", outline="#BF360C", width=2)
    else:
        draw.line([x + int(18*s), body_top + int(20*s), x + int(45*s), y - int(40*s)], 
                  fill=skin, width=int(5*s))
        draw.ellipse([x + int(42*s), y - int(44*s), x + int(50*s), y - int(36*s)], 
                     fill=skin)
    
    # Thân (= áo)
    draw.rectangle([x - int(22*s), body_top, x + int(22*s), y - int(20*s)], 
                   fill=body, outline="#0D47A1" if color == "blue" else "#1B5E20", width=2)
    
    # Cổ
    draw.rectangle([x - int(8*s), head_cy + head_r - int(5*s), 
                    x + int(8*s), body_top + int(5*s)], fill=skin)
    
    # Đầu (hình tròn)
    draw.ellipse([head_cx - head_r, head_cy - head_r, 
                  head_cx + head_r, head_cy + head_r], 
                 fill=skin, outline="#5D4037", width=2)
    
    # Mắt
    if expression == "happy":
        draw.arc([head_cx - int(15*s), head_cy - int(5*s), 
                  head_cx - int(3*s), head_cy + int(10*s)], 0, 180, fill="#333", width=int(3*s))
        draw.arc([head_cx + int(3*s), head_cy - int(5*s), 
                  head_cx + int(15*s), head_cy + int(10*s)], 0, 180, fill="#333", width=int(3*s))
    elif expression == "sad":
        draw.arc([head_cx - int(15*s), head_cy + int(5*s), 
                  head_cx - int(3*s), head_cy + int(15*s)], 180, 360, fill="#333", width=int(3*s))
        draw.arc([head_cx + int(3*s), head_cy + int(5*s), 
                  head_cx + int(15*s), head_cy + int(15*s)], 180, 360, fill="#333", width=int(3*s))
    elif expression == "angry":
        draw.line([head_cx - int(15*s), head_cy - int(3*s), head_cx - int(5*s), head_cy + int(3*s)], 
                  fill="#333", width=int(3*s))
        draw.line([head_cx + int(15*s), head_cy - int(3*s), head_cx + int(5*s), head_cy + int(3*s)], 
                  fill="#333", width=int(3*s))
        # Mày cau
        draw.line([head_cx - int(18*s), head_cy - int(12*s), head_cx - int(5*s), head_cy - int(8*s)], 
                  fill="#333", width=int(3*s))
        draw.line([head_cx + int(18*s), head_cy - int(12*s), head_cx + int(5*s), head_cy - int(8*s)], 
                  fill="#333", width=int(3*s))
    elif expression == "shock":
        draw.ellipse([head_cx - int(12*s), head_cy - int(8*s), 
                      head_cx - int(4*s), head_cy], fill="#FFF", outline="#333", width=2)
        draw.ellipse([head_cx + int(4*s), head_cy - int(8*s), 
                      head_cx + int(12*s), head_cy], fill="#FFF", outline="#333", width=2)
        draw.point([head_cx - int(8*s), head_cy - int(4*s)], fill="#333")
        draw.point([head_cx + int(8*s), head_cy - int(4*s)], fill="#333")
        draw.ellipse([head_cx - int(3*s), head_cy + int(5*s), 
                      head_cx + int(3*s), head_cy + int(12*s)], fill="#333")
    else:  # normal
        draw.ellipse([head_cx - int(13*s), head_cy - int(5*s), 
                      head_cx - int(5*s), head_cy + int(3*s)], fill="#333")
        draw.ellipse([head_cx + int(5*s), head_cy - int(5*s), 
                      head_cx + int(13*s), head_cy + int(3*s)], fill="#333")
    
    # Miệng
    draw.arc([head_cx - int(8*s), head_cy + int(8*s), 
              head_cx + int(8*s), head_cy + int(18*s)], 0, 180, fill="#333", width=int(2*s))
    
    # Mũ bảo hiểm / nón
    if hat:
        draw.pieslice([head_cx - int(28*s), head_cy - int(35*s), 
                       head_cx + int(28*s), head_cy - int(5*s)], 180, 360, 
                      fill="#FF6F00", outline="#E65100", width=2)
        draw.rectangle([head_cx - int(22*s), head_cy - int(38*s), 
                        head_cx + int(22*s), head_cy - int(28*s)], 
                       fill="#FF6F00", outline="#E65100", width=2)

# ─── VẼ BONG BÓNG HỘI THOẠI ─────────────────────────────
def draw_speech_bubble(draw, text, bx, by, bw, bh, tail_side="left"):
    """Vẽ bong bóng hội thoại"""
    draw.rounded_rectangle([bx, by, bx+bw, by+bh], radius=20, 
                          fill=COLORS["bubble"], outline=COLORS["bubble_border"], width=3)
    # Đuôi bong bóng
    if tail_side == "left":
        draw.polygon([(bx+20, by+bh), (bx-10, by+bh+25), (bx+60, by+bh)], 
                    fill=COLORS["bubble"], outline=COLORS["bubble_border"])
    else:
        draw.polygon([(bx+bw-20, by+bh), (bx+bw+10, by+bh+25), (bx+bw-60, by+bh)], 
                    fill=COLORS["bubble"], outline=COLORS["bubble_border"])
    
    # Text
    font = get_font(28)
    lines = textwrap.wrap(text, width=25)
    y_off = by + 20
    for line in lines:
        try:
            bbox = draw.textbbox((0, 0), line, font=font)
            tw = bbox[2] - bbox[0]
        except:
            tw = len(line) * 15
        draw.text((bx + (bw - tw)//2, y_off), line, fill=COLORS["text"], font=font)
        y_off += 35

# ─── VẼ CẢNH ─────────────────────────────────────────────
def draw_scene(scene):
    """
    scene là dict với các keys:
    - background: "room" | "outside" | "rain" | "house_before" | "house_after"
    - characters: list of dicts {x, y, scale, color, hat, holding, expression, speech}
    - caption: text ở dưới cùng
    - effects: list of effects
    - emoji: emoji to show
    """
    img = Image.new("RGB", (W, H), COLORS["bg"])
    draw = ImageDraw.Draw(img)
    
    bg = scene.get("background", "empty")
    
    # ═══ VẼ NỀN ═══
    if bg == "room":
        # Tường
        draw.rectangle([0, 0, W, int(H*0.6)], fill="#FFF8E1")
        # Sàn
        draw.rectangle([0, int(H*0.6), W, H], fill="#D7CCC8")
        # Cửa sổ
        draw.rectangle([W//2 - 80, 60, W//2 + 80, 240], fill="#B3E5FC", outline="#795548", width=4)
        draw.line([W//2, 60, W//2, 240], fill="#795548", width=2)
        draw.line([W//2 - 80, 150, W//2 + 80, 150], fill="#795548", width=2)
        # Bàn
        draw.rectangle([100, int(H*0.55), 400, int(H*0.62)], fill="#8D6E63", outline="#5D4037", width=2)
        # Kệ hàng
        draw.rectangle([W-200, 100, W-20, 300], fill="#A1887F", outline="#5D4037", width=2)
        for y_off in [140, 190, 240, 290]:
            draw.line([W-200, y_off, W-20, y_off], fill="#5D4037", width=2)
        # Thùng sơn trên kệ
        for i, (cx, cy) in enumerate([(W-150, 125), (W-80, 125), (W-150, 170), (W-80, 215)]):
            draw.rectangle([cx-20, cy-15, cx+20, cy+15], fill="#1565C0" if i%2==0 else "#E53935", 
                          outline="#333", width=2)
    
    elif bg == "outside":
        # Trời
        for y in range(int(H*0.05)):
            r = 135 + int(y * 0.3)
            g = 206 + int(y * 0.2)
            y1 = int(H*0.7)-y
            y0 = y1 - 1
            if y0 >= 0:
                draw.rectangle([0, y0, W, y1], fill=(min(r+g//2,255), min(g,255), 235))
        # Đất
        draw.rectangle([0, int(H*0.7), W, H], fill="#81C784")
        # Cỏ
        for x in range(0, W, 15):
            h = random.randint(5, 20)
            draw.line([x, int(H*0.7), x-3, int(H*0.7)-h], fill="#4CAF50", width=2)
        # Mặt trời
        draw.ellipse([W-150, 50, W-50, 150], fill="#FFEE58")
    
    elif bg == "rain":
        draw.rectangle([0, 0, W, H], fill="#37474F")
        # Mưa
        for _ in range(80):
            rx = random.randint(0, W)
            ry = random.randint(0, H)
            draw.line([rx, ry, rx-3, ry+15], fill=COLORS["rain"], width=1)
        # Nhà
        draw.rectangle([200, int(H*0.5)-100, 520, int(H*0.5)+150], fill=COLORS["house_wall"], 
                      outline="#5D4037", width=3)
        draw.polygon([(180, int(H*0.5)-100), (360, int(H*0.5)-200), (540, int(H*0.5)-100)], 
                    fill=COLORS["house_roof"], outline="#5D4037", width=3)
        # Vết thấm
        draw.ellipse([280, int(H*0.5)-60, 360, int(H*0.5)-20], fill="#8D6E63", outline="#5D4037", width=1)
        draw.ellipse([380, int(H*0.5)-40, 440, int(H*0.5)-10], fill="#8D6E63", outline="#5D4037", width=1)
    
    elif bg == "house_before":
        # Nhà cũ
        draw.rectangle([0, 0, W, H], fill="#ECEFF1")
        draw.rectangle([150, int(H*0.3), 570, int(H*0.7)+100], fill="#E0E0E0", outline="#9E9E9E", width=3)
        draw.polygon([(130, int(H*0.3)), (360, int(H*0.15)), (590, int(H*0.3))], 
                    fill="#9E9E9E", outline="#757575", width=3)
        # Bong tróc
        draw.ellipse([250, int(H*0.4), 320, int(H*0.48)], fill="#BDBDBD", outline="#9E9E9E", width=2)
        draw.ellipse([400, int(H*0.5), 470, int(H*0.58)], fill="#BDBDBD", outline="#9E9E9E", width=2)
        # Rêu
        for x in [180, 220, 350, 420, 500]:
            draw.ellipse([x, int(H*0.3)+20, x+30, int(H*0.3)+40], fill="#558B2F")
    
    elif bg == "house_after":
        # Nhà mới
        draw.rectangle([0, 0, W, H], fill="#E8F5E9")
        draw.rectangle([150, int(H*0.3), 570, int(H*0.7)+100], fill="#FFF8E1", outline="#5D4037", width=3)
        draw.polygon([(130, int(H*0.3)), (360, int(H*0.15)), (590, int(H*0.3))], 
                    fill="#D84315", outline="#BF360C", width=3)
        draw.rectangle([310, int(H*0.5), 410, int(H*0.7)+10], fill="#5D4037", outline="#3E2723", width=3)
        # Hoa
        for x in [170, 200, 400, 450, 530]:
            draw.ellipse([x, int(H*0.65), x+20, int(H*0.65)+20], fill="#FF7043")
        # Sparkles
        for pos in [(180, int(H*0.25)), (500, int(H*0.2)), (350, int(H*0.1))]:
            draw.text(pos, "✨", fill="#FFD54F", font=get_font(40))
    
    elif bg == "price_table":
        draw.rectangle([0, 0, W, H], fill="#FFF8E1")
        # Bảng giá
        draw.rectangle([100, 100, W-100, H-100], fill="#FFFFFF", outline="#1A237E", width=4)
        draw.rectangle([100, 100, W-100, 200], fill="#1A237E")
        font_title = get_font(40)
        draw.text((W//2, 150), "💰 BẢNG GIÁ SƠN", fill="#FFF", font=font_title, anchor="mm")
        # Các dòng giá
        items = [("Munich Luxury 5L", "950.000đ"), ("Jotashield 5L", "2.695.000đ"),
                 ("NanoHouse 5L", "1.765.000đ"), ("Chống thấm 5L", "1.340.000đ")]
        for i, (name, price) in enumerate(items):
            y = 250 + i * 80
            draw.text((150, y), f"🔹 {name}", fill="#333", font=get_font(26))
            draw.text((W-150, y), price, fill="#D84315", font=get_font(30), anchor="ra")
            draw.line([120, y+45, W-120, y+45], fill="#E0E0E0", width=1)
        draw.text((W//2, H-120), "📞 0378.679.633", fill="#1A237E", font=get_font(36), anchor="mm")
    
    # ═══ VẼ NHÂN VẬT ═══
    for char in scene.get("characters", []):
        cx = char.get("x", W//2)
        cy = char.get("y", int(H*0.75))
        scale = char.get("scale", 1.0)
        color = char.get("color", "blue")
        hat = char.get("hat", False)
        holding = char.get("holding", None)
        expression = char.get("expression", "normal")
        
        draw_stickman(draw, cx, cy, scale, color, hat, holding, expression)
        
        # Bong bóng hội thoại
        speech = char.get("speech", "")
        if speech:
            bubble_x = char.get("bubble_x", cx - 200)
            bubble_y = char.get("bubble_y", cy - 280)
            bubble_w = 280
            bh = 80 + len(textwrap.wrap(speech, width=20)) * 30
            draw_speech_bubble(draw, speech, bubble_x, bubble_y, bubble_w, bh)
    
    # ═══ CAPTION ═══
    caption = scene.get("caption", "")
    if caption:
        font_cap = get_font(42)
        for i, line in enumerate(textwrap.wrap(caption, width=20)):
            y = H - 100 - (len(textwrap.wrap(caption, width=20))-i-1)*50
            # Shadow
            draw.text((W//2+2, y+2), line, fill="#333", font=font_cap, anchor="mm")
            draw.text((W//2, y), line, fill=COLORS["caption"], font=font_cap, anchor="mm")
    
    # ═══ EMOJI ═══
    emoji = scene.get("emoji", "")
    if emoji:
        font_emoji = get_font(60)
        draw.text((W//2, 100), emoji, fill="#333", font=font_emoji, anchor="mm")
    
    return img

# ─── TẠO CLIP TỪ CẢNH ────────────────────────────────────
def scene_to_clip(scene, duration=3.0):
    """Tạo clip từ một scene"""
    
    # Tạo nhiều frame với hiệu ứng chuyển động nhẹ
    frames = []
    n_frames = int(duration * FPS)
    
    for frame_i in range(n_frames):
        # Có thể thêm hiệu ứng rung nhẹ cho thêm sinh động
        modified_scene = dict(scene)
        
        # Chỉnh nhân vật animation đơn giản (tay vẫy, nhảy...)
        modified_chars = []
        for char in scene.get("characters", []):
            c = dict(char)
            # Thêm chuyển động lên xuống nhẹ
            bounce = math.sin(frame_i * 0.3) * 3
            c["y"] = char.get("y", int(H*0.75)) + int(bounce)
            modified_chars.append(c)
        
        modified_scene["characters"] = modified_chars
        modified_scene["frame"] = frame_i
        modified_scene["total_frames"] = n_frames
        
        img = draw_scene(modified_scene)
        frames.append(np.array(img))
    
    if not frames:
        return None
    
    clip = ImageSequenceClip(frames, fps=FPS)
    return clip

# ─── KỊCH BẢN MẪU ────────────────────────────────────────
def get_script(script_name):
    """Lấy kịch bản mẫu"""
    scripts = {
        
        "khach_hoi_gia": {
            "title": "Khi khách hỏi giá sơn",
            "duration_per_scene": 3.5,
            "scenes": [
                {
                    "background": "room",
                    "characters": [
                        {"x": W//2, "y": int(H*0.72), "scale": 1.2, "color": "blue", 
                         "hat": True, "holding": None, "expression": "normal",
                         "speech": "Alo, sơn nhà 80m2 giá bao nhiêu?"}
                    ],
                    "caption": "",
                    "emoji": "📞"
                },
                {
                    "background": "room",
                    "characters": [
                        {"x": W//2, "y": int(H*0.72), "scale": 1.2, "color": "blue",
                         "hat": True, "holding": "phone", "expression": "shock",
                         "speech": "Dạ để em tính... 80m2 là... ờm..."}
                    ],
                    "caption": "Khách gửi ảnh nhà 4 tầng + sân thượng",
                    "emoji": "😱"
                },
                {
                    "background": "room",
                    "characters": [
                        {"x": W//2-50, "y": int(H*0.72), "scale": 1.0, "color": "blue",
                         "hat": True, "expression": "sad"},
                        {"x": W//2+150, "y": int(H*0.72), "scale": 0.8, "color": "green",
                         "expression": "angry", "speech": "Sao lâu thế?"}
                    ],
                    "caption": "Một đêm thức trắng báo giá",
                    "emoji": "🌙"
                },
                {
                    "background": "room",
                    "characters": [
                        {"x": W//2, "y": int(H*0.72), "scale": 1.2, "color": "blue",
                         "hat": True, "holding": None, "expression": "happy",
                         "speech": "Xong rồi ạ! VLHT lo hết!"}
                    ],
                    "caption": "Nhưng vẫn yêu nghề — VLHT lo hết!",
                    "emoji": "💪"
                }
            ]
        },
        
        "chong_tham": {
            "title": "Cuộc chiến chống thấm",
            "duration_per_scene": 3.0,
            "scenes": [
                {
                    "background": "rain",
                    "characters": [
                        {"x": 360, "y": int(H*0.72), "scale": 1.0, "color": "green",
                         "expression": "sad", "speech": "Trời ơi lại thấm rồi!"}
                    ],
                    "caption": "Mùa mưa — nỗi ám ảnh của mọi ngôi nhà",
                    "emoji": "☔"
                },
                {
                    "background": "rain",
                    "characters": [
                        {"x": W//2, "y": int(H*0.72), "scale": 1.2, "color": "blue",
                         "hat": True, "holding": "bucket", "expression": "happy",
                         "speech": "Đừng lo! Có VLHT đây rồi!"}
                    ],
                    "caption": "Siêu anh hùng chống thấm xuất hiện! 🦸",
                    "emoji": "🚀"
                },
                {
                    "background": "house_after",
                    "characters": [
                        {"x": W//2, "y": int(H*0.72), "scale": 1.2, "color": "blue",
                         "hat": True, "holding": "roller", "expression": "happy",
                         "speech": "Xong! Tường khô ráo, đẹp long lanh!"}
                    ],
                    "caption": "Thấm mấy cũng có cách — gọi VLHT!",
                    "emoji": "✨"
                }
            ]
        },
        
        "so_sanh_gia": {
            "title": "POV: Khách so sánh giá",
            "duration_per_scene": 2.5,
            "scenes": [
                {
                    "background": "price_table",
                    "characters": [
                        {"x": 250, "y": int(H*0.72), "scale": 1.0, "color": "green",
                         "hat": False, "holding": "phone", "expression": "angry",
                         "speech": "Thằng kia rẻ hơn 5k!"}
                    ],
                    "caption": "Khách hàng thông thái 😎",
                    "emoji": "🧐"
                },
                {
                    "background": "room",
                    "characters": [
                        {"x": W//2, "y": int(H*0.72), "scale": 1.2, "color": "blue",
                         "hat": True, "expression": "sad",
                         "speech": "Dạ... hàng giả đó anh ơi!"}
                    ],
                    "caption": "Sơn giả — ố vàng, bong tróc sau 3 tháng",
                    "emoji": "😨"
                },
                {
                    "background": "house_after",
                    "characters": [
                        {"x": W//2-80, "y": int(H*0.72), "scale": 1.2, "color": "blue",
                         "hat": True, "holding": "roller", "expression": "happy"},
                        {"x": W//2+120, "y": int(H*0.72), "scale": 0.9, "color": "green",
                         "expression": "happy", "speech": "Chuẩn! Lấy em 10 thùng!"}
                    ],
                    "caption": "Hàng chính hãng — giá trị thật!",
                    "emoji": "✅"
                }
            ]
        },
        
        "trend_low_cortisol": {
            "title": "Low Cortisol VLHT",
            "duration_per_scene": 3.0,
            "scenes": [
                {
                    "background": "outside",
                    "characters": [
                        {"x": W//2, "y": int(H*0.72), "scale": 1.2, "color": "blue",
                         "hat": True, "expression": "happy"}
                    ],
                    "caption": "Một ngày của thợ sơn chuyên nghiệp 🎵",
                    "emoji": "😎"
                },
                {
                    "background": "room",
                    "characters": [
                        {"x": W//2, "y": int(H*0.72), "scale": 1.0, "color": "blue",
                         "hat": True, "holding": "roller", "expression": "happy"}
                    ],
                    "caption": "Giao 30 đơn — xong hết trong ngày!",
                    "emoji": "📦"
                },
                {
                    "background": "house_after",
                    "characters": [
                        {"x": W//2, "y": int(H*0.72), "scale": 1.2, "color": "blue",
                         "hat": True, "expression": "happy"}
                    ],
                    "caption": "Low cortisol — vì có VLHT lo hết!",
                    "emoji": "🧘"
                }
            ]
        }
    }
    
    return scripts.get(script_name, scripts["khach_hoi_gia"])

# ─── HÀM CHÍNH ───────────────────────────────────────────
def make_video(script_name="khach_hoi_gia", output_name=None):
    """Tạo video từ kịch bản"""
    
    script = get_script(script_name)
    if not output_name:
        output_name = f"{script_name}_{int(__import__('time').time())}"
    
    print(f"🎬 Đang làm video: {script['title']}")
    
    clips = []
    for i, scene in enumerate(script["scenes"]):
        print(f"  ── Cảnh {i+1}/{len(script['scenes'])}")
        clip = scene_to_clip(scene, script["duration_per_scene"])
        if clip:
            clips.append(clip)
    
    if not clips:
        print("❌ Không có cảnh nào được tạo!")
        return None
    
    print(f"  ── Đang ghép {len(clips)} cảnh...")
    final = concatenate_videoclips(clips, method="chain")
    
    output_path = os.path.join(OUTPUT_DIR, f"{output_name}.mp4")
    print(f"  ── Đang xuất video: {output_path}")
    
    final.write_videofile(output_path, fps=FPS, codec="libx264", audio=False)
    print(f"✅ Hoàn thành! {output_path}")
    return output_path

# ─── DÒNG LỆNH ──────────────────────────────────────────
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="🎬 Mây Hoạt Hình — Bot tạo video VLHT")
    parser.add_argument("script", nargs="?", default="khach_hoi_gia",
                       choices=["khach_hoi_gia", "chong_tham", "so_sanh_gia", "trend_low_cortisol", "all"],
                       help="Tên kịch bản")
    parser.add_argument("--output", "-o", help="Tên file output (không cần .mp4)")
    
    args = parser.parse_args()
    
    if args.script == "all":
        names = ["khach_hoi_gia", "chong_tham", "so_sanh_gia", "trend_low_cortisol"]
        for name in names:
            make_video(name)
    else:
        make_video(args.script, args.output)
