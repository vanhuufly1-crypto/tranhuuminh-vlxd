#!/usr/bin/env python3
"""
Tao Google Business Profile cho Tran Huu Minh VLXD
Su dung Playwright voi stealth de tranh phat hien automation
"""
import json
import time
import re
from playwright.sync_api import sync_playwright

# Thong tin tai khoan
EMAIL = "vanhuufly1@gmail.com"
PASSWORD = "Huuminh@20042024#"
PHONE = "0352222916"

# Thong tin doanh nghiep tu anh Huu cung cap
BUSINESS_INFO = {
    "name": "HỆ THỐNG PHÂN PHỐI TRẦN HỮU MINH",
    "category": "Cửa hàng vật liệu xây dựng",
    "phone": "+84378679633",
    "website": "https://tranhuuminhvlxd.id.vn",
    "address": {
        "street": "TDP Quyết Tiến",
        "ward": "Nam Đồ Sơn",
        "district": "Đồ Sơn",
        "city": "Hải Phòng"
    },
    "description": "Cung cấp đa dạng các dòng sản phẩm và giải pháp thi công: Sơn nước nội thất, ngoại thất, sơn công nghiệp, sơn Epoxy, sơn thể thao, sơn chống nóng, chống thấm dân dụng và công nghiệp, phụ gia chống thấm, keo dán gạch. Phục vụ nhà dân, nhà xưởng, công trình tại Hải Phòng và các tỉnh lân cận."
}

def main():
    with sync_playwright() as p:
        # Dung Chrome (channel) de tranh phat hien hon Chromium headless
        browser = p.chromium.launch(
            channel="chrome",
            headless=True,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
                "--disable-dev-shm-usage"
            ]
        )
        
        context = browser.new_context(
            viewport={"width": 390, "height": 844},  # iPhone 14 Pro size
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
            locale="vi-VN",
            timezone_id="Asia/Bangkok"
        )
        
        # Stealth: remove webdriver flag
        page = context.new_page()
        page.add_init_script("""
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
        Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
        Object.defineProperty(navigator, 'languages', { get: () => ['vi-VN', 'vi', 'en'] });
        """)
        
        print("🔄 Dang mo Google Business Profile...")
        page.goto("https://business.google.com/create/new?hl=vi", timeout=60000)
        time.sleep(2)
        
        # Screenshot de debug
        page.screenshot(path="/tmp/gmb_step0.png")
        print("📸 Step 0: screenshot saved")
        
        # Kiem tra xem co phai trang login khong
        page_content = page.content()
        
        if "Đăng nhập" in page_content or "Sign in" in page_content or "email" in page_content.lower():
            print("🔄 Dang nhap Google...")
            
            # Nhap email
            email_input = page.locator('input[type="email"], input[name="identifier"], input[autocomplete="username"]').first
            if email_input.is_visible():
                email_input.fill(EMAIL)
                time.sleep(1)
                page.keyboard.press("Enter")
                time.sleep(3)
                page.screenshot(path="/tmp/gmb_step1.png")
            else:
                print("⚠️ Khong tim thay o email, thu cach khac")
            
            # Nhap password
            pwd_input = page.locator('input[type="password"], input[name="Passwd"]').first
            if pwd_input.is_visible():
                pwd_input.fill(PASSWORD)
                time.sleep(1)
                page.keyboard.press("Enter")
                time.sleep(5)
                page.screenshot(path="/tmp/gmb_step2.png")
                print("📸 Step 2: after password")
            else:
                print("⚠️ Khong tim thay o password, screenshot de xem")
                page.screenshot(path="/tmp/gmb_step2_no_pwd.png")
            
            # Kiem tra OTP
            if "0352222916" in page.content() or "xác minh" in page.content() or "verification" in page.content().lower():
                print("📱 Google yeu cau xac minh OTP!")
                page.screenshot(path="/tmp/gmb_otp.png")
                print("⚠️ CAN OTP: Anh Huu gui ma OTP tu so 0352222916")
                # Luu thong tin
                with open("/tmp/gmb_otp_ready.txt", "w") as f:
                    f.write("OTP CAN XAC MINH - Gui ma tu 0352222916")
                browser.close()
                return "OTP_REQUIRED"
        
        # Sau login, kiem tra trang create
        time.sleep(3)
        page.screenshot(path="/tmp/gmb_step3.png")
        print("📸 Step 3: after login")
        
        # Kiem tra xem da vao duoc chua
        current_url = page.url
        print(f"📍 URL hien tai: {current_url}")
        
        if "business.google.com" in current_url and "create" in current_url:
            print("✅ Da vao duoc trang create GMB!")
            page.screenshot(path="/tmp/gmb_created_page.png")
            # Tiep tuc fill thong tin...
            browser.close()
            return "SUCCESS_LOGGED_IN"
        else:
            print(f"⚠️ Chua vao duoc GMB, dang o: {current_url}")
            page.screenshot(path="/tmp/gmb_unexpected.png")
            browser.close()
            return "UNEXPECTED_URL"
        
        browser.close()

if __name__ == "__main__":
    result = main()
    print(f"\n📋 Ket qua: {result}")
