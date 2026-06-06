/* ☁️ MS MÂY — Sales Ảo Trần Hữu Minh */
/* Chiến lược: Chủ lực (Munich) → tư vấn sâu → form */
/*             Phổ thông → báo giá + câu dẫn về chủ lực */
/* 100% local, 0 API */

(function() {
  'use strict';

  // === ĐỊNH NGHĨA ===
  const CHU_LUC = ['munich'];  // Chỉ Munich mới là chủ lực
  const PHO_THONG = ['sika', 'dulux', 'jotun', 'kova', 'nippon', 'maxilite', 'mpe', 'hdpe'];  // Dulux & Maxilite từ DOCX 13/03/2026
  const HOTLINE = '0378.679.633';

  const INTRO = `Chào anh/chị! Mình là ☁️ MS MÂY — Nhân viên kinh doanh của **Công ty VLHT Trần Hữu Minh**.

📢 *"Thách thức mọi nguồn nước!"*

Bên mình là nhà phân phối chính thức các thương hiệu sơn & chống thấm hàng đầu tại Hải Phòng:

⭐ **Munich** — Chống thấm số 1
🏡 **Nano House** — Sơn nước Nhật Bản
🧪 **Sika** — Phụ gia chống thấm
🎨 **Dulux, Jotun, Kova, Nippon, Maxilite** — Sơn trang trí

Anh/chị quan tâm đến sản phẩm nào ạ? Mình tư vấn ngay! 😊`;

  const GIOI_THIEU_MUNICH = `⭐ **MUNICH** — *"Giải pháp chống thấm công nghệ Đức"*

🏆 Chống thấm số 1 tại Hải Phòng với phương châm: *"Thách thức mọi nguồn nước!"*

📦 **Dòng chống thấm chủ lực:**
🔹 **G20** — Màng chống thấm 2TP đàn hồi 200% — Bộ 26kg — **1.925.950₫**
🔹 **G20S** — Màng chống thấm 2TP siêu bám dính — Bộ 25kg — **1.431.000₫**
🔹 **G20C** — Màng chống thấm 2TP siêu cứng lá sen — Bộ 20kg — **1.143.718₫**
🔹 **C20** — Màng chống thấm 2TP siêu cứng — Thùng 20kg — **1.232.608₫**
🔹 **CT0** — Chống thấm Acrylic sàn mái — 5kg — **829.640₫**
🔹 **G20C-Đen** — Chống thấm bể cá Koi — Bộ 20kg — **1.291.868₫**

✅ Độ đàn hồi lên tới 200% — chịu được nứt tường
✅ Độ bền trên 15 năm, an toàn cho bể nước sinh hoạt
✅ Phù hợp: sân thượng, nhà vệ sinh, bể bơi, tường ngoài

🏗️ **Sơn sàn Epoxy & Thể thao (tham khảo):**
🔹 **C631** — Sơn sân thể thao — 5kg — **1.328.001₫**
🔹 **S632** — Sân thể thao hiệu năng cao — 5kg — **2.451.999₫**

🧪 **Phụ gia & vật tư:**
🔹 **Latex S** — Phụ gia kết nối chống thấm — 5kg — **400.000₫**
🔹 **S302** — Phụ gia tăng bám dính — Túi 1kg — **174.817₫**
🔹 **Walling** — Chống thấm ngược tinh thể — 1L — **237.040₫**
🔹 **PU S700/S400/S800F** — Chống thấm PU gốc nước — từ **247.104₫**
🔹 **Glass 2K** — Chống thấm trong suốt 2TP — Bộ 3kg — **1.600.020₫**

🖌️ **Sơn nước Munich:**
🔹 Luxury Prime (NT/NT2), Luxury Siêu bóng, Fly, Action
🔹 Nano AB — Diệt khuẩn 99,99% — từ **2.943.333₫/5L**`;

  const GIOI_THIEU_NANO = `🏡 **Nano House** — Sơn nước công nghệ Nhật

✅ Sơn nước nội/ngoại thất chất lượng cao
✅ Giá cạnh tranh: từ **250.000₫ - 1.500.000₫/5L**`;

  function laHangChuLuc(keyword) {
    const kw = keyword.toLowerCase().trim();
    return CHU_LUC.some(b => kw.indexOf(b) >= 0);
  }

  function laHangPhoThong(keyword) {
    const kw = keyword.toLowerCase().trim();
    return PHO_THONG.some(b => kw.indexOf(b) >= 0);
  }

  function timHang(keyword) {
    const kw = keyword.toLowerCase().trim();
    for (let brand in window.PRICES) {
      if (brand.toLowerCase().indexOf(kw) >= 0) return brand;
      for (let sp in window.PRICES[brand]) {
        if (sp.toLowerCase().indexOf(kw) >= 0) return brand;
      }
    }
    return null;
  }

  function timSanPham(keyword) {
    const kw = keyword.toLowerCase().trim();
    const results = [];
    for (let brand in window.PRICES) {
      for (let sp in window.PRICES[brand]) {
        if (brand.toLowerCase().indexOf(kw) >= 0 || sp.toLowerCase().indexOf(kw) >= 0) {
          const p = window.PRICES[brand][sp];
          results.push({ brand, product: sp, price: p.price, spec: p.spec });
          if (results.length >= 10) break;
        }
      }
      if (results.length >= 10) break;
    }
    return results;
  }

  function searchLocal(query) {
    const q = query.toLowerCase().trim();
    if (!q) return 'Anh/chị muốn hỏi về sản phẩm gì ạ? Mình báo giá ngay!';

    // Xác định hãng
    let brand = null;
    for (let b in window.PRICES) {
      if (b.toLowerCase().indexOf(q) >= 0) { brand = b; break; }
    }

    // Tìm sản phẩm
    const sanPham = timSanPham(q);

    let reply = '';

    if (laHangChuLuc(q)) {
      // --- CHỦ LỰC: Tư vấn sâu ---
      if (q.indexOf('munich') >= 0) {
        reply += GIOI_THIEU_MUNICH;
      }

      if (sanPham.length > 0) {
        reply += '\n\n📋 **Bảng giá tham khảo:**\n';
        sanPham.forEach((sp, i) => {
          if (i < 8) reply += `• ${sp.product}: **${sp.price}**/${sp.spec}\n`;
        });
      }

      reply += `\n\n💡 **Tư vấn:** Nếu anh/chị cho mình biết vị trí cần thi công (sân thượng, nhà vệ sinh, bể nước...), mình tư vấn chính xác sản phẩm phù hợp và gửi báo giá chi tiết ạ!`;

      reply += `\n\n👇 **Anh/chị để lại SĐT để được báo giá ưu đãi nhất nhé!**`;

    } else if (laHangPhoThong(q)) {
      // --- PHỔ THÔNG: Báo giá + câu dẫn ---
      if (q.indexOf('sika') >= 0) {
        reply = `🧪 **Sika — Phụ gia chống thấm & sửa chữa**

✅ Đa dạng: chống thấm, phụ gia bê tông, keo dán
✅ Phù hợp: sân thượng, nhà vệ sinh, hồ bơi\n\n`;
      } else if (q.indexOf('dulux') >= 0) {
        reply = `🎨 **Dulux — Sơn trang trí cao cấp**

✅ Bền màu, lau chùi được
✅ Đa dạng: Weathershield, Inspire, Ambiance...\n\n`;
      } else if (q.indexOf('jotun') >= 0) {
        reply = `🖌️ **Jotun — Sơn bảo vệ & trang trí**

✅ Fenomastic, Mardis, Majestic...
✅ Lớp phủ khô nhanh, bám dính tốt\n\n`;
      } else if (q.indexOf('kova') >= 0) {
        reply = `🏺 **KOVA — Sơn & chống thấm nội địa cao cấp**

✅ Sơn nước trong nhà: K871 (bóng), K5500 (bán bóng), K771/K260
✅ Sơn nước ngoài trời: K360 (bóng), CT04T (chống thấm), K5800
✅ Sơn sàn thể thao: CT08 tennis, KL5T sàn CN
✅ Chống thấm: CT-11A, CT-11B, CT-14
✅ Matit, bột bả, sơn đá nghệ thuật KSP
✅ Thương hiệu Việt, giá cạnh tranh

📋 **Giá tham khảo:**
• K871 Bóng (20kg): **5.175.000₫**
• K5500 Bán bóng (20kg): **4.010.000₫**
• CT04T Chống thấm (20kg): **5.486.000₫**
• CT-11A Chống thấm (20kg): **4.585.000₫**
`;
      } else if (q.indexOf('nippon') >= 0) {
        reply = `🇯🇵 **Nippon — Công nghệ Nhật Bản**

✅ Sơn trong nhà, ngoài trời, chống thấm
✅ Mát mẻ, bền màu\n\n`;
      } else if (q.indexOf('maxilite') >= 0) {
        reply = `🎯 **Maxilite — Sơn giá rẻ chất lượng**

✅ Phù hợp công trình dân sinh
✅ Tiết kiệm chi phí\n\n`;
      } else if (q.indexOf('mpe') >= 0) {
        reply = `🔩 **MPE — Sơn Epoxy & sơn công nghiệp**

✅ EP11, EP12 — chịu lực, hoá chất
✅ Dành cho: nhà xưởng, sàn bê tông, bãi đỗ xe\n\n`;
      } else if (q.indexOf('hdpe') >= 0) {
        reply = `🔵 **Ống HDPE — Giải pháp cấp thoát nước**

✅ Bền, chịu áp lực cao
✅ Tuổi thọ 50+ năm\n\n`;
      }

      // Thêm bảng giá
      if (sanPham.length > 0) {
        reply += '📋 **Bảng giá tham khảo:**\n';
        sanPham.forEach((sp, i) => {
          if (i < 6) reply += `• ${sp.product}: **${sp.price}**/${sp.spec}\n`;
        });
      }

      // Câu dẫn về chủ lực
      reply += `\n\n💡 Ngoài ra, bên em đang có **giải pháp chống thấm công nghệ cao từ ⭐Munich** rất được ưa chuộng tại Hải Phòng. Anh/chị có muốn tham khảo thêm để tối ưu công trình không ạ?`;

      reply += `\n\n👇 Để lại SĐT, em báo giá nhanh nhất!`;

    } else if (q.indexOf('chống thấm') >= 0 || q.indexOf('chong tham') >= 0 || q.indexOf('chong thấm') >= 0) {
      reply = `🛡️ **CHỐNG THẤM — Giải pháp toàn diện**\n\n`;
      reply += `Với phương châm *"Thách thức mọi nguồn nước!"*, bên em phân phối chính thức **Munich** — chống thấm số 1 tại Hải Phòng:\n\n`;
      reply += `🔹 **G20** — Màng 2TP đàn hồi 200% — Bộ 26kg — **1.925.950₫**\n`;
      reply += `🔹 **G20S** — Siêu bám dính — Bộ 25kg — **1.431.000₫**\n`;
      reply += `🔹 **G20C** — Siêu cứng lá sen — Bộ 20kg — **1.143.718₫**\n`;
      reply += `🔹 **C20** — Màng siêu cứng — Thùng 20kg — **1.232.608₫**\n`;
      reply += `🔹 **CT0** — Acrylic sàn mái — 5kg — **829.640₫**\n`;
      reply += `🔹 **PU S700/S400** — Chống thấm PU — từ **247.104₫/L**\n`;
      reply += `🔹 **Glass 2K** — Chống thấm trong suốt — Bộ 3kg — **1.600.020₫**\n`;
      reply += `🔹 **Kyton K101** — Thẩm thấu tinh thể — Bao 20kg — **1.000.540₫**\n\n`;
      reply += `🏆 Khách hàng tại Hải Phòng tin dùng **Munich** vì độ bền 15 năm và đàn hồi 200%.\n\n`;
      reply += `👇 Anh/chị để lại SĐT, em tư vấn chi tiết ạ!`;

    } else if (q.indexOf('giá') >= 0 || q.indexOf('bao nhiêu') >= 0 || q.indexOf('gia') >= 0) {
      if (sanPham.length > 0) {
        reply = '📋 **Giá tham khảo cho sản phẩm anh/chị hỏi:**\n';
        sanPham.forEach((sp, i) => {
          if (i < 8) reply += `• ${sp.product}: **${sp.price}**/${sp.spec}\n`;
        });
        const hang = timHang(q);
        if (hang && CHU_LUC.some(b => hang.toLowerCase().indexOf(b) >= 0)) {
          reply += `\n💡 Đây là dòng chủ lực của bên em! Anh/chị để lại SĐT để em báo giá tốt nhất nhé 👇`;
        } else {
          reply += `\n\n💡 Ngoài ra bên em có **giải pháp chống thấm ⭐Munich** công nghệ cao. Anh/chị có muốn tham khảo thêm không ạ?`;
        }
      } else {
        reply = 'Anh/chị hỏi sản phẩm gì ạ? Mình có:\n';
        reply += '⭐ Munich | 🏡 Nano House | 🧪 Sika\n🎨 Dulux | 🖌️ Jotun | 🏺 Kova\n🇯🇵 Nippon | 🎯 Maxilite | 🔩 MPE | 🔵 HDPE\n\n👉 Gọi tên hãng hoặc sản phẩm, em báo giá ngay!';
      }

    } else if (q.indexOf('thi công') >= 0 || q.indexOf('thicong') >= 0) {
      reply = `🔨 **Dịch vụ thi công trọn gói của Trần Hữu Minh**

✅ Chống thấm sân thượng, nhà vệ sinh
✅ Sơn Epoxy sàn nhà xưởng
✅ Thi công sân Pickleball
✅ Sơn sửa nhà

💰 **Miễn phí khảo sát & báo giá**
📞 Hotline: **${HOTLINE}**

👇 Để lại SĐT, em cử kỹ thuật qua khảo sát ngay!`;

    } else if (sanPham.length > 0) {
      reply = '📋 **Sản phẩm tìm thấy:**\n';
      sanPham.forEach((sp, i) => {
        if (i < 8) reply += `• ${sp.brand.toUpperCase()} — ${sp.product}: **${sp.price}**/${sp.spec}\n`;
      });
      const hang = timHang(q);
      if (hang && CHU_LUC.some(b => hang.toLowerCase().indexOf(b) >= 0)) {
        reply += `\n💡 Anh/chị để lại SĐT để em báo giá tốt nhất nhé 👇`;
      } else {
        reply += `\n\n💡 Bên em còn có **giải pháp chống thấm ⭐Munich** công nghệ cao. Anh/chị có muốn tham khảo thêm không ạ?`;
      }

    } else {
      reply = `Xin chào! Mình là ☁️ MS MÂY — Trợ lý VLHT Trần Hữu Minh.

Anh/chị có thể hỏi mình về:
• Sản phẩm & bảng giá (Munich, Nano, Sika, Dulux...)
• Giải pháp chống thấm
• Dịch vụ thi công trọn gói

📞 Hoặc gọi trực tiếp **${HOTLINE}** để được hỗ trợ nhanh nhất ạ!`;
    }

    return reply;
  }

  // === PHẦN GIAO DIỆN ===
  let isOpen = false;
  let daGoiForm = false; // tránh spam form

  const widget = document.createElement('div');
  widget.id = 'chat-widget';
  widget.innerHTML = `
    <button id="chat-toggle" onclick="toggleChat()" aria-label="Chat với MS MÂY">
      <span class="chat-icon">💬</span>
    </button>
    <div id="chat-box" class="chat-hidden">
      <div id="chat-header">
        <span>☁️ MS MÂY - Sales VLHT</span>
        <button onclick="toggleChat()" class="chat-close">&times;</button>
      </div>
      <div id="chat-messages">
        <div class="msg msg-may"><strong>☁️ MS MÂY:</strong> ${INTRO.replace(/\*\*/g, '<b>').replace(/\n/g, '<br>')}</div>
      </div>
      <div id="chat-input-area">
        <textarea id="chat-input" rows="1" placeholder="Nhập câu hỏi..." onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChat()}"></textarea>
        <button id="chat-send" onclick="sendChat()">Gửi</button>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  // Style
  const style = document.createElement('style');
  style.textContent = `
    #chat-widget { position:fixed; bottom:20px; right:20px; z-index:9999; font-family:'Segoe UI',sans-serif; }
    #chat-toggle {
      width:56px; height:56px; border-radius:50%; border:none;
      background:linear-gradient(135deg,#e74c3c,#c0392b); color:white;
      font-size:24px; cursor:pointer; box-shadow:0 4px 15px rgba(0,0,0,0.3);
      transition:transform 0.2s; display:flex; align-items:center; justify-content:center;
    }
    #chat-toggle:hover { transform:scale(1.1); }
    #chat-box {
      position:fixed; bottom:85px; right:20px; width:380px; height:520px;
      background:white; border-radius:16px; box-shadow:0 5px 25px rgba(0,0,0,0.2);
      display:flex; flex-direction:column; overflow:hidden;
      transition:all 0.3s ease;
    }
    .chat-hidden { opacity:0; visibility:hidden; transform:translateY(20px) scale(0.95); pointer-events:none; }
    #chat-header {
      background:linear-gradient(135deg,#e74c3c,#c0392b); color:white;
      padding:14px 18px; font-weight:600; display:flex; justify-content:space-between; align-items:center;
    }
    .chat-close { background:none; border:none; color:white; font-size:24px; cursor:pointer; }
    #chat-messages {
      flex:1; overflow-y:auto; padding:14px; background:#f8f9fa;
      display:flex; flex-direction:column; gap:8px;
    }
    .msg {
      padding:10px 14px; border-radius:12px; max-width:90%;
      font-size:14px; line-height:1.6; word-wrap:break-word;
    }
    .msg-may {
      align-self:flex-start; background:white; border:1px solid #e0e0e0;
      border-bottom-left-radius:4px; color:#333;
    }
    .msg-may strong { display:block; margin-bottom:4px; color:#c0392b; }
    .msg-user {
      align-self:flex-end; background:#c0392b; color:white;
      border-bottom-right-radius:4px;
    }
    .msg-form {
      align-self:center; background:#e8f8f5; border:1px solid #0fb9b1;
      border-radius:12px; padding:12px 16px; text-align:center; width:100%;
    }
    .msg-form input {
      display:block; width:calc(100% - 20px); margin:6px auto; padding:10px;
      border:1px solid #ddd; border-radius:6px; font-size:14px;
    }
    .msg-form button {
      background:#e74c3c; color:white; border:none; padding:10px 24px;
      border-radius:6px; font-weight:700; cursor:pointer; font-size:14px;
    }
    .msg-form button:hover { background:#c0392b; }
    .msg-form input:focus { border-color:#e74c3c; outline:none; }
    .msg-q-btn {
      display:inline-block; margin:4px; padding:6px 14px;
      background:#e74c3c; color:white; border:none; border-radius:20px;
      cursor:pointer; font-size:13px; font-weight:600;
    }
    .msg-q-btn:hover { background:#c0392b; }
    #chat-input-area {
      display:flex; padding:10px 12px; border-top:1px solid #e0e0e0; background:white;
      gap:8px; align-items:flex-end;
    }
    #chat-input {
      flex:1; border:1px solid #ddd; border-radius:20px; padding:10px 14px;
      font-size:14px; resize:none; outline:none; font-family:inherit;
    }
    #chat-input:focus { border-color:#e74c3c; }
    #chat-send {
      background:#e74c3c; color:white; border:none; border-radius:20px;
      padding:10px 20px; cursor:pointer; font-weight:600; font-size:14px;
      transition:background 0.2s; white-space:nowrap;
    }
    #chat-send:hover { background:#c0392b; }
    #chat-send:disabled { background:#ccc; cursor:not-allowed; }
    @media (max-width:480px) {
      #chat-box { width:calc(100vw - 30px); height:65vh; right:10px; bottom:75px; }
    }
  `;
  document.head.appendChild(style);

  window.toggleChat = function() {
    isOpen = !isOpen;
    const box = document.getElementById('chat-box');
    if (isOpen) {
      box.classList.remove('chat-hidden');
      document.getElementById('chat-input').focus();
    } else {
      box.classList.add('chat-hidden');
    }
  };

  window.sendChat = function() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const q = msg.toLowerCase().trim();
    input.value = '';
    addMessage(msg, 'user');
    document.getElementById('chat-send').disabled = true;

    // Detect nếu khách hỏi về chủ lực → show form luôn
    const isChuLuc = laHangChuLuc(q) ||
      (q.indexOf('chống thấm') >= 0) ||
      (q.indexOf('chong tham') >= 0);

    setTimeout(function() {
      var reply = searchLocal(msg);
      addMessage(reply, 'may');
      document.getElementById('chat-send').disabled = false;

      // Gợi ý form báo giá
      if (isChuLuc && !daGoiForm) {
        setTimeout(function() { themFormBaoGia(); daGoiForm = true; }, 800);
      }
    }, 400);
  };

  window.quickAsk = function(q) {
    document.getElementById('chat-input').value = q;
    sendChat();
  };

  function themFormBaoGia() {
    const msgs = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = 'msg msg-form';
    div.id = 'form-baogia';
    div.innerHTML = `
      <strong style="color:#c0392b;font-size:15px;">📋 NHẬN BÁO GIÁ NHANH</strong>
      <p style="margin:6px 0;font-size:13px;color:#666;">Điền SĐT, em báo giá ngay!</p>
      <input type="text" id="form-bg-name" placeholder="Họ tên *">
      <input type="tel" id="form-bg-phone" placeholder="Số điện thoại *" required>
      <input type="text" id="form-bg-note" placeholder="Ghi chú (vị trí cần thi công...)" style="font-size:12px;">
      <button onclick="guiBaoGia()">🔥 GỬI YÊU CẦU</button>
      <p style="font-size:11px;color:#999;margin-top:6px;">🔒 Cam kết bảo mật — Gọi lại trong 5 phút</p>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  window.guiBaoGia = function() {
    const name = document.getElementById('form-bg-name')?.value || '';
    const phone = document.getElementById('form-bg-phone')?.value || '';
    const note = document.getElementById('form-bg-note')?.value || '';
    if (!phone || phone.length < 10) { alert('Nhập SĐT 10 số!'); return; }

    const btn = document.querySelector('#form-baogia button');
    btn.textContent = '⏳ Đang gửi...';
    btn.disabled = true;

    fetch((window.API_URL || '') + '/api/quote', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, phone, service: note || 'Tư vấn từ chat'})
    }).catch(() => {});

    btn.textContent = '✅ Đã gửi!';
    btn.style.background = '#27ae60';
    addMessage('✅ Cảm ơn anh/chị! Em đã nhận yêu cầu. **' + HOTLINE + '** sẽ gọi lại trong 5 phút ạ!', 'may');
    setTimeout(function() {
      const f = document.getElementById('form-baogia');
      if (f) f.remove();
    }, 5000);
  };

  function sanitize(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function addMessage(text, type) {
    const msgs = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = type === 'user' ? 'msg msg-user' :
                    type === 'form' ? 'msg msg-form' : 'msg msg-may';
    if (type === 'user') {
      div.textContent = text;
    } else {
      // Xử lý markdown cơ bản: **bold** và \n
      var html = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
      // Thêm quick buttons nếu là tin đầu
      if (text === INTRO) {
        html += '<br><br><button class="msg-q-btn" onclick="quickAsk(\'Munich G20\')">⭐ G20</button>';
        html += '<button class="msg-q-btn" onclick="quickAsk(\'Munich chống thấm\')">🛡️ Chống thấm</button>';
        html += '<button class="msg-q-btn" onclick="quickAsk(\'Munich Epoxy\')">🏗️ Epoxy sàn</button>';
        html += '<button class="msg-q-btn" onclick="quickAsk(\'Báo giá thi công\')">🔨 Thi công</button>';
      }
      div.innerHTML = html;
    }
    div.id = 'msg-' + Date.now();
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div.id;
  }
})();
