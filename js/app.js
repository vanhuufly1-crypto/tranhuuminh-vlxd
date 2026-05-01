/* TRẦN HỮU MINH — APP */
document.addEventListener('DOMContentLoaded', () => {

  // Render Brand Overview on Home
  const overview = document.getElementById('brandOverview');
  BRAND_INFO.forEach(b => {
    const card = document.createElement('div');
    card.className = 'brand-card';
    card.onclick = () => showBrand(b.id);
    card.innerHTML = `<div class="bicon">${b.icon}</div>
      <h4 style="color:${b.color}">${b.name}</h4>
      <p>${b.desc}</p>
      <span class="bcount">${b.count} SP</span>`;
    overview.appendChild(card);
  });

  // Render all brand sections
  BRAND_INFO.forEach(b => renderBrand(b.id));

  // Render price table
  renderPrices();

  // Navigation
  document.querySelectorAll('.nav a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = a.getAttribute('href').substring(1);
      
      // Check if it's a brand link
      if (a.classList.contains('brand-link')) {
        showBrand(a.dataset.brand);
        return;
      }
      
      // Hide all sections, show target
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active-section'));
      document.getElementById(target)?.classList.add('active-section');
      
      // Update nav active
      document.querySelectorAll('.nav a').forEach(n => n.classList.remove('active'));
      a.classList.add('active');
    });
  });

  // Show home by default
  document.getElementById('home').classList.add('active-section');
});

function showBrand(brandId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active-section'));
  const section = document.getElementById(`${brandId}-section`);
  if (section) section.classList.add('active-section');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderBrand(brandId) {
  const grid = document.getElementById(`${brandId}-products`);
  if (!grid) return;
  
  const products = PRODUCTS[brandId] || [];
  grid.innerHTML = '';
  
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-body">
        <span class="tag tag-${brandId}">${p.code}</span>
        <h4>${p.name}</h4>
        <div class="code">📦 ${p.spec}</div>
        <div class="desc">${p.desc}</div>
        <div class="meta">
          <span>📐 Định mức: ${p.dm}</span>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function renderPrices() {
  const container = document.getElementById('priceTable');
  if (!container) return;
  
  let html = '<table><thead><tr><th>STT</th><th>Hãng</th><th>Sản phẩm</th><th>Quy cách</th><th>Giá tham khảo</th></tr></thead><tbody>';
  
  PRICES.forEach((p, i) => {
    html += `<tr>
      <td>${i + 1}</td>
      <td><strong>${p.brand}</strong></td>
      <td>${p.product}</td>
      <td>${p.spec}</td>
      <td><strong>${p.price}</strong></td>
    </tr>`;
  });
  
  html += '</tbody></table>';
  container.innerHTML = html;
}

function searchProduct(query) {
  if (!query || query.length < 2) return;
  query = query.toLowerCase();
  
  const results = [];
  BRAND_INFO.forEach(b => {
    (PRODUCTS[b.id] || []).forEach(p => {
      if (p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query)) {
        results.push({ ...p, brand: b.id, brandName: b.name });
      }
    });
  });
  
  if (results.length === 0) return;
  
  // Show in product section
  const grid = document.getElementById('productGrid');
  const title = document.getElementById('productTitle');
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active-section'));
  document.getElementById('product-section').classList.add('active-section');
  
  title.textContent = `🔍 Kết quả: "${query}" (${results.length} SP)`;
  grid.innerHTML = '';
  
  results.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-body">
        <span class="tag tag-${p.brand}">${p.brandName} - ${p.code}</span>
        <h4>${p.name}</h4>
        <div class="code">📦 ${p.spec}</div>
        <div class="desc">${p.desc}</div>
        <div class="meta">
          <span>📐 Định mức: ${p.dm}</span>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}
