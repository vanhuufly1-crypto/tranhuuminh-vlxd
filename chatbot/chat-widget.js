/* Chat widget VLHT - Đã fix */
(function() {
  console.log('☁️ Chat widget loaded');
  
  // Chỉ thêm nút chat nhỏ
  const btn = document.createElement('button');
  btn.innerHTML = '☁️';
  btn.style.cssText = 'position:fixed;bottom:20px;right:20px;width:56px;height:56px;border-radius:50%;border:none;background:linear-gradient(135deg,#0fb9b1,#0984e3);color:white;font-size:28px;cursor:pointer;z-index:9999;box-shadow:0 4px 15px rgba(0,0,0,0.3);';
  btn.onclick = () => window.open('https://zalo.me/0378679633', '_blank');
  document.body.appendChild(btn);
})();
