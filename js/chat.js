/* Chat widget - Mây AI ☁️ cho VLHT Trần Hữu Minh */
// API URL - cập nhật khi chạy tunnel
const CHAT_API_URL = localStorage.getItem('vlht_chat_api') || 'https://vlht-chat.loca.lt';

(function() {
  'use strict';

  let isOpen = false;
  let chatHistory = [];

  // Tạo HTML widget
  const widget = document.createElement('div');
  widget.id = 'chat-widget';
  widget.innerHTML = `
    <button id="chat-toggle" onclick="toggleChat()" aria-label="Chat với Mây">
      <span class="chat-icon">☁️</span>
    </button>
    <div id="chat-box" class="chat-hidden">
      <div id="chat-header">
        <span>☁️ Mây - Trợ lý VLHT</span>
        <button onclick="toggleChat()" class="chat-close">&times;</button>
      </div>
      <div id="chat-messages">
        <div class="msg msg-may">
          <strong>☁️ Mây:</strong> Chào bạn! Mình là Mây — trợ lý của Công ty VLHT Trần Hữu Minh. Mình có thể giúp gì cho bạn về sơn, chống thấm, vật liệu xây dựng không? 😊
        </div>
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
      background:linear-gradient(135deg,#0fb9b1,#0984e3); color:white;
      font-size:28px; cursor:pointer; box-shadow:0 4px 15px rgba(0,0,0,0.3);
      transition:transform 0.2s; display:flex; align-items:center; justify-content:center;
    }
    #chat-toggle:hover { transform:scale(1.1); }
    #chat-box {
      position:fixed; bottom:85px; right:20px; width:360px; height:500px;
      background:white; border-radius:16px; box-shadow:0 5px 25px rgba(0,0,0,0.2);
      display:flex; flex-direction:column; overflow:hidden;
      transition:all 0.3s ease;
    }
    .chat-hidden { opacity:0; visibility:hidden; transform:translateY(20px) scale(0.95); pointer-events:none; }
    #chat-header {
      background:linear-gradient(135deg,#0fb9b1,#0984e3); color:white;
      padding:14px 18px; font-weight:600; display:flex; justify-content:space-between; align-items:center;
    }
    .chat-close { background:none; border:none; color:white; font-size:24px; cursor:pointer; }
    #chat-messages {
      flex:1; overflow-y:auto; padding:14px; background:#f8f9fa;
      display:flex; flex-direction:column; gap:10px;
    }
    .msg {
      padding:10px 14px; border-radius:12px; max-width:85%;
      font-size:14px; line-height:1.5; word-wrap:break-word;
    }
    .msg-may {
      align-self:flex-start; background:white; border:1px solid #e0e0e0;
      border-bottom-left-radius:4px; color:#333;
    }
    .msg-user {
      align-self:flex-end; background:#0fb9b1; color:white;
      border-bottom-right-radius:4px;
    }
    .msg strong { display:block; margin-bottom:2px; }
    .msg-error { background:#ffe0e0; color:#c0392b; align-self:center; text-align:center; font-size:13px; }
    .msg-typing { align-self:flex-start; background:white; border:1px solid #e0e0e0; border-bottom-left-radius:4px; color:#999; font-style:italic; }
    #chat-input-area {
      display:flex; padding:10px 12px; border-top:1px solid #e0e0e0; background:white;
      gap:8px; align-items:flex-end;
    }
    #chat-input {
      flex:1; border:1px solid #ddd; border-radius:20px; padding:10px 14px;
      font-size:14px; resize:none; outline:none; font-family:inherit;
    }
    #chat-input:focus { border-color:#0fb9b1; }
    #chat-send {
      background:#0fb9b1; color:white; border:none; border-radius:20px;
      padding:10px 20px; cursor:pointer; font-weight:600; font-size:14px;
      transition:background 0.2s; white-space:nowrap;
    }
    #chat-send:hover { background:#0a9e96; }
    #chat-send:disabled { background:#ccc; cursor:not-allowed; }

    @media (max-width:480px) {
      #chat-box { width:calc(100vw - 30px); height:60vh; right:10px; bottom:75px; }
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

  window.sendChat = async function() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    // Hiển thị tin nhắn user
    chatHistory.push({role:'user', content:msg});
    addMessage(msg, 'user');
    input.value = '';
    document.getElementById('chat-send').disabled = true;

    // Typing indicator
    const typingId = addMessage('☁️ Mây đang trả lời...', 'typing');

    try {
      const resp = await fetch(CHAT_API_URL + '/chat', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({message: msg, history: chatHistory.slice(-10)})
      });

      if (!resp.ok) throw new Error('Lỗi ' + resp.status);

      const data = await resp.json();
      const reply = data.reply || 'Xin lỗi, mình không hiểu. Bạn gọi 0378.679.633 để được tư vấn trực tiếp nhé!';

      // Xóa typing, thêm reply
      removeMessage(typingId);
      addMessage(reply, 'may');
      chatHistory.push({role:'assistant', content:reply});

    } catch(e) {
      removeMessage(typingId);
      addMessage('❌ Mây đang bảo trì. Vui lòng gọi hotline 0378.679.633 để được hỗ trợ!', 'error');
    }

    document.getElementById('chat-send').disabled = false;
    document.getElementById('chat-input').focus();
  };

  function addMessage(text, type) {
    const msgs = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = type === 'user' ? 'msg msg-user' :
                    type === 'error' ? 'msg msg-error' :
                    type === 'typing' ? 'msg msg-typing' : 'msg msg-may';
    div.innerHTML = type === 'user' ? text :
                    type === 'may' ? '<strong>☁️ Mây:</strong> ' + text : text;
    div.id = 'msg-' + Date.now();
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div.id;
  }

  function removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }
})();
