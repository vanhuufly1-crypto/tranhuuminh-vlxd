# TÀI LIỆU HƯỚNG DẪN QUẢN TRỊ WEBSITE
## CÔNG TY TNHH XD & TM TRẦN HỮU MINH (VLHT)

---

**Mã số thuế:** 0201961941
**Địa chỉ:** 1434 Phạm Văn Đồng, Nam Đồ Sơn, Hải Phòng
**Hotline:** 0378.679.633
**Zalo:** 0378.679.633
**Email:** vanhuufly@gmail.com
**Website:** https://vanhuufly1-crypto.github.io/tranhuuminh-vlxd/

---

## MỤC LỤC

- **Phần 1:** Giới thiệu về cấu trúc website
- **Phần 2:** Hướng dẫn cập nhật sản phẩm
- **Phần 3:** Hướng dẫn thêm ảnh sản phẩm
- **Phần 4:** Hướng dẫn thay đổi thông tin liên hệ
- **Phần 5:** Hướng dẫn thay đổi logo & banner
- **Phần 6:** Hướng dẫn thay đổi menu
- **Phần 7:** Hướng dẫn cập nhật bảng giá
- **Phần 8:** Hướng dẫn thêm bài viết / tin tức
- **Phần 9:** Hướng dẫn thêm/sửa danh mục sản phẩm
- **Phần 10:** Hướng dẫn đẩy code lên GitHub (cập nhật web)

---

## Phần 1: Giới thiệu về cấu trúc website

Website VLHT là website **tĩnh (static site)**, được lưu trữ miễn phí trên **GitHub Pages**.

### Cấu trúc thư mục:
```
tranhuuminh-vlxd/
├── index.html          ← Trang chính (sửa để thay nội dung)
├── css/
│   └── style.css       ← Định dạng giao diện (màu sắc, bố cục)
├── js/
│   ├── products.js     ← Dữ liệu sản phẩm & bảng giá
│   ├── app.js          ← Code chạy website
│   └── chat.js         ← Chat bot Mây AI
├── images/             ← Thư mục chứa ảnh (định dạng .webp)
├── docs/               ← Tài liệu công ty
└── video-hoathinh/     ← Video hoạt hình quảng cáo
```

### Các phần trên website:
- **Đầu trang (Header):** Logo + tên công ty + thanh tìm kiếm
- **Menu:** Trang chủ, Sản phẩm, Bảng giá, Báo giá, Liên hệ...
- **Thân trang:** Nội dung chính (sản phẩm, thương hiệu, dự án...)
- **Chân trang (Footer):** Thông tin liên hệ, bản đồ

> ⚠️ **Khác với web CMS thông thường:** Web VLHT không có trang quản trị đăng nhập. Để cập nhật nội dung, bạn cần sửa trực tiếp các file và đẩy lên GitHub.

---

## Phần 2: Hướng dẫn cập nhật sản phẩm

Tất cả dữ liệu sản phẩm nằm trong file **`js/products.js`**.

### Cấu trúc dữ liệu sản phẩm:
Mỗi sản phẩm có định dạng:
```javascript
{ code:'MÃ_SP', name:'Tên sản phẩm', spec:'Quy cách', desc:'Mô tả', dm:'Định mức' }
```

### Ví dụ thêm sản phẩm mới:
```javascript
nano: {
    "Sơn phủ nội thất": [
      { code:'NO1', name:'SUPER INTERIOR - Sơn siêu bóng nội thất thượng hạng', 
        spec:'15L / 5L / 1L', 
        desc:'Bóng ngọc trai, bền màu gấp 3 lần, lau chùi hiệu quả.', 
        dm:'Theo hướng dẫn nhà sản xuất' },
    ],
}
```

### Cách thêm:
1. Mở **`js/products.js`**
2. Tìm đến thương hiệu muốn thêm (ví dụ: `nano: {`, `munich: {`, `sika: [`...)
3. Thêm sản phẩm mới vào danh sách
4. Lưu file và đẩy lên GitHub (xem Phần 10)

> 💡 Mẹo: Sao chép 1 sản phẩm có sẵn rồi sửa thông tin cho nhanh!

---

## Phần 3: Hướng dẫn thêm ảnh sản phẩm

### Yêu cầu ảnh:
- **Định dạng:** .webp (tối ưu cho web)
- **Kích thước:** Tối đa 800px chiều rộng
- **Chất lượng:** 80%

### Cách thêm ảnh mới:
1. **Convert ảnh sang webp:**
   ```bash
   # Dùng ImageMagick
   convert anh.jpg -resize 800x -quality 80 anh.webp
   
   # Hoặc dùng Python
   python3 -c "
   from PIL import Image
   img = Image.open('anh.jpg')
   img.thumbnail((800, 800))
   img.save('anh.webp', 'webp', quality=80)
   "
   ```

