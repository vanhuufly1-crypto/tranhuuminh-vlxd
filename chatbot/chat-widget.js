/* ==========================================================
   CHAT WIDGET VLXD TRẦN HỮU MINH — Engine "Người Thật"
   Version 2.0 — Human-like Chat Engine
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
    // Typing delays — thông minh tỉ lệ với độ dài câu
    typingMsPerChar: 40,
    typingMinMs: 2000,
    typingMaxMs: 8000,
    // Chunk delay giữa các tin nhắn nhỏ
    chunkDelayMin: 1500,
    chunkDelayMax: 3000,
    // Typo chance (5-10% mỗi câu)
    typoChance: 0.08,
    scrollSmooth: true,
    launcherDelay: 3000,
    welcomeDelay: 1500,
    apiEndpoint: '/api/chatbot',
    scriptUrl: '/chatbot/chatbot-script.json',
    // Timeout cho mỗi lần "đang nhập"
    maxTypingPerMessage: 8000
  };

  // =============== STATE ===============
  const State = {
    currentNode: 'root',
    history: [],
    isProcessing: false,
    waitingForInput: null,
    // Thông tin khách hàng
    user: {
      name: '',
      phone: '',
      address: '',
      location: '',
      gender: 'unknown',
      ageGroup: 'unknown',
      lastMentionedLocation: ''
    },
    // Đã hiện disclaimer chưa?
    disclaimerShown: false,
    // Session
    sessionId: 'thm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    // Typo tracking
    lastTypoFixPending: null,
    // Conversation context
    lastTopic: '',
    lastUserMessage: '',
    userMessageCount: 0,
    // Cảm xúc gần nhất
    lastDetectedEmotion: ''
  };

  // =============== DOM REFS ===============
  let DOM = {};
  let Script = null;

  // =============== UTILITIES ===============
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomFloat(min, max) {
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

  function pickRandom(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // =============== HẢI PHÒNG DIALECT ENGINE ===============
  const DIALECT_MAP = {
    'nhé': 'nha',
    'nhé?': 'nghen?',
    'rất': '',
    'thật': 'thiệt',
    'vậy à': 'vậy hả',
    'vậy ạ': 'vậy ạ',
    'lắm': 'quá trời',
    'nhiều': 'quá chừng',
    'gửi': 'gưi',
    'có': 'cóa',
    'được': 'đực',
    'thôi': 'thoy',
    'thế': 'thía',
    'nhỉ': 'nhỉ',
    'kìa': 'kia'
  };

  function applyDialect(text) {
    // Nhẹ nhàng, chỉ áp dụng 1-2 từ ngẫu nhiên
    let result = text;
    const keys = Object.keys(DIALECT_MAP);
    // Chọn 1-2 từ để thay đổi
    const changeCount = randomInt(1, 2);
    const selectedKeys = [];
    for (const key of keys) {
      if (result.includes(key) && !selectedKeys.includes(key)) {
        selectedKeys.push(key);
      }
    }
    // Xáo trộn và chọn
    const shuffled = selectedKeys.sort(() => Math.random() - 0.5);
    const toChange = shuffled.slice(0, changeCount);
    for (const key of toChange) {
      result = result.replace(new RegExp(key, 'g'), DIALECT_MAP[key]);
    }
    return result;
  }

  function addFillerWord(text) {
    const fillers = ['à', 'thì', 'nói chung', 'ý em là', 'ừ để em check lại'];
    // 20% chance thêm filler vào đầu câu
    if (Math.random() < 0.2 && text.length > 20) {
      const filler = pickRandom(fillers);
      // Lowercase first char if it's uppercase
      return filler + ' ' + text.charAt(0).toLowerCase() + text.slice(1);
    }
    return text;
  }

  // =============== TYPO ENGINE ===============
  const TYPO_MAP = {
    'gửi': 'gưi',
    'Gửi': 'Gưi',
    'có': 'cóa',
    'Có': 'Cóa',
    'được': 'đực',
    'Được': 'Đực',
    'thôi': 'thoy',
    'Thôi': 'Thoy',
    'nhé': 'nhe',
    'Nhé': 'Nhe',
    'giá': 'gia',
    'báo giá': 'bao gia',
    'chống thấm': 'chong tham',
    'thi công': 'thi cong',
    'sản phẩm': 'san pham',
    'bảng giá': 'bang gia',
    'gạch': 'gach'
  };

  function maybeAddTypo(text) {
    // 8% chance có lỗi chính tả
    if (Math.random() > CONFIG.typoChance) return null;

    // Chọn ngẫu nhiên một từ trong TYPO_MAP
    const keys = Object.keys(TYPO_MAP);
    const key = pickRandom(keys);
    if (text.includes(key)) {
      const typoVersion = text.replace(key, TYPO_MAP[key]);
      // Giới hạn: chỉ typo tối đa 1 lỗi trong câu
      if (typoVersion !== text) {
        return {
          typoText: typoVersion,
          original: key,
          typo: TYPO_MAP[key]
        };
      }
    }
    return null;
  }

  function createTypoFixMessage(typoInfo) {
    // Câu sửa lỗi tự nhiên
    const fixTemplates = [
      'à ' + typoInfo.typo + ' — ý em là ' + typoInfo.original + ' á 😅',
      'em nhầm tí, ' + typoInfo.original + ' chứ hông phải ' + typoInfo.typo + ' 😅',
      'à em gõ nhầm, ' + typoInfo.original + ' nha!'
    ];
    return pickRandom(fixTemplates);
  }

  // =============== LOCATION & NAME DETECTION ===============
  const HP_LOCATIONS = [
    'hồng bàng', 'lê chân', 'ngô quyền', 'kiến an', 'hải an',
    'dương kinh', 'đồ sơn', 'vĩnh niệm', 'vĩnh bảo', 'tiên lãng',
    'cát hải', 'bạch long vĩ', 'thủy nguyên', 'an dương', 'an lão',
    'kiến thụy', 'đồ sơn', 'dương kinh', 'thành phố hải phòng',
    'tràng cát', 'đằng giang', 'đông hải', 'nam hải', 'bàng la'
  ];

  function detectLocation(text) {
    const lower = text.toLowerCase();
    for (const loc of HP_LOCATIONS) {
      if (lower.includes(loc)) {
        return loc.charAt(0).toUpperCase() + loc.slice(1);
      }
    }
    // Detect Hải Phòng variation
    if (lower.includes('hải phòng') || lower.includes('hai phong') || lower.includes('hp')) {
      return 'Hải Phòng';
    }
    return null;
  }

  function detectName(text) {
    // Pattern: "em là X", "tôi là X", "tên em là X", "tên tôi là X", "X đây"
    const patterns = [
      /(?:em là|tôi là|mình là|tên em là|tên tôi là|tên mình là|gọi em là|gọi tôi là)\s+([A-ZÀÁẠÃẢĂẮẶẰẴÂẤẬẦẨĐÈÉẸẼẺÊẾỆỀỂÌÍỊĨỈÒÓỌÕỎÔỐỘỒỔƠỚỢỜỠÙÚỤŨỦƯỨỰỪỬỲÝỴỸỶ][a-zàáạãảăắặằẵâấậầẩđèéẹẽẻêếệềểìíịĩỉòóọõỏôốộồổơớợờỡùúụũủưứựừửỳýỵỹỷ]+)/i,
      /(?:chị|anh|em|cô|chú|bác|thầy|bạn)\s+([A-ZÀÁẠÃẢĂẮẶẰẴÂẤẬẦẨĐÈÉẸẼẺÊẾỆỀỂÌÍỊĨỈÒÓỌÕỎÔỐỘỒỔƠỚỢỜỠÙÚỤŨỦƯỨỰỪỬỲÝỴỸỶ][a-zàáạãảăắặằẵâấậầẩđèéẹẽẻêếệềểìíịĩỉòóọõỏôốộồổơớợờỡùúụũủưứựừửỳýỵỹỷ]+)/i
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return null;
  }

  function detectEmotion(text) {
    const lower = text.toLowerCase();
    if (lower.includes('dột') || lower.includes('thấm') || lower.includes('ướt')) return 'dot';
    if (lower.includes('mệt') || lower.includes('mệt mỏi') || lower.includes('chán')) return 'met';
    if (lower.includes('tốn') || lower.includes('mắc') || lower.includes('đắt') || lower.includes('tốn kém')) return 'tonkem';
    if (lower.includes('gấp') || lower.includes('nhanh') || lower.includes('khẩn') || lower.includes('sớm')) return 'gap';
    if (lower.includes('khó chịu') || lower.includes('bực') || lower.includes('tức')) return 'negative';
    return '';
  }

  function detectGender(text) {
    const lower = text.toLowerCase();
    if (lower.includes('anh') || lower.includes('chú') || lower.includes('bác')) return 'male';
    if (lower.includes('chị') || lower.includes('cô') || lower.includes('dì')) return 'female';
    return 'unknown';
  }

  // =============== MARKDOWN RENDERER ===============
  function renderMarkdown(text) {
    if (!text) return '';
    let html = escapeHtml(text);
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    const blocks = html.split('\n\n').filter(b => b.trim());
    if (blocks.length === 0) return html;

    const processed = blocks.map(block => {
      if (/^[•\-\*]\s/.test(block.trim()) || /^\d+[\.\)]\s/.test(block.trim())) {
        return processListBlock(block);
      }
      if (!block.includes('\n')) {
        return '<p>' + block.trim() + '</p>';
      }
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
      let c = line.replace(/^[•\-\*]\s+/, '');
      c = c.replace(/^\d+[\.\)]\s+/, '');
      html += '<li>' + c + '</li>\n';
    });
    html += '</' + tag + '>';
    return html;
  }

  // =============== SCRIPT LOADER ===============
  async function loadScript() {
    try {
      const resp = await fetch(CONFIG.scriptUrl);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      Script = await resp.json();
      console.log('[Mây v2] Chatbot script loaded');
      return true;
    } catch (e) {
      console.warn('[Mây v2] Could not load external script:', e.message);
      if (window.__THM_CHATBOT_SCRIPT) {
        Script = window.__THM_CHATBOT_SCRIPT;
        console.log('[Mây v2] Using inline script');
        return true;
      }
      console.error('[Mây v2] No chatbot script available');
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

  function getVariantText(node, field) {
    // Ưu tiên dùng responseVariants nếu có
    const variants = node.responseVariants;
    if (variants && variants.length > 0) {
      // 50% dùng variant, 50% dùng text gốc
      if (Math.random() < 0.7) {
        return pickRandom(variants);
      }
    }
    return node[field] || '';
  }

  function getChunks(node) {
    return node.chunks || null;
  }

  // =============== TYPING INDICATOR ===============
  function showTyping() {
    DOM.typingIndicator.classList.add('thm-active');
    scrollToBottom();
  }

  function hideTyping() {
    DOM.typingIndicator.classList.remove('thm-active');
  }

  // =============== SMART TYPING DELAY ===============
  function calculateTypingDelay(text) {
    const charCount = text.length;
    // Tỉ lệ thuận với độ dài
    let delay = charCount * CONFIG.typingMsPerChar;
    // Giới hạn
    delay = Math.max(CONFIG.typingMinMs, Math.min(delay, CONFIG.typingMaxMs));
    // Thêm độ ngẫu nhiên ±20%
    delay = delay * randomFloat(0.8, 1.2);
    return Math.round(delay);
  }

  // =============== MESSAGE RENDERER ===============
  function addBotMessage(text, options) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'thm-message thm-bot';
    msgDiv.dataset.ts = Date.now();

    const avatar = document.createElement('div');
    avatar.className = 'thm-msg-avatar';
    avatar.textContent = '☁️';

    const content = document.createElement('div');
    content.className = 'thm-msg-content';
    content.innerHTML = renderMarkdown(text);

    const time = document.createElement('div');
    time.className = 'thm-msg-time';
    time.textContent = formatTime();

    content.appendChild(time);
    msgDiv.appendChild(avatar);
    msgDiv.appendChild(content);

    DOM.messages.appendChild(msgDiv);

    if (options && options.length > 0) {
      addQuickReplies(options);
    }

    scrollToBottom();

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

  // =============== CHUNKED RESPONSES ===============
  async function sendChunkedResponse(chunks, chunkOptions) {
    if (!chunks || chunks.length === 0) return;

    // Gửi từng chunk với delay
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      // Tính delay cho chunk này
      const delay = calculateTypingDelay(chunk);

      showTyping();
      await sleep(delay);
      hideTyping();

      // Có thể có typo ở 1 chunk
      if (i < chunks.length - 1 && Math.random() < CONFIG.typoChance) {
        const typoInfo = maybeAddTypo(chunk);
        if (typoInfo) {
          // Gửi typo version
          addBotMessage(typoInfo.typoText);
          // Delay rồi gửi sửa
          await sleep(randomInt(2000, 3500));
          const fixMsg = createTypoFixMessage(typoInfo);
          if (fixMsg) {
            showTyping();
            await sleep(randomInt(1500, 2500));
            hideTyping();
            addBotMessage(fixMsg);
          }
          continue;
        }
      }

      // Gửi chunk bình thường
      // Chunk cuối cùng thì kèm options
      if (i === chunks.length - 1) {
        addBotMessage(chunk, chunkOptions || null);
      } else {
        addBotMessage(chunk);
      }
    }
  }

  // =============== QUICK REPLIES ===============
  function addQuickReplies(options) {
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
        if (State.isProcessing) return;
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

  // =============== PROCESS USER INFO ===============
  function processUserMessage(text) {
    // Detect tên
    const name = detectName(text);
    if (name && !State.user.name) {
      State.user.name = name;
    }
    // Detect location
    const location = detectLocation(text);
    if (location) {
      State.user.location = location;
      State.user.lastMentionedLocation = location;
    }
    // Detect gender từ xưng hô
    if (State.user.gender === 'unknown') {
      State.user.gender = detectGender(text);
    }
    // Detect cảm xúc
    const emotion = detectEmotion(text);
    if (emotion) {
      State.lastDetectedEmotion = emotion;
    }

    State.lastUserMessage = text;
    State.userMessageCount++;
  }

  // =============== GET GREETING TERM ===============
  function getGreetingTerm() {
    if (State.user.gender === 'male') return 'anh';
    if (State.user.gender === 'female') return 'chị';
    return 'anh/chị';
  }

  function personalizeBotMessage(text) {
    let result = text;
    // Replace [name] if user gave name
    if (State.user.name) {
      result = result.replace('[name]', State.user.name);
      result = result.replace('anh/chị', 'anh ' + State.user.name);
    }
    // Replace [location]
    if (State.user.lastMentionedLocation) {
      result = result.replace('[location]', State.user.lastMentionedLocation);
    }
    return result;
  }

  // =============== EMPATHETIC RESPONSE ===============
  function getEmpatheticResponse(emotion) {
    if (!Script || !Script.empatheticResponses) return null;
    const responses = Script.empatheticResponses[emotion];
    if (!responses || responses.length === 0) return null;
    return pickRandom(responses);
  }

  // =============== TRY STORYTELLING ===============
  function getStoryForNode(nodeId) {
    if (!Script || !Script.storyBank) return null;
    const stories = Script.storyBank[nodeId];
    if (!stories || stories.length === 0) return null;
    // 30% chance kể chuyện
    if (Math.random() < 0.3) {
      return pickRandom(stories).story;
    }
    return null;
  }

  // =============== PRE-SUASION / SCARCITY ===============
  function maybeAddPresuasion() {
    if (!Script || !Script.presuasionTemplates) return null;
    // 15% chance
    if (Math.random() < 0.15) {
      return pickRandom(Script.presuasionTemplates);
    }
    return null;
  }

  function maybeAddScarcity() {
    if (!Script || !Script.scarcityLines) return null;
    // 10% chance
    if (Math.random() < 0.10) {
      return pickRandom(Script.scarcityLines);
    }
    return null;
  }

  // =============== NODE PROCESSOR ===============
  async function processNode(nodeId) {
    if (State.isProcessing) return;
    State.isProcessing = true;

    const node = getNode(nodeId);
    if (!node) {
      const fallback = Script ? Script.fallback : null;
      if (fallback) {
        State.isProcessing = false;
        await processNode('fallback');
        return;
      }
      addBotMessage('☁️ Có lỗi xảy ra, anh/chị vui lòng thử lại sau ạ!');
      State.isProcessing = false;
      return;
    }

    State.currentNode = node.id;

    switch (node.type) {
      case 'question': {
        const text = getVariantText(node, 'question');
        const personalized = personalizeBotMessage(text);
        const delay = calculateTypingDelay(personalized);

        // Check emotion trước
        if (State.lastDetectedEmotion) {
          const empResponse = getEmpatheticResponse(State.lastDetectedEmotion);
          if (empResponse) {
            await sendWithDelay(empResponse);
            State.lastDetectedEmotion = ''; // reset sau khi đã cảm thông
          }
        }

        // Có thể thêm story hoặc presuasion
        const story = getStoryForNode(nodeId);
        if (story) {
          await sendWithDelay(story);
        }

        showTyping();
        await sleep(delay);
        hideTyping();

        // Cơ chế typo cho câu hỏi
        const typoInfo = maybeAddTypo(personalized);
        if (typoInfo) {
          addBotMessage(typoInfo.typoText);
          await sleep(randomInt(2000, 3500));
          const fix = createTypoFixMessage(typoInfo);
          showTyping();
          await sleep(randomInt(1200, 2000));
          hideTyping();
          addBotMessage(fix);
          // Gửi lại câu hỏi đúng chính tả
          addBotMessage('Để em hỏi lại nha ' + personalized, node.options);
        } else {
          addBotMessage(personalized, node.options);
        }

        State.isProcessing = false;
        break;
      }

      case 'answer': {
        const text = getVariantText(node, 'answer');
        const personalized = personalizeBotMessage(text);
        const chunks = getChunks(node);

        // Check emotion trước
        if (State.lastDetectedEmotion) {
          const empResponse = getEmpatheticResponse(State.lastDetectedEmotion);
          if (empResponse) {
            await sendWithDelay(empResponse);
          }
        }

        // Có thể thêm presuasion
        const presuasion = maybeAddPresuasion();
        const scarcity = maybeAddScarcity();

        if (chunks && chunks.length > 0) {
          // Gửi theo chunk
          let processedChunks = chunks.map(c => personalizeBotMessage(c));
          // Thêm presuasion và scarcity vào chunks nếu có
          if (presuasion) {
            processedChunks.push(presuasion);
          }
          if (scarcity) {
            processedChunks.push(scarcity);
          }
          await sendChunkedResponse(processedChunks, node.chunkOptions || node.nextOptions);
        } else {
          // Gửi 1 block
          let finalText = personalized;
          if (presuasion) {
            await sendWithDelay(presuasion);
          }
          if (scarcity) {
            await sendWithDelay(scarcity);
          }

          const delay = calculateTypingDelay(finalText);

          // Typo cho answer
          const typoInfo = maybeAddTypo(finalText);
          if (typoInfo) {
            showTyping();
            await sleep(delay);
            hideTyping();
            addBotMessage(typoInfo.typoText);
            await sleep(randomInt(2000, 3500));
            const fix = createTypoFixMessage(typoInfo);
            showTyping();
            await sleep(randomInt(1200, 2000));
            hideTyping();
            addBotMessage(fix);
          }

          // Send main answer
          showTyping();
          await sleep(calculateTypingDelay(finalText));
          hideTyping();
          addBotMessage(finalText, node.nextOptions);
        }

        State.isProcessing = false;
        break;
      }

      case 'input': {
        const text = getVariantText(node, 'question');
        const personalized = personalizeBotMessage(text);
        const delay = calculateTypingDelay(personalized);

        showTyping();
        await sleep(delay);
        hideTyping();

        addBotMessage(personalized, null);
        State.waitingForInput = nodeId;
        State.isProcessing = false;
        break;
      }

      case 'info': {
        const text = getVariantText(node, 'message') || node.message;
        const personalized = personalizeBotMessage(text);
        const delay = calculateTypingDelay(personalized);

        showTyping();
        await sleep(delay);
        hideTyping();

        addBotMessage(personalized, node.nextOptions);
        State.isProcessing = false;
        break;
      }

      default: {
        addBotMessage(
          personalizeBotMessage(node.answer || node.question),
          node.nextOptions || node.options
        );
        State.isProcessing = false;
      }
    }
  }

  // =============== ONE-OFF DELAYED SEND ===============
  async function sendWithDelay(text) {
    const delay = calculateTypingDelay(text);
    showTyping();
    await sleep(delay);
    hideTyping();
    addBotMessage(text);
    // Delay ngắn trước khi gửi tiếp
    await sleep(randomInt(800, 1500));
  }

  // =============== QUICK REPLY HANDLER ===============
  async function handleQuickReply(nextNodeId, buttonText) {
    if (State.isProcessing) return;

    // Log user action
    addUserMessage(buttonText);
    processUserMessage(buttonText);

    State.waitingForInput = null;

    // Special nodes
    if (nextNodeId === 'call') {
      handleCallAction();
      return;
    }
    if (nextNodeId === 'zalo') {
      handleZaloAction();
      return;
    }

    // Có thể thêm location echo nếu user vừa nói địa danh
    if (State.user.lastMentionedLocation && Math.random() < 0.3) {
      const echoTemplates = Script && Script.scriptTemplates && Script.scriptTemplates.locationEcho
        ? Script.scriptTemplates.locationEcho
        : null;
      if (echoTemplates) {
        const echoText = pickRandom(echoTemplates).replace('[location]', State.user.lastMentionedLocation);
        await sendWithDelay(echoText);
        await sleep(randomInt(800, 1500));
      }
    }

    await processNode(nextNodeId);
  }

  // =============== TEXT INPUT HANDLER ===============
  async function handleTextInput(text) {
    if (!text.trim() || State.isProcessing) return;

    addUserMessage(text);
    processUserMessage(text);

    if (State.waitingForInput) {
      const waitingNodeId = State.waitingForInput;
      State.waitingForInput = null;

      const node = getNode(waitingNodeId);
      if (node && node.nextOptions) {
        // Cảm ơn và chuyển hướng
        const thankYou = [
          'Cảm ơn anh/chị! Em đã ghi nhận nha ☁️',
          'Dạ em nhận được thông tin rồi ạ!',
          'Okee, em có thông tin của mình rồi nha ☁️'
        ];
        const thanks = pickRandom(thankYou);

        const delay = calculateTypingDelay(thanks);
        showTyping();
        await sleep(delay);
        hideTyping();
        addBotMessage(thanks, node.nextOptions);
      } else {
        const msg = 'Cảm ơn anh/chị! Mây sẽ hỗ trợ ngay ☁️';
        showTyping();
        await sleep(calculateTypingDelay(msg));
        hideTyping();
        addBotMessage(msg, [{ text: '🏠 Về menu chính', next: 'root' }]);
      }
      State.isProcessing = false;
      return;
    }

    // Normal text routing — try keyword matching
    await routeTextInput(text);
  }

  async function routeTextInput(text) {
    // Xử lý cảm xúc trước
    if (State.lastDetectedEmotion) {
      const emp = getEmpatheticResponse(State.lastDetectedEmotion);
      if (emp) {
        await sendWithDelay(emp);
      }
    }

    // Location echo
    if (State.user.lastMentionedLocation && State.userMessageCount <= 2 && Math.random() < 0.4) {
      const echoTemplates = Script && Script.scriptTemplates && Script.scriptTemplates.locationEcho
        ? Script.scriptTemplates.locationEcho
        : null;
      if (echoTemplates) {
        const echoText = pickRandom(echoTemplates).replace('[location]', State.user.lastMentionedLocation);
        await sendWithDelay(echoText);
        await sleep(randomInt(800, 1200));
      }
    }

    // Name acknowledgment
    if (State.user.name && State.userMessageCount <= 2 && Math.random() < 0.3) {
      const nameTemplates = Script && Script.scriptTemplates && Script.scriptTemplates.nameAcknowledge
        ? Script.scriptTemplates.nameAcknowledge
        : null;
      if (nameTemplates) {
        const nameText = pickRandom(nameTemplates).replace('[name]', State.user.name);
        await sendWithDelay(nameText);
        await sleep(randomInt(800, 1200));
      }
    }

    // Try keyword matching từ root
    const rootNode = getNode('root');
    if (!rootNode || !rootNode.options) {
      await sendWithDelay('☁️ Dạ em chưa hiểu lắm, anh/chị gọi em qua **0378.679.633** để được hỗ trợ nhanh hơn ạ!');
      State.isProcessing = false;
      return;
    }

    const matched = matchKeyword(text, rootNode.options);
    if (matched && matched.next) {
      // Cũng thử matching với các sub-menu
      // Có thể thím là user nói trực tiếp tên sản phẩm
      await processNode(matched.next);
    } else {
      // Deep search trong tất cả options con
      const deepMatch = deepKeywordSearch(text, Script.nodes);
      if (deepMatch) {
        await processNode(deepMatch);
      } else {
        // Fallback
        const fallbackNode = getNode('fallback');
        if (fallbackNode) {
          const fbText = getVariantText(fallbackNode, 'answer') || fallbackNode.answer;
          showTyping();
          await sleep(calculateTypingDelay(fbText));
          hideTyping();
          addBotMessage(fbText, fallbackNode.nextOptions);
        } else {
          showDefaultFallback();
        }
        State.isProcessing = false;
      }
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

    for (const opt of options) {
      if (opt.text && lower.includes(opt.text.toLowerCase().substring(0, 10))) {
        return opt;
      }
    }

    return null;
  }

  function deepKeywordSearch(text, nodes) {
    if (!nodes) return null;
    const lower = text.toLowerCase();

    // Duyệt tất cả node, tìm kiếm keywords
    for (const [id, node] of Object.entries(nodes)) {
      if (id === 'fallback' || id === 'root') continue;
      if (node.options) {
        for (const opt of node.options) {
          if (opt.keywords) {
            for (const kw of opt.keywords) {
              if (lower.includes(kw.toLowerCase())) {
                return opt.next;
              }
            }
          }
        }
      }
    }
    return null;
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

  // =============== DISCLAIMER ===============
  function showDisclaimer() {
    if (State.disclaimerShown) return;
    State.disclaimerShown = true;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'thm-message thm-bot thm-disclaimer';

    const avatar = document.createElement('div');
    avatar.className = 'thm-msg-avatar';
    avatar.textContent = 'ℹ️';

    const content = document.createElement('div');
    content.className = 'thm-msg-content';
    content.innerHTML = '<p style="font-size:12px; opacity:0.8;">☁️ Mây là trợ lý ảo của Trần Hữu Minh — em sẽ tư vấn nhiệt tình cho anh/chị ạ!</p>';

    const time = document.createElement('div');
    time.className = 'thm-msg-time';
    time.textContent = formatTime();

    content.appendChild(time);
    msgDiv.appendChild(avatar);
    msgDiv.appendChild(content);

    DOM.messages.appendChild(msgDiv);
  }

  // =============== WELCOME FLOW ===============
  async function startChat() {
    DOM.messages.innerHTML = '';

    // Show disclaimer trước
    showDisclaimer();

    // Welcome message
    const welcomeTexts = Script && Script.scriptTemplates && Script.scriptTemplates.welcome
      ? Script.scriptTemplates.welcome
      : ['☁️ Chào anh/chị! Em là Mây — trợ lý tư vấn của VLXD Trần Hữu Minh. Anh/chị cần tìm hiểu về sản phẩm gì ạ?'];

    // Chọn welcome ngẫu nhiên
    const welcome = pickRandom(welcomeTexts);

    // Delay nhẹ rồi bắt đầu
    await sleep(CONFIG.welcomeDelay);

    // Bắt đầu bằng cách "echo" nhẹ
    await processNode('root');
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
    if (document.querySelector('.thm-chat-widget')) return;

    const container = document.createElement('div');
    container.className = 'thm-chat-widget';
    container.id = 'thmChatWidget';

    // Header
    const header = document.createElement('div');
    header.className = 'thm-chat-header';
    header.innerHTML = `
      <div class="thm-avatar">☁️</div>
      <div class="thm-header-info">
        <div class="thm-header-name">${CONFIG.agentName} - ${CONFIG.storeName}</div>
        <div class="thm-header-status">
          <span class="thm-status-dot"></span>
          Online • Thường trả lời trong 1 phút
        </div>
      </div>
      <button class="thm-header-close" aria-label="Đóng chat">✕</button>
    `;

    // Messages
    const messages = document.createElement('div');
    messages.className = 'thm-chat-messages';

    // Typing indicator (cải tiến — 3 dấu chấm nhấp nháy)
    const typing = document.createElement('div');
    typing.className = 'thm-typing-indicator';
    typing.innerHTML = `
      <div class="thm-msg-avatar">☁️</div>
      <div class="thm-typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;

    messages.appendChild(typing);

    // Action Bar
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

    // Input
    const inputArea = document.createElement('div');
    inputArea.className = 'thm-chat-input';
    inputArea.innerHTML = `
      <input type="text" placeholder="Nhập tin nhắn..." autocomplete="off">
      <button class="thm-send-btn" aria-label="Gửi">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    `;

    container.appendChild(header);
    container.appendChild(messages);
    container.appendChild(actionBar);
    container.appendChild(inputArea);

    document.body.appendChild(container);

    // Launcher
    const launcher = document.createElement('button');
    launcher.className = 'thm-chat-launcher';
    launcher.setAttribute('aria-label', 'Mở chat với Mây');
    launcher.innerHTML = `
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>
      <span class="thm-launcher-badge" style="display:none;">1</span>
    `;

    document.body.appendChild(launcher);

    // Store refs
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
    DOM.launcher.addEventListener('click', function () {
      toggleWidget(true);
    });

    DOM.closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleWidget(false);
    });

    DOM.sendBtn.addEventListener('click', function () {
      sendMessage();
    });

    DOM.input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    document.addEventListener('click', function (e) {
      if (DOM.widget.classList.contains('thm-open')) {
        const isClickInside = DOM.widget.contains(e.target) || DOM.launcher.contains(e.target);
        if (!isClickInside) {
          toggleWidget(false);
        }
      }
    });

    // Touch events for mobile
    DOM.input.addEventListener('focus', function () {
      // Scroll xuống khi bàn phím hiện
      setTimeout(scrollToBottom, 300);
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
    buildWidget();

    const loaded = await loadScript();
    if (!loaded) {
      // Minimal fallback tree
      Script = {
        nodes: {
          root: {
            id: 'root',
            type: 'question',
            question: '☁️ Chào anh/chị! Em là Mây — trợ lý tư vấn của VLXD Trần Hữu Minh. Anh/chị cần tìm hiểu về sản phẩm gì ạ?',
            options: [
              { text: '🛡️ Chống thấm', next: 'ct', keywords: ['chống thấm'] },
              { text: '🎨 Sơn nước', next: 'sn', keywords: ['sơn nước'] },
              { text: '📄 Báo giá', next: 'bg', keywords: ['báo giá'] }
            ]
          },
          ct: {
            id: 'ct', type: 'answer',
            answer: 'Bên em có Munich G20, Sika, Kova CT. Anh/chị chống thấm cho khu vực nào?',
            nextOptions: [{ text: '🏠 Về menu', next: 'root' }]
          },
          sn: {
            id: 'sn', type: 'answer',
            answer: 'Sơn nước có Munich, Dulux, Jotun — nội thất & ngoại thất. Anh/chị cần dòng nào?',
            nextOptions: [{ text: '🏠 Về menu', next: 'root' }]
          },
          bg: {
            id: 'bg', type: 'answer',
            answer: 'Gọi 0378.679.633 hoặc để lại SĐT em báo giá.',
            nextOptions: [{ text: '🏠 Về menu', next: 'root' }]
          }
        },
        fallback: {
          id: 'fallback', type: 'answer',
          answer: 'Mây chưa hiểu, anh/chị chọn giúp em nhé!',
          nextOptions: [{ text: '🏠 Về menu', next: 'root' }]
        }
      };
    }

    bindEvents();

    setTimeout(() => {
      DOM.launcher.style.display = 'flex';
    }, CONFIG.launcherDelay);

    console.log('[Mây v2] Chatbot "người thật" ready ☁️');
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
      State.user = { name: '', phone: '', address: '', location: '', gender: 'unknown', ageGroup: 'unknown' };
      DOM.messages.innerHTML = '';
      DOM.messages.appendChild(DOM.typingIndicator);
      State.disclaimerShown = false;
      startChat();
    },
    setUser: function (info) {
      if (info.name) State.user.name = info.name;
      if (info.phone) State.user.phone = info.phone;
      if (info.location) State.user.location = info.location;
    },
    version: '2.0.0-human-like'
  };

})();
