/* APP - TRẦN HỮU MINH WEBSITE */

document.addEventListener('DOMContentLoaded', () => {
  // Render brand overview on home
  const grid = document.getElementById('brandGrid');
  BRANDS.forEach(b => {
    const card = document.createElement('div');
    card.className = 'brand-card';
    card.onclick = () => showBrand(b.id);
    card.innerHTML = `<div class="bi">${b.icon}</div>
      <h4 style="color:${b.color}">${b.name}</h4>
      <p style="font-size:12px;color:#777">${b.desc.split(' - ')[0]}</p>
      <span class="cnt">${b.count} sản phẩm</span>`;
    grid.appendChild(card);
  });

  // Render all brands
  BRANDS.forEach(b => renderBrand(b.id));

  // Navigation — close mobile nav on click
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.getAttribute('href').substring(1);
      if (a.dataset.brand) { showBrand(a.dataset.brand); return; }
      showSection(id);
      document.querySelectorAll('.nav-list a').forEach(n => n.classList.remove('active'));
      a.classList.add('active');
      // Close mobile nav if open
      const navList = document.getElementById('navList');
      if (navList.classList.contains('open')) toggleNav();
    });
  });

  showSection('home');
});

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active-section'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active-section');
  window.scrollTo({top:0,behavior:'smooth'});
}

function showBrand(id) {
  showSection(id + '-section');
}

function renderBrand(id) {
  const sec = document.getElementById(id + '-section');
  if (!sec) return;
  const container = sec.querySelector('.brand-content');
  const data = PRODUCTS[id];
  if (!data) return;
  
  let html = '';
  
  if (Array.isArray(data)) {
    // Simple list
    html += '<div class="cat-products active">';
    data.forEach(p => html += card(p, id));
    html += '</div>';
  } else {
    const cats = Object.keys(data);
    // Kiểm tra nếu là cây 3 cấp (value là object có con là array)
    const isTree = cats.length > 0 && typeof data[cats[0]] === 'object' && !Array.isArray(data[cats[0]]);
    
    if (isTree) {
      // 3 cấp: Brand → Group → Subgroup → Products
      html += '<div class="cat-tabs">';
      cats.forEach((c, i) => {
        html += `<span class="cat-tab ${i===0?'active':''}" onclick="switchCat(this,'${id}',${i})">${c}</span>`;
      });
      html += '</div>';
      cats.forEach((c, i) => {
        const subgroups = Object.keys(data[c]);
        html += `<div class="cat-products ${i===0?'active':''}" data-cat="${i}">`;
        // Sub-tabs
        html += '<div class="sub-tabs">';
        subgroups.forEach((sg, si) => {
          html += `<span class="sub-tab ${si===0?'active':''}" onclick="switchSubCat(this,'${id}',${i},${si})">${sg}</span>`;
        });
        html += '</div>';
        // Sub-product lists
        subgroups.forEach((sg, si) => {
          html += `<div class="sub-products ${si===0?'active':''}" data-subcat="${si}">`;
          data[c][sg].forEach(p => html += card(p, id));
          html += '</div>';
        });
        html += '</div>';
      });
    } else {
      // 2 cấp: Brand → Category → Products
      html += '<div class="cat-tabs">';
      cats.forEach((c, i) => {
        html += `<span class="cat-tab ${i===0?'active':''}" onclick="switchCat(this,'${id}',${i})">${c}</span>`;
      });
      html += '</div>';
      cats.forEach((c, i) => {
        html += `<div class="cat-products ${i===0?'active':''}" data-cat="${i}">`;
        data[c].forEach(p => html += card(p, id));
        html += '</div>';
      });
    }
  }
  
  container.innerHTML = html;
}

// Lightbox
function openLightbox(src) {
  let lb = document.getElementById('lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox';
    lb.innerHTML = '<span class="lb-close" onclick="closeLightbox()">&times;</span><img id="lbImg">';
    lb.addEventListener('click', closeLightbox);
    document.body.appendChild(lb);
  }
  document.getElementById('lbImg').src = src;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('active');
  document.body.style.overflow = '';
}

function card(p, brand) {
  const pr = getPrice(brand, p.code);
  const priceHTML = pr && pr.price !== 'Liên hệ'
    ? `<div class="prod-price"><span class="price-val">${pr.price}</span> / ${pr.spec}</div>`
    : `<div class="prod-price"><span class="price-contact">📞 Liên hệ: 0378.679.633</span></div>`;
  
  const contactBtns = `<div class="prod-actions">
    <a href="#" onclick="if(window.THM_Chat){THM_Chat.navigate('bao-gia');THM_Chat.open();}return false;" class="pa-btn pa-quote" title="Báo Giá">📋 Báo Giá</a>
    <a href="tel:0378679633" class="pa-btn pa-call" title="Hotline">📞 Hotline (MR HỮU)</a>
  </div>`;

  return `<div class="prod-card">
    <div class="prod-body">
      <span class="tag tag-${brand}">${p.code}</span>
      <h4>${p.name}</h4>
      <div class="code">📦 ${p.spec}</div>
      <div class="desc">${p.desc}</div>
      <div class="meta">📐 Định mức: ${p.dm}</div>
      ${priceHTML}
      ${contactBtns}
    </div>
  </div>`;
}

function switchCat(el, brandId, idx) {
  const sec = document.getElementById(brandId + '-section');
  if (!sec) return;
  sec.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  sec.querySelectorAll('.cat-products').forEach(c => c.classList.remove('active'));
  const target = sec.querySelector(`.cat-products[data-cat="${idx}"]`);
  if (target) target.classList.add('active');
}

function switchSubCat(el, brandId, catIdx, subIdx) {
  const sec = document.getElementById(brandId + '-section');
  if (!sec) return;
  const parent = sec.querySelector(`.cat-products[data-cat="${catIdx}"]`);
  if (!parent) return;
  parent.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  parent.querySelectorAll('.sub-products').forEach(c => c.classList.remove('active'));
  const target = parent.querySelector(`.sub-products[data-subcat="${subIdx}"]`);
  if (target) target.classList.add('active');
}

function renderPrices() {
  const tbl = document.getElementById('priceTable');
  let html = '<table><thead><tr><th>STT</th><th>Hãng</th><th>Sản phẩm</th><th>Quy cách</th><th>Giá tham khảo</th></tr></thead><tbody>';
  PRICES.forEach((p, i) => {
    html += `<tr><td>${i+1}</td><td><strong>${p.brand}</strong></td><td>${p.product}</td><td>${p.spec}</td><td><strong>${p.price}</strong></td></tr>`;
  });
  html += '</tbody></table>';
  tbl.innerHTML = html;
}

function searchProd(q) {
  if (!q || q.length < 1) {
    // Clear search when input empty
    const grid = document.getElementById('searchGrid');
    if (grid) grid.innerHTML = '';
    return;
  }
  q = q.toLowerCase();
  const results = [];
  for (const b of BRANDS) {
    const data = PRODUCTS[b.id];
    if (Array.isArray(data)) {
      data.forEach(p => { if (match(p,q)) results.push({...p,bid:b.id,bname:b.name}); });
    } else {
      for (const cat in data) {
        data[cat].forEach(p => { if (match(p,q)) results.push({...p,bid:b.id,bname:b.name,cat}); });
      }
    }
  }
  
  const grid = document.getElementById('searchGrid');
  const title = document.getElementById('searchTitle');
  
  if (!results.length) {
    title.textContent = `🔍 Không tìm thấy "${q}"`;
    grid.innerHTML = '<p style="text-align:center;padding:40px;color:#999">😕 Không có sản phẩm phù hợp. Thử từ khóa khác hoặc <a href="#quote" style="color:var(--accent);font-weight:600">gửi yêu cầu báo giá</a>.</p>';
  } else {
    title.textContent = `🔍 Kết quả tìm: "${q}" (${results.length} SP)`;
    grid.innerHTML = results.map(p => {
      const tag = `<span class="tag tag-${p.bid}">${p.bname} - ${p.code}</span>`;
      return `<div class="prod-card"><div class="prod-body">${tag}
        <h4>${p.name}</h4><div class="code">📦 ${p.spec}</div>
        <div class="desc">${p.desc}</div><div class="meta">📐 ${p.dm}</div></div></div>`;
    }).join('');
  }
  showSection('search-section');
}

function match(p, q) {
  return p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
}

// Mobile nav toggle
function toggleNav() {
  const list = document.getElementById('navList');
  list.classList.toggle('open');
}

/* ===== SCROLL-TO-TOP BUTTON ===== */
(function initScrollTop() {
  const btn = document.createElement('button');
  btn.className = 'scroll-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Lên đầu trang');
  btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(btn);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.classList.toggle('show', window.scrollY > 300);
        ticking = false;
      });
      ticking = true;
    }
  });
})();

/* ===== FADE-IN ON SCROLL (IntersectionObserver) ===== */
(function initFadeIn() {
  // Add fade-in classes to sections and cards dynamically
  const sectionEls = document.querySelectorAll('.section, .features, .brand-grid, .project-grid, .news-grid, .svc-grid, .contact-grid');
  sectionEls.forEach(el => {
    el.classList.add('fade-in');
    // Also add staggered animation to direct children
    Array.from(el.children).forEach((child, i) => {
      if (child.classList.contains('section-title') || child.classList.contains('note') || child.tagName === 'P') return;
      if (!child.classList.contains('fade-in') && !child.classList.contains('fade-in-left') && !child.classList.contains('fade-in-right') && !child.classList.contains('fade-in-scale')) {
        child.style.transitionDelay = `${Math.min(i * 0.08, 0.5)}s`;
        child.classList.add('fade-in');
      }
    });
  });

  // Also add to specific elements
  document.querySelectorAll('.feat-card, .brand-card, .prod-card, .contact-card, .project-card').forEach(el => {
    el.classList.add('fade-in');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale').forEach(el => {
    observer.observe(el);
  });
})();
