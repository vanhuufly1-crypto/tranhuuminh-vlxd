/* ==========================================================
   CHAT WIDGET VLXD TRẦN HỮU MINH — JS Engine
   Trợ lý ảo: Mây ☁️
   ========================================================== */

(function () {
  'use strict';

  // =============== CONFIG ===============
  const CONFIG = {
    phone: '0378.679.633',
    zalo: '0378.679.633',
    storeName: 'VLXD Trần Hữu Minh',
    agentName: 'Mây',
    typingMin: 2000,
    typingMax: 4000,
    typingSteps: 3,
    scrollSmooth: true,
    launcherDelay: 3000,
    welcomeDelay: 1500,
    apiEndpoint: '/api/chatbot', // optional backend
    scriptUrl: '/chatbot/chatbot-script.json'
  };

  // =============== STATE ===============
  const State = {
    currentNode: 'root',
    history: [],
    isProcessing: false,
    user: { name: '', phone: '', address: '' },
    sessionId: 'thm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6)
  };

  // =============== DOM REFS ===============
  let DOM = {};
  let Script = null; // loaded decision tree

  // =============== UTILITIES ===============
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  function randomDelay(min, max) {
    return min + Math.random() * (max - min);
  }

  function formatTime(ts) {
    const d = ts ? new Date(ts) : new Date();
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    return hh + ':' + mm;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function debounce(fn, ms) {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, arguments), ms);
    };
  }

  // =============== MARKDOWN RENDERER (lightweight) ===============
  function renderMarkdown(text) {
    if (!text) return '';

    // Escape HTML first
    let html = escapeHtml(text);

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Inline code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Line breaks → paragraphs
    const blocks = html.split('\n\n').filter(b => b.trim());
    if (blocks.length === 0) return html;

    const processed = blocks.map(block => {
      // Check if it's a list
      if (/^[•\-\*]\s/.test(block.trim()) || /^\d+[\.\)]\s/.test(block.trim())) {
        return processListBlock(block);
      }
      // Single line
      if (!block.includes('\n')) {
        return '<p>' + block.trim() + '</p>';
      }
      // Multi-line: wrap in <p> with <br>
      return '<p>' + block.split('\n').join('<br>') + '</p>';
    });

    return processed.join('\n');
  }

  function processListBlock(block) {
    const lines = block.split('\n').filter(l => l.trim());
    const isOrdered = /^\d+[\.\)]\s/.test(lines[0]);
    const tag = isOrdered ? 'ol' : 'ul';
    let html = '<' + tag + '>\n';
    lines.forEach(line => {
      // Remove bullet or number prefix
      let content = line.replace(/^[•\-\*]\s+/, '');
      content = content.replace(/^\d+[\.\)]\s+/, '');
      html += '<li>' + content + '</li>\n';
    });
    html += '</' + tag + '>';
    return html;
  }

  // =============== SCRIPT LOADER ===============
  async function loadScript() {
    try {
      // Try loading from external URL
      const resp = await fetch(CONFIG.scriptUrl);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      Script = await resp.json();
      console.log('[Mây] Chatbot script loaded');
      return true;
    } catch (e) {
      console.warn('[Mây] Could not load external script:', e.message);
      // Try inline script as fallback
      if (window.__THM_CHATBOT_SCRIPT) {
        Script = window.__THM_CHATBOT_SCRIPT;
        console.log('[Mây] Using inline script');
        return true;
      }
      console.error('[Mây] No chatbot script available');
      return false;
    }
  }

  // =============== NODE RESOLVER ===============
  function getNode(nodeId) {
    if (!Script || !Script.nodes) return null;
    let node = Script.nodes[nodeId];
    if (!node) node = Script.fallback;
    return node || null;
  }

  function getRandomFrom(arr) {
    if (!arr || arr.length === 0) return '';
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // =============== MESSAGE RENDERER ===============
  function addBotMessage(text, options) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'thm-message thm-bot';
    msgDiv.dataset.ts = Date.now();

    // Avatar
    const avatar = document.createElement('div');
    avatar.className = 'thm-msg-avatar';
    avatar.textContent = '☁️';

    // Content
    const content = document.createElement('div');
    content.className = 'thm-msg-content';
    content.innerHTML = renderMarkdown(text);

    // Timestamp
    const time = document.createElement('div');
    time.className = 'thm-msg-time';
    time.textContent = formatTime();

    content.appendChild(time);
    msgDiv.appendChild(avatar);
    msgDiv.appendChild(content);

    DOM.messages.appendChild(msgDiv);

    // Quick replies
    if (options && options.length > 0) {
      addQuickReplies(options);
    }

    scrollToBottom();

    // Log
    State.history.push({ role: 'bot', text: text, ts: Date.now() });
  }

  function addUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'thm-message thm-user';
    msgDiv.dataset.ts = Date.now();

    const content = document.createElement('div');
    content.className = 'thm-msg-content';
    content.innerHTML = '<p>' + escapeHtml(text) + '</p>';

    const time = document.createElement('div');
    time.className = 'thm-msg-time';
    time.textContent = formatTime();

    content.appendChild(time);
    msgDiv.appendChild(content);
    DOM.messages.appendChild(msgDiv);

    DOM.tempReplies = null;
    scrollToBottom();

    State.history.push({ role: 'user', text: text, ts: Date.now() });
  }

  function addQuickReplies(options) {
    // Remove old quick replies
    const oldReplies = DOM.messages.querySelector('.thm-quick-replies');
    if (oldReplies) oldReplies.remove();

    if (!options || options.length === 0) return;

    const container = document.createElement('div');
    container.className = 'thm-quick-replies';

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'thm-quick-reply-btn';
      btn.textContent = opt.text;
      btn.dataset.next = opt.next;
      btn.addEventListener('click', function () {
        handleQuickReply(this.dataset.next, opt.text);
      });
      container.appendChild(btn);
    });

    DOM.messages.appendChild(container);
    DOM.tempReplies = container;
    scrollToBottom();
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      DOM.messages.scrollTop = DOM.messages.scrollHeight;
    });
  }

  // =============== TYPING INDICATOR ===============
  function showTyping() {
    DOM.typingIndicator.classList.add('thm-active');
    scrollToBottom();
  }

  function hideTyping() {
    DOM.typingIndicator.classList.remove('thm-active');
  }

  // =============== DELAYED REPLY ===============
  function delayedReply(text, options, callback) {
    const delay = randomDelay(CONFIG.typingMin, CONFIG.typingMax);
    showTyping();

    setTimeout(() => {
      hideTyping();
      addBotMessage(text, options);
      if (callback) callback();
    }, delay);
  }

  // =============== NODE PROCESSOR ===============
  function processNode(nodeId) {
    if (State.isProcessing) return;
    State.isProcessing = true;

    const node = getNode(nodeId);
    if (!node) {
      // Fallback
      const fallback = Script ? Script.fallback : null;
      if (fallback) {
        processNode('fallback');
      } else {
        addBotMessage('☁️ Có lỗi xảy ra, anh/chị vui lòng thử lại sau ạ!');
      }
      State.isProcessing = false;
      return;
    }

    State.currentNode = node.id;

    switch (node.type) {
      case 'question':
        delayedReply(node.question, node.options, () => {
          State.isProcessing = false;
        });
        break;

      case 'answer':
        delayedReply(node.answer, node.nextOptions, () => {
          State.isProcessing = false;
        });
        break;

      case 'input':
        // Show question without options (user must type)
        delayedReply(node.question, null, () => {
          State.isProcessing = false;
          State.waitingForInput = nodeId;
        });
        break;

      case 'info':
        addBotMessage(node.message, node.nextOptions);
        State.isProcessing = false;
        break;

      default:
        addBotMessage(node.answer || node.question, node.nextOptions || node.options);
        State.isProcessing = false;
    }
  }

  // =============== QUICK REPLY / USER INPUT HANDLER ===============
  function handleQuickReply(nextNodeId, buttonText) {
    if (State.isProcessing) return;

    // Add user's button click as a message
    addUserMessage(buttonText);

    State.waitingForInput = null;

    // Check special nodes
    if (nextNodeId === 'call') {
      handleCallAction();
      return;
    }
    if (nextNodeId === 'zalo') {
      handleZaloAction();
      return;
    }

    processNode(nextNodeId);
  }

  function handleTextInput(text) {
    if (!text.trim() || State.isProcessing) return;
    if (State.waitingForInput) {
      // User is providing info (e.g., area size, phone number)
      addUserMessage(text);
      const waitingNode = State.waitingForInput;
      State.waitingForInput = null;
      // After input, go back to appropriate next
      // Use the node's nextOptions or go to root
      const node = getNode(waitingNode);
      if (node && node.nextOptions) {
        // Check keyword matching for smart routing
        const matchedOption = matchKeyword(text, node.nextOptions);
        if (matchedOption) {
          delayedReply('Cảm ơn anh/chị! Mây đã ghi nhận thông tin. Em sẽ chuyển đến bước tiếp theo ạ ☁️', node.nextOptions, () => {
            if (matchedOption.next) processNode(matchedOption.next);
          });
        } else {
          // Show next options after input
          addBotMessage('Cảm ơn anh/chị! Em đã nhận được thông tin. Anh/chị muốn làm gì tiếp theo ạ?', node.nextOptions);
          State.isProcessing = false;
        }
      } else {
        addBotMessage('Cảm ơn anh/chị! Mây sẽ hỗ trợ ngay  ☁️', [{ text: '🏠 Về menu chính', next: 'root' }]);
        State.isProcessing = false;
      }
    } else {
      // Normal text — try keyword matching from root
      addUserMessage(text);
      tryRouteKeyword(text);
    }
  }

  function matchKeyword(text, options) {
    if (!options || !text) return null;
    const lower = text.toLowerCase().trim();

    for (const opt of options) {
      if (opt.keywords) {
        for (const kw of opt.keywords) {
          if (lower.includes(kw.toLowerCase())) {
            return opt;
          }
        }
      }
    }

    // Check if text matches option text partially
    for (const opt of options) {
      if (opt.text && lower.includes(opt.text.toLowerCase().substring(0, 10))) {
        return opt;
      }
    }

    return null;
  }

  function tryRouteKeyword(text) {
    const rootNode = getNode('root');
    if (!rootNode || !rootNode.options) {
      showDefaultFallback();
      return;
    }

    const matched = matchKeyword(text, rootNode.options);
    if (matched && matched.next) {
      processNode(matched.next);
    } else {
      // Try fallback
      const fallback = getNode('fallback');
      if (fallback) {
        delayedReply(fallback.answer, fallback.nextOptions, () => {
          State.isProcessing = false;
        });
      } else {
        showDefaultFallback();
      }
    }
  }

  function showDefaultFallback() {
    addBotMessage(
      '☁️ Mây chưa hiểu ý anh/chị lắm ạ 🤔\n\nAnh/chị có thể chọn một trong các mục bên dưới hoặc gọi em qua **0378.679.633** để được hỗ trợ nhanh hơn nhé!',
      [
        { text: '🛡️ Chống thấm', next: 'chong-tham-menu' },
        { text: '🎨 Sơn nước', next: 'son-nuoc-menu' },
        { text: '📄 Báo giá', next: 'bao-gia' },
        { text: '🏠 Menu chính', next: 'root' }
      ]
    );
    State.isProcessing = false;
  }

  // =============== SPECIAL ACTIONS ===============
  function handleCallAction() {
    addBotMessage(
      '📞 Anh/chị gọi ngay **' + CONFIG.phone + '** để nói chuyện trực tiếp với em nhé!\n\nHoặc để lại SĐT, em gọi lại ạ.',
      [
        { text: '🏠 Về menu chính', next: 'root' },
        { text: '💬 Chat Zalo', next: 'zalo' }
      ]
    );
    State.isProcessing = false;
  }

  function handleZaloAction() {
    addBotMessage(
      '💬 Kết bạn Zalo **' + CONFIG.zalo + '** để nhận bảng giá & tư vấn chi tiết ạ!\n\nHoặc quét mã QR trên website **tranhuuminh.vn**',
      [
        { text: '📞 Gọi điện', next: 'call' },
        { text: '🏠 Về menu chính', next: 'root' }
      ]
    );
    State.isProcessing = false;
  }

  // =============== WELCOME FLOW ===============
  function startChat() {
    // Clear messages
    DOM.messages.innerHTML = '';

    // Welcome message
    const welcomeTexts = Script && Script.scriptTemplates && Script.scriptTemplates.welcome
      ? Script.scriptTemplates.welcome
      : ['☁️ Chào anh/chị! Em là Mây — trợ lý tư vấn của VLXD Trần Hữu Minh. Anh/chị cần tìm hiểu về sản phẩm gì ạ?'];

    const welcome = welcomeTexts[Math.floor(Math.random() * welcomeTexts.length)];

    // Start with the root node
    setTimeout(() => {
      processNode('root');
    }, CONFIG.welcomeDelay);
  }

  // =============== TOGGLE WIDGET ===============
  function toggleWidget(open) {
    const shouldOpen = open !== undefined ? open : !DOM.widget.classList.contains('thm-open');

    if (shouldOpen) {
      DOM.widget.classList.add('thm-open');
      DOM.launcher.style.display = 'none';
      DOM.launcherBadge.style.display = 'none';

      if (State.history.length === 0) {
        startChat();
      } else {
        scrollToBottom();
      }
    } else {
      DOM.widget.classList.remove('thm-open');
      DOM.launcher.style.display = 'flex';
    }
  }

  // =============== BUILD DOM ===============
  function buildWidget() {
    // Check if widget already exists
    if (document.querySelector('.thm-chat-widget')) {
      return;
    }

    // Create overlay container
    const container = document.createElement('div');
    container.className = 'thm-chat-widget';
    container.id = 'thmChatWidget';

    // === Header ===
    const header = document.createElement('div');
    header.className = 'thm-chat-header';
    header.innerHTML = `
      <div class="thm-avatar">☁️</div>
      <div class="thm-header-info">
        <div class="thm-header-name">${CONFIG.agentName} - ${CONFIG.storeName}</div>
        <div class="thm-header-status">
          <span class="thm-status-dot"></span>
          Online
        </div>
      </div>
      <button class="thm-header-close" aria-label="Đóng chat">✕</button>
    `;

    // === Messages ===
    const messages = document.createElement('div');
    messages.className = 'thm-chat-messages';

    // Typing indicator
    const typing = document.createElement('div');
    typing.className = 'thm-typing-indicator';
    typing.innerHTML = `
      <div class="thm-msg-avatar">☁️</div>
      <div class="thm-typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;

    messages.appendChild(typing);

    // === Action Bar ===
    const actionBar = document.createElement('div');
    actionBar.className = 'thm-action-bar';
    actionBar.innerHTML = `
      <a class="thm-action-btn thm-call-btn" href="tel:${CONFIG.phone}">
        <svg viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.25 1.01l-2.2 2.2z"/></svg>
        Gọi ${CONFIG.phone}
      </a>
      <a class="thm-action-btn thm-zalo-btn" href="https://zalo.me/${CONFIG.zalo}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l4.59-4.59L17 11l-6 6z"/></svg>
        Chat Zalo
      </a>
    `;

    // === Input ===
    const inputArea = document.createElement('div');
    inputArea.className = 'thm-chat-input';
    inputArea.innerHTML = `
      <input type="text" placeholder="Nhập tin nhắn..." autocomplete="off">
      <button class="thm-send-btn" aria-label="Gửi">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    `;

    // === Assemble ===
    container.appendChild(header);
    container.appendChild(messages);
    container.appendChild(actionBar);
    container.appendChild(inputArea);

    document.body.appendChild(container);

    // === Launcher ===
    const launcher = document.createElement('button');
    launcher.className = 'thm-chat-launcher';
    launcher.setAttribute('aria-label', 'Mở chat');
    launcher.innerHTML = `
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>
      <span class="thm-launcher-badge" style="display:none;">1</span>
    `;

    document.body.appendChild(launcher);

    // === Store refs ===
    DOM.widget = container;
    DOM.header = header;
    DOM.messages = messages;
    DOM.typingIndicator = typing;
    DOM.inputArea = inputArea;
    DOM.input = inputArea.querySelector('input');
    DOM.sendBtn = inputArea.querySelector('.thm-send-btn');
    DOM.closeBtn = header.querySelector('.thm-header-close');
    DOM.launcher = launcher;
    DOM.launcherBadge = launcher.querySelector('.thm-launcher-badge');
    DOM.actionBar = actionBar;
  }

  // =============== EVENT BINDING ===============
  function bindEvents() {
    // Launcher click
    DOM.launcher.addEventListener('click', function () {
      toggleWidget(true);
    });

    // Close button
    DOM.closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleWidget(false);
    });

    // Send button
    DOM.sendBtn.addEventListener('click', function () {
      sendMessage();
    });

    // Enter key
    DOM.input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Header click to close (optional)
    DOM.header.addEventListener('click', function (e) {
      if (e.target.closest('.thm-header-close')) return;
      if (e.target.closest('.thm-avatar') || e.target.closest('.thm-header-info')) return;
    });

    // Auto-resize input on mobile
    DOM.input.addEventListener('input', function () {
      // nothing needed for now
    });

    // Click outside to close
    document.addEventListener('click', function (e) {
      if (DOM.widget.classList.contains('thm-open')) {
        const isClickInside = DOM.widget.contains(e.target) || DOM.launcher.contains(e.target);
        if (!isClickInside) {
          toggleWidget(false);
        }
      }
    });
  }

  function sendMessage() {
    const text = DOM.input.value.trim();
    if (!text) return;

    DOM.input.value = '';
    handleTextInput(text);
  }

  // =============== INIT ===============
  async function init() {
    // Build DOM
    buildWidget();

    // Load script
    const loaded = await loadScript();
    if (!loaded) {
      // Create a minimal fallback tree
      Script = {
        nodes: {
          root: {
            id: 'root',
            type: 'question',
            question: '☁️ Chào anh/chị! Em là Mây — trợ lý tư vấn của VLXD Trần Hữu Minh. Anh/chị cần tìm hiểu về sản phẩm gì ạ?',
            options: [
              { text: '🛡️ Chống thấm', next: 'ct' },
              { text: '🎨 Sơn nước', next: 'sn' },
              { text: '📄 Báo giá', next: 'bg' }
            ]
          },
          ct: { id: 'ct', type: 'answer', answer: 'Bên em có Munich G20, Sika, Kova CT. Anh/ chị chống thấm cho khu vực nào?', nextOptions: [{ text: '🏠 Về menu', next: 'root' }] },
          sn: { id: 'sn', type: 'answer', answer: 'Sơn nước có Munich, Dulux, Jotun — nội thất & ngoại thất. Anh/chị cần dòng nào?', nextOptions: [{ text: '🏠 Về menu', next: 'root' }] },
          bg: { id: 'bg', type: 'answer', answer: 'Gọi 0378.679.633 hoặc để lại SĐT em báo giá.', nextOptions: [{ text: '🏠 Về menu', next: 'root' }] }
        },
        fallback: { id: 'fallback', type: 'answer', answer: 'Mây chưa hiểu, anh/chị chọn giúp em nhé!', nextOptions: [{ text: '🏠 Về menu', next: 'root' }] }
      };
    }

    // Bind events
    bindEvents();

    // Auto-show launcher after delay
    setTimeout(() => {
      DOM.launcher.style.display = 'flex';
    }, CONFIG.launcherDelay);

    console.log('[Mây] Chatbot ready ☁️');
  }

  // =============== AUTO INIT ===============
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // =============== PUBLIC API ===============
  window.THM_Chat = {
    open: function () { toggleWidget(true); },
    close: function () { toggleWidget(false); },
    toggle: function () { toggleWidget(); },
    sendMessage: function (text) {
      DOM.input.value = text;
      sendMessage();
    },
    navigate: function (nodeId) {
      if (nodeId) processNode(nodeId);
    },
    getState: function () {
      return {
        currentNode: State.currentNode,
        history: State.history,
        user: State.user
      };
    },
    reset: function () {
      State.currentNode = 'root';
      State.history = [];
      State.isProcessing = false;
      DOM.messages.innerHTML = '';
      DOM.messages.appendChild(DOM.typingIndicator);
      startChat();
    }
  };

})();
