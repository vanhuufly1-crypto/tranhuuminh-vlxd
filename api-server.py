#!/usr/bin/env python3
"""
API Server for Trần Hữu Minh website
Receives form submissions and forwards via email (Gmail SMTP)
"""
import os, json, smtplib, logging
from email.mime.text import MIMEText
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler('/home/huu-minh/website-vlxd/logs/api-server.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('api-server')

# Email config (from MEMORY.md)
SMTP_HOST = 'smtp.gmail.com'
SMTP_PORT = 587
EMAIL_USER = 'vanhuufly1@gmail.com'
EMAIL_PASS = 'cnwqqsexjcmgcnwb'
EMAIL_TO = 'vanhuufly@gmail.com'

def send_email(subject, body):
    """Send email via Gmail SMTP"""
    try:
        msg = MIMEText(body, 'plain', 'utf-8')
        msg['Subject'] = subject
        msg['From'] = EMAIL_USER
        msg['To'] = EMAIL_TO

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
            s.starttls()
            s.login(EMAIL_USER, EMAIL_PASS)
            s.send_message(msg)
        logger.info(f"📧 Email sent: {subject}")
        return True
    except Exception as e:
        logger.error(f"Email failed: {e}")
        return False

@app.route('/order', methods=['POST'])
def handle_order():
    """Đặt hàng Munich"""
    data = request.json or {}
    name = data.get('name', 'Không tên')
    phone = data.get('phone', '')
    address = data.get('address', '')
    product = data.get('product', '')
    note = data.get('note', '')
    total = data.get('total', 0)

    subject = f"🔥 ĐƠN HÀNG MỚI — {product} — {phone}"
    body = f"""
=== ĐƠN HÀNG MỚI ===

👤 Họ tên: {name}
📞 SĐT: {phone}
📍 Địa chỉ: {address}
📦 Sản phẩm: {product}
📝 Ghi chú: {note}
💰 Tổng tiền: {int(total):,}₫

⏰ Thời gian: {request.headers.get('X-Forwarded-For', '')}
    """.strip()

    sent = send_email(subject, body)
    logger.info(f"📦 Order: {name} - {phone} - {product} - {total:,}₫")

    return jsonify({
        'status': 'ok' if sent else 'partial',
        'message': 'Đã nhận đơn hàng!' if sent else 'Đã nhận (lỗi gửi email)',
        'data': {'name': name, 'phone': phone, 'product': product}
    })

@app.route('/api/quote', methods=['POST'])
def handle_quote():
    """Yêu cầu báo giá"""
    data = request.json or {}
    name = data.get('name', 'Không tên')
    phone = data.get('phone', '')
    service = data.get('service', '')

    subject = f"📋 YÊU CẦU BÁO GIÁ — {name} — {phone}"
    body = f"""
=== YÊU CẦU BÁO GIÁ ===

👤 Họ tên: {name}
📞 SĐT: {phone}
🛠️ Dịch vụ: {service}

⏰ Thời gian: {request.headers.get('X-Forwarded-For', '')}
    """.strip()

    sent = send_email(subject, body)
    logger.info(f"📋 Quote: {name} - {phone} - {service}")

    return jsonify({
        'status': 'ok' if sent else 'partial',
        'message': 'Đã nhận yêu cầu!' if sent else 'Đã nhận (lỗi gửi email)'
    })

@app.route('/api/abandon', methods=['POST'])
def handle_abandon():
    """Abandon cart tracking"""
    data = request.json or {}
    phone = data.get('phone', '')

    subject = f"⚠️ ABANDON CART — {phone}"
    body = f"""
=== ABANDON CART ===

📞 SĐT: {phone}
⚠️ Khách nhập SĐT nhưng chưa đặt hàng sau 10 phút

⏰ Thời gian: {request.headers.get('X-Forwarded-For', '')}
    """.strip()

    send_email(subject, body)
    logger.info(f"⚠️ Abandon: {phone}")

    return jsonify({'status': 'ok'})

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'status': 'ok', 'message': 'API Server running'})

if __name__ == '__main__':
    logger.info("🚀 API Server starting on port 3001...")
    app.run(host='127.0.0.1', port=3001, debug=False)
