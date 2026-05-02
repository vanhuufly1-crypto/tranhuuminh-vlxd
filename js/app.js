/* APP - TRẦN HỮU MINH WEBSITE */

// Product images list (from raw folder)
const PROD_IMAGES = [
  // Local product images (20) - from Telegram download
  '004065fd-3a92-43f1-be1b-ce9ad35e8cb0-330x330',
  '1-330x330',
  '2-330x330',
  '20c918a9-b075-40c6-9101-b756cb15590c',
  '92f2ba39-5c98-4e84-b6c4-ddae4b62af01-330x330',
  'a1','a2',
  'a7e1af5b-decc-4271-8358-49b17d76eb6c-330x329',
  'c0c5f24e-a373-4d9c-92b8-871911cf3137-330x330',
  'd6f132a1-629a-4aaa-b437-90f6e1fe09dd-330x200',
  'f1558a2d-8931-4c18-9f7e-e39a3d0b9368',
  'z6669805729346_420fc41fbc0cea2cbb521e3002f5eabb',
  'z6669805730688_c375ad9ba90c3d57d166aa6f66640b7b',
  'z6669805735502_f29cf55851d62b8728fdd1683d311afb',
  'z6669805737655_e0331211320f6d0f2f99d9f6cf995495',
  'z6670079584865_f3d561825c58619858db0111407a4416-330x330',
  'z6670723840868_53b895036d3852716ab2d86114705376',
  'z6670723842307_6d614766caad7dcacda8f953a42b6319-330x330',
  'z6670738880364_50d036ad1c3094e9fac16755db91eebf-330x330',
  // Munich product images from manufacturer website
  'munich_munich-g20',
  'munich_munich-g20c',
  'munich_munich-pu-s700-1',
  'munich_son-bong-noi-that-munich-luxury',
  'munich_g20',
  'munich_g20n',
  // Jotun product images from manufacturer website
  'brand_majestic-dep-hoan-hao-mo',
  'brand_son_chongtham-jotun_waterguard-lon-6kg',
  'brand_son_jotun_essence-che-phu-toi-da-bong',
  'brand_anh-ngang-gan-logo',
  // New product images from brand websites
  'kova_ct11a',
  'kova_k871gold',
  'nippon_weatherbond',
  'sika_sikaflex11fc',
  'sika_sikagrout214',
  'sika_sikalastic1k',
  'sika_sikalatex',
  'sika_top107',
  // New product images added May 2026
  'nippon_matex',
  'nippon_weathergard',
  'nippon_supertech',
  // Dulux images from competitor websites
  'dulux_weathershield',
  'dulux_inspire',
  'dulux_5in1',
  'dulux_ambiance',
  // Jotun additional images
  'jotun_jotashield',
  'jotun_majestic',
  'jotun_waterguard',
  // Kova additional images
  'kova_ct04t',
  'kova_ct14',
];

// Assign images to brands
function getBrandImages(brandId) {
  const map = {
    munich:  [0,1,9, 19,20,21,22,23,24],
    nano:    [4],
    sika:    [3,10, 32,33,34,35,36],
    dulux:   [11, 40,41,42,43],           // let's colour + Weathershield, Inspire, 5in1, Ambiance
    jotun:   [12, 25,26,27,28, 44,45,46], // Jotun + Jotashield, Majestic, Waterguard
    kova:    [3,8, 29,30, 47,48],         // Kova + CT11A, K871, CT04T, CT14
    nippon:  [8,10, 31, 37,38,39],        // Nippon + Weatherbond, Matex, Weathergard, SuperTech
  };
  return (map[brandId] || []).map(i => PROD_IMAGES[i]);
}

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
  renderPrices();

  // Navigation
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.getAttribute('href').substring(1);
      if (a.dataset.brand) { showBrand(a.dataset.brand); return; }
      showSection(id);
      document.querySelectorAll('.nav-list a').forEach(n => n.classList.remove('active'));
      a.classList.add('active');
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
  const container = sec.querySelector('.brand-content');
  const data = PRODUCTS[id];
  
  let html = '';
  
  // Add product gallery
  const imgList = getBrandImages(id);
  if (imgList.length > 0) {
    html += '<div class="brand-gallery">';
    imgList.forEach(img => {
      html += `<div class="gallery-item">
        <img src="images/${img}.webp" alt="${id}" loading="lazy" onclick="openLightbox(this.src)">
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
    // Categories with tabs
    const cats = Object.keys(data);
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
    <a href="tel:0378679633" class="pa-btn pa-call" title="Gọi ngay">📞 Gọi</a>
    <a href="https://zalo.me/0378679633" target="_blank" class="pa-btn pa-zalo" title="Chat Zalo">💬 Zalo</a>
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
  sec.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  sec.querySelectorAll('.cat-products').forEach(c => c.classList.remove('active'));
  sec.querySelector(`.cat-products[data-cat="${idx}"]`).classList.add('active');
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
  if (!q || q.length < 2) return;
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
  if (!results.length) return;
  
  document.getElementById('searchTitle').textContent = `🔍 Kết quả tìm: "${q}" (${results.length} SP)`;
  const grid = document.getElementById('searchGrid');
  grid.innerHTML = results.map(p => {
    const tag = `<span class="tag tag-${p.bid}">${p.bname} - ${p.code}</span>`;
    return `<div class="prod-card"><div class="prod-body">${tag}
      <h4>${p.name}</h4><div class="code">📦 ${p.spec}</div>
      <div class="desc">${p.desc}</div><div class="meta">📐 ${p.dm}</div></div></div>`;
  }).join('');
  showSection('search-section');
}

function match(p, q) {
  return p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
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

function downloadPricePDF() {
  const lines = [];
  lines.push('=== BẢNG GIÁ THAM KHẢO - TRẦN HỮU MINH ===');
  lines.push('CÔNG TY TNHH XD & TM TRẦN HỮU MINH');
  lines.push('Điện thoại: 0378.679.633 - Zalo: 0378.679.633');
  lines.push('Địa chỉ: 1434 Phạm Văn Đồng, Nam Đồ Sơn, Hải Phòng');
  lines.push('');
  lines.push('Giá cập nhật tháng 05/2026');
  lines.push('* Giá có thể thay đổi theo thị trường. Liên hệ để có giá tốt nhất.');
  lines.push('');
  lines.push('='.repeat(60));
  lines.push('');
  
  // Group by brand
  const byBrand = {};
  PRICES.forEach(p => {
    if (!byBrand[p.brand]) byBrand[p.brand] = [];
    byBrand[p.brand].push(p);
  });
  
  Object.keys(byBrand).forEach(brand => {
    lines.push(`── ${brand.toUpperCase()} ──`);
    lines.push('');
    byBrand[brand].forEach(p => {
      lines.push(`  ${p.product}`);
      lines.push(`    Quy cách: ${p.spec}`);
      lines.push(`    Giá: ${p.price}`);
      lines.push('');
    });
    lines.push('');
  });
  
  lines.push('='.repeat(60));
  lines.push('Liên hệ: 0378.679.633 - Zalo: 0378.679.633');
  lines.push('Email: vanhuufly@gmail.com');
  lines.push('Website: https://vanhuufly1-crypto.github.io/tranhuuminh-vlxd/');
  
  const content = lines.join('\r\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bang-gia-tran-huu-minh-05-2026.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