2. **Copy vào thư mục images/**
3. **Cập nhật file `js/app.js`**: Thêm tên ảnh vào mảng `PROD_IMAGES` và ánh xạ trong `getBrandImages()`
4. Đẩy lên GitHub

---

## Phần 4: Hướng dẫn thay đổi thông tin liên hệ

Mở file **`index.html`**, tìm và sửa các thông tin sau:

### Số điện thoại:
Tìm: `0378.679.633` (thay bằng số mới)

### Email:
Tìm: `vanhuufly@gmail.com`

### Địa chỉ:
Tìm: `1434 Phạm Văn Đồng, Nam Đồ Sơn, Hải Phòng`

### Zalo:
Tìm: `0378.679.633` (có thể thay bằng số Zalo khác)

> Các thông tin này xuất hiện nhiều lần trong file, hãy thay hết!

---

## Phần 5: Hướng dẫn thay đổi logo & banner

### Đổi logo:
1. Chuẩn bị ảnh logo mới, convert sang .webp
2. Copy vào thư mục **`images/`**
3. Mở **`index.html`**, tìm dòng:
   ```html
   <img src="images/LOGO-removebg-preview-e1749525723942.webp" ...>
   ```
4. Sửa đường dẫn thành ảnh mới

### Đổi banner (hero section):
Trong **`index.html`**, tìm section `<section class="hero">` và sửa nội dung:
- Tiêu đề: `Thách thức mọi nguồn nước!`
- Mô tả: dòng giới thiệu công ty
- Nút kêu gọi: `Liên hệ tư vấn miễn phí`

---

## Phần 6: Hướng dẫn thay đổi menu

Mở **`index.html`**, tìm `<nav class="nav">`.

### Cấu trúc menu:
```html
<ul class="nav-list">
  <li><a href="#home">🏠 Trang chủ</a></li>
  <li>
    <a href="#products">📦 Sản phẩm ▾</a>
    <div class="mega">
      ...danh mục sản phẩm...
    </div>
  </li>
  <li><a href="#price">💰 Bảng giá</a></li>
  ...
</ul>
```

### Thêm menu mới:
Copy 1 dòng `<li>` và sửa:
- `href`: `#tên-mục` (phải khớp với `id` trong phần nội dung)
- Nội dung: tên menu muốn hiển thị

---

## Phần 7: Hướng dẫn cập nhật bảng giá

### Thêm giá mới:
1. Mở **`js/products.js`**
2. Tìm mảng `PRICES` ở cuối file
3. Thêm dòng mới:
   ```javascript
   { brand:'Tên hãng', product:'Tên sản phẩm + mã', spec:'Quy cách', price:'Giá' },
   ```

### Thêm giá vào PRICE_MAP:
Để giá hiển thị kèm sản phẩm, thêm vào `PRICE_MAP`:
```javascript
nano: {
  'NO1-15L': { price:'4.983.000đ', spec:'15L' },
  'NO1-5L':  { price:'1.765.000đ', spec:'5L' },
},
```

---

## Phần 8: Hướng dẫn thêm bài viết / tin tức

Hiện tại website có section **#news** trong index.html.

### Cách thêm bài viết mới:
1. Mở **`index.html`**
2. Tìm `<section id="news">`
3. Thêm card bài viết mới:
   ```html
   <div class="news-card">
     <img src="images/ten-anh.webp" alt="Tiêu đề" loading="lazy">
     <h3>Tiêu đề bài viết</h3>
     <p>Nội dung tóm tắt...</p>
     <a href="#">Đọc tiếp</a>
   </div>
   ```

> Trong tương lai có thể nâng cấp lên CMS động để đăng bài dễ dàng hơn.

---

## Phần 9: Hướng dẫn thêm/sửa danh mục sản phẩm

### Thêm danh mục mới trong 1 thương hiệu:
Trong **`js/products.js`**, tìm thương hiệu (ví dụ `munich: {`), thêm nhóm mới:
```javascript
nano: {
  "Tên danh mục mới": [
    { code:'MÃ', name:'Tên SP', spec:'...', desc:'...', dm:'...' },
  ],
  "Danh mục cũ": [ ... ],
}
```

### Thêm thương hiệu mới:
Thêm vào đầu file trong mảng `BRANDS`:
```javascript
{ id:'hieu-moi', name:'Tên hãng', icon:'🌟', color:'#mã màu', desc:'Mô tả', count:0 },
```

Sau đó thêm dữ liệu sản phẩm vào object `PRODUCTS` và thêm section HTML tương ứng.

---

## Phần 10: Hướng dẫn đẩy code lên GitHub (cập nhật web)

Web tự động cập nhật sau khi đẩy code lên GitHub.

### Các bước:
```bash
# Bước 1: Vào thư mục dự án
cd /đường/dẫn/tranhuuminh-vlxd

# Bước 2: Kiểm tra file đã thay đổi
git status

# Bước 3: Thêm tất cả file đã sửa
git add .

# Bước 4: Ghi chú cho lần cập nhật
git commit -m "Mô tả ngắn: đã thay đổi gì"

# Bước 5: Đẩy lên GitHub
git push

# ✅ Done! Web sẽ tự cập nhật trong 1-2 phút.
```

### Kiểm tra web đã cập nhật chưa:
Mở trình duyệt → https://vanhuufly1-crypto.github.io/tranhuuminh-vlxd/
> **Ctrl + F5** để refresh không cache.

---

## 📌 Tổng kết

| Thao tác | File cần sửa |
|----------|-------------|
| Thêm sản phẩm | `js/products.js` |
| Thêm ảnh | `images/` + `js/app.js` |
| Sửa thông tin LH | `index.html` |
| Sửa giá | `js/products.js` (PRICE_MAP + PRICES) |
| Sửa menu | `index.html` |
| Thêm bài viết | `index.html` (section #news) |
| Đổi logo | `index.html` + `images/` |
| Đẩy web lên | `git add . && git commit && git push` |

---

*Tài liệu được soạn riêng cho Công ty TNHH XD & TM Trần Hữu Minh*
*Dựa trên cấu trúc website GitHub Pages hiện tại*
*Cập nhật lần cuối: Tháng 05/2026*