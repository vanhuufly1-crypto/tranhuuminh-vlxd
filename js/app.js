/* APP - TRẦN HỮU MINH WEBSITE */

// Product images list - CHỈ TỪ USB VLHT
const PROD_IMAGES = [
  // Kova (32)
  'kova_bn-1699232156',
  'kova_bt-1699231775',
  'kova_cn05-1658475473',
  'kova_ct-14-v-1658475387',
  'kova_ct04t-mt-1710492182',
  'kova_ct08-v-1658471994',
  'kova_ct08-v-1658472017',
  'kova_ct11a-mt-1710492043',
  'kova_ct11bmt-1732503757',
  'kova_k-1025kg-1694074913',
  'kova_k109-1694074693',
  'kova_k180-v-1658473768',
  'kova_k209-v-1658472483',
  'kova_k260-v-1658473602',
  'kova_k261-1654583954',
  'kova_k280-1639720515',
  'kova_k280-1639720668',
  'kova_k360-mt-1701836928',
  'kova_k5500mt-1708937363',
  'kova_k5501-v-1658472808',
  'kova_k5800-mt-1658068718',
  'kova_k77125kg-1694075325',
  'kova_k871mt-1709520533',
  'kova_kl5t-aqua-v-1658463129',
  'kova_kl5t-v-1658471824',
  'kova_kl5tbb-v-1658463892',
  'kova_mb-t300923-1694060672',
  'kova_mt-kl5t-aqua-v-1678765368',
  'kova_mtn-v-1658471648',
  'kova_mtt-v-1658473852',
  'kova_nt26-1kg-1710492254',
  'kova_z6669805729346_420fc41fbc0cea2cbb521e3002f5eabb',
  // Nano House (17)
  'nano_a1',
  'nano_IMG_1623337789048_1623337954888-300x300',
  'nano_IMG_1623337789048_1623337954888-300x300_1',
  'nano_IMG_1623337789150_1623337954972-300x300',
  'nano_IMG_1623337789358_1623337954932-1-300x300',
  'nano_IMG_1623337789479_1623337954569-300x300',
  'nano_IMG_1623337789570_1623337955073-300x300',
  'nano_IMG_1623337789678_1623337954507-300x300',
  'nano_IMG_1623337789778_1623337954639-300x300',
  'nano_IMG_1623337789879_1623337954683-300x300',
  'nano_IMG_1623337789979_1623337954742-300x300',
  'nano_IMG_1623337790189_1623337954806-1-300x300',
  'nano_IMG_1623337790398_1623337955032-300x300',
  'nano_IMG_1623337790500_1623337954849-300x300',
  'nano_IMG_1623337790500_1623337954849-300x300_1',
  'nano_IMG_1623337790600_1623337955112-300x300',
  'nano_IMG_20210721_112021-300x300',
  // Munich (1)
  'munich_z6669805737655_e0331211320f6d0f2f99d9f6cf995495',
  // Jotun (1)
  'jotun_z6669805735502_f29cf55851d62b8728fdd1683d311afb',
  // Dulux (1)
  'dulux_z6669805730688_c375ad9ba90c3d57d166aa6f66640b7b',
  // Sika (1)
  'sika_a2',
];

// Assign images to brands
function getBrandImages(brandId) {
  const map = {
    kova:    [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
    nano:    [32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48],
    munich:  [49],
    jotun:   [50],
    dulux:   [51],
    sika:    [52],
    nippon:  [],
  };
  return (map[brandId] || []).map(i => PROD_IMAGES[i]).filter(Boolean);
}

// Image error fallback
function handleImgError(img) {
  img.onerror = null;
  img.style.display = 'none';
}

// Ảnh đại diện cho từng thương hiệu (từ USB)
const BRAND_IMG = {
  kova: 'images/kova_bn-1699232156.webp',
  nano: 'images/nano_IMG_1623337789048_1623337954888-300x300.webp',
  munich: 'images/munich_z6669805737655_e0331211320f6d0f2f99d9f6cf995495.webp',
  jotun: 'images/jotun_z6669805735502_f29cf55851d62b8728fdd1683d311afb.webp',
  dulux: 'images/dulux_z6669805730688_c375ad9ba90c3d57d166aa6f66640b7b.webp',
  sika: 'images/sika_a2.webp',
  nippon: '',
};

document.addEventListener('DOMContentLoaded', () => {
  // Attach onerror to all product/gallery images
  document.querySelectorAll('.gallery-item img, .brand-gallery img, .pc-img img').forEach(img => {
    img.addEventListener('error', () => handleImgError(img));
  });

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
  
  // Add product gallery
  const imgList = getBrandImages(id);
  if (imgList.length > 0) {
    html += '<div class="brand-gallery">';
    imgList.forEach(img => {
      html += `<div class="gallery-item">
        <img src="images/${img}.webp" alt="${id}" loading="lazy" onerror="this.style.display='none'" onclick="openLightbox(this.src)">
      </div>`;
    });
    html += '</div>';
  }
  
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

  const imgSrc = BRAND_IMG[brand] || '';
  const imgHTML = imgSrc ? `<div class="prod-img"><img src="${imgSrc}" alt="${p.name}" loading="lazy" onerror="this.parentElement.style.display='none'"></div>` : '';

  return `<div class="prod-card">
    ${imgHTML}
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

// Download price as TXT file
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
  document.querySelectorAll('.feat-card, .brand-card, .prod-card, .svc-card, .contact-card, .project-card, .news-card, .gallery-item').forEach(el => {
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

