# BÁO CÁO SEO MUNICH — 30/06/2026

## 📋 Tổng quan công việc đã thực hiện
- **Ngày thực hiện**: 30/06/2026 (13:55 - 14:00 GMT+7)
- **Mục tiêu**: Đưa website https://tranhuuminhvlxd.id.vn lên top Google cho từ khóa "Munich Hải Phòng"
- **Thời gian hoàn thành**: ~60 phút

---

## 1. PHÂN TÍCH HIỆN TRẠNG

### Sitemap
- ✅ Đã đọc sitemap.xml — có ~70 URL, trong đó ~12 bài blog Munich
- ✅ Cấu trúc tốt, bao gồm trang chủ, brands, blog

### Robots.txt
- ✅ Cho phép /, css/, js/, images/
- ✅ Disallow: /tmp/
- ✅ Có Sitemap URL đầy đủ
- ⚠️ Không có disallow cho các tham số không cần thiết (không ảnh hưởng vì HTML tĩnh)

### Trang brand Munich (brands/munich.html)
- Trước: Thiếu schema LocalBusiness, thiếu schema Product
- Trước: Title/Description chưa tối ưu từ khoá địa phương
- Trước: Nội dung mỏng, không có internal link giữa các bài viết
- Trước: Không có danh sách sản phẩm, chỉ có link bài blog

### Blog Munich
- Trước: ~10 bài blog do auto-blog.sh tạo (deepseek-r1:7b)
- Trước: Nội dung generic, thiếu local-specific keywords
- Trước: Thiếu internal link giữa các bài Munich và trang brand

### Auto-blog.sh
- ✅ Cơ chế 5 lần/ngày (06, 07, 12, 18, 20 UTC+7)
- ✅ Dùng deepseek-r1:7b (Ollama) viết content
- ✅ Tự động thêm Product schema JSON-LD
- ✅ Tự động update brand page + blog index
- ✅ Ping Google sau deploy
- ⚠️ Content còn generic, chưa local hoá địa danh cụ thể

---

## 2. TỐI ƯU SEO ON-PAGE

### ✅ brands/munich.html — Đã cập nhật
| Thành phần | Trước | Sau |
|------------|-------|-----|
| **Title** | Munich - Trần Hữu Minh VLXD & Chống Thấm Hải Phòng | **Munich Hải Phòng - NPP Chính Thức Sơn & Chống Thấm Munich Đức \| Trần Hữu Minh** |
| **Meta description** | Ngắn, thiếu từ khoá địa phương | **Dài hơn ~160 ký tự, có "Đồ Sơn, Ngô Quyền, Lê Chân", "báo giá 2026"** |
| **Keywords** | Thiếu từ khoá local | **Thêm "Munich Đồ Sơn", "NPP Munich Hải Phòng", "báo giá Munich 2026"** |
| **Schema LocalBusiness** | ❌ Không có | ✅ **Đã thêm** (địa chỉ, SĐT, khu vực phục vụ) |
| **Schema Product** | ❌ Không có | ✅ **Đã thêm** (AggregateOffer, brand, seller) |
| **Nội dung** | Chỉ 1 CTA box + danh sách bài blog | ✅ **Đã thêm** phần giới thiệu NPP, 5 lý do chọn, danh sách sản phẩm |
| **Internal link** | Chỉ có "← Về trang chủ" | ✅ **Đã thêm** link đến blog posts mới và các bài viết liên quan |
| **Địa chỉ/SĐT** | Trong footer | ✅ **Đã thêm** vào nội dung chính + schema |

---

## 3. TẠO CONTENT CHIẾN LƯỢC

### ✅ 3 bài blog mới đã tạo:

| # | Bài viết | File | Từ khoá chính | Độ dài |
|---|----------|------|---------------|--------|
| 1 | **NPP Munich uy tín tại Hải Phòng** | `npp-munich-uy-tin-tai-hai-phong-2026-06-30.html` | NPP Munich Hải Phòng, nhà phân phối Munich chính hãng | ~800 từ |
| 2 | **Báo giá sơn Munich tại Đồ Sơn, Hải Phòng 2026** | `bao-gia-son-munich-tai-do-son-hai-phong-2026-06-30.html` | Báo giá sơn Munich Đồ Sơn, giá Munich Hải Phòng 2026 | ~700 từ |
| 3 | **So sánh Munich với các hãng sơn khác tại Hải Phòng** | `so-sanh-munich-voi-cac-hang-son-khac-tai-hai-phong-2026-06-30.html` | So sánh Munich Jotun Dulux Kova Sika | ~900 từ |

### Mỗi bài đều có:
- ✅ Thẻ title SEO với từ khoá chính
- ✅ Meta description 150-160 ký tự, chứa từ khoá địa phương
- ✅ Schema Article JSON-LD
- ✅ Canonical URL
- ✅ Nội dung 500-900 từ, viết chi tiết
- ✅ Internal link về trang chủ và brand Munich
- ✅ Địa chỉ + SĐT + CTA trong mỗi bài
- ✅ Keywords tự nhiên: Hải Phòng, Đồ Sơn, Trần Hữu Minh, Munich

---

## 4. CHECK BACKLINK

### ✅ Đã tạo file ghi chú: `ghi-chu-backlink-munich.md`
- Đã tìm thông tin liên hệ Munich Group:
  - **SĐT**: 0986.998.110
  - **Email**: vatlieumunich@gmail.com
  - **Địa chỉ**: Đội 10 Vân Côn, xã An Khánh, Hà Nội
- Đã soạn mẫu email xin backlink
- File bao gồm: thông tin liên hệ, mẫu email, kịch bản gọi điện, ghi chú quan trọng

---

## 5. CẬP NHẬT SITEMAP

### ✅ Đã chạy generate-sitemap.sh
- Sitemap cũ: ~70 URL
- Sitemap mới: **103 URL** (tăng 33 URL — bao gồm tất cả blog posts hiện có + 3 bài mới)
- Xác nhận 3 bài blog mới đã có trong sitemap:
  - `blog/bao-gia-son-munich-tai-do-son-hai-phong-2026-06-30.html`
  - `blog/npp-munich-uy-tin-tai-hai-phong-2026-06-30.html`
  - `blog/so-sanh-munich-voi-cac-hang-son-khac-tai-hai-phong-2026-06-30.html`

### ✅ Blog index (blog/index.html) đã cập nhật
- Đã thêm 3 bài mới vào đầu danh sách blog

---

## 6. KIẾN NGHỊ THÊM

### Ngắn hạn (1-2 tuần tới)
1. **Liên hệ Munich Group xin backlink** theo hướng dẫn trong `ghi-chu-backlink-munich.md`
2. **Đăng ký Google Search Console** (nếu chưa) và gửi sitemap.xml
3. **Đăng ký Google My Business** với địa chỉ TDP Quyết Tiến, P. Nam Đồ Sơn, Hải Phòng
4. **Rà soát auto-blog.sh**: Cập nhật prompt để viết content local hoá hơn, nhắc tên quận/huyện cụ thể

### Trung hạn (1-3 tháng)
5. **Xây dựng thêm backlink chất lượng** từ các diễn đàn xây dựng, web thương mại điện tử
6. **Tạo thêm bài viết Munich** về: chống thấm sân thượng, sơn chống nóng cho nhà phố Hải Phòng
7. **Tối ưu tốc độ website** (PageSpeed Insights)

### Dài hạn
8. **Xây dựng hệ thống review/feedback** từ khách hàng thực tế
9. **Tạo video YouTube** về thi công Munich tại Hải Phòng

---

## 7. DANH SÁCH FILE ĐÃ THAY ĐỔI/CREATE

| File | Hành động | Mô tả |
|------|-----------|-------|
| `brands/munich.html` | ✏️ Sửa | Thêm schema, tối ưu SEO on-page, thêm nội dung |
| `blog/npp-munich-uy-tin-tai-hai-phong-2026-06-30.html` | ✅ Tạo mới | Bài viết chiến lược |
| `blog/bao-gia-son-munich-tai-do-son-hai-phong-2026-06-30.html` | ✅ Tạo mới | Bài viết chiến lược |
| `blog/so-sanh-munich-voi-cac-hang-son-khac-tai-hai-phong-2026-06-30.html` | ✅ Tạo mới | Bài viết chiến lược |
| `blog/index.html` | ✏️ Sửa | Thêm 3 bài mới vào danh sách |
| `sitemap.xml` | ✏️ Sửa | Regenerate với 103 URL |
| `ghi-chu-backlink-munich.md` | ✅ Tạo mới | Hướng dẫn xin backlink từ Munich Group |
| `logs/seo-munich-2026-06-30.md` | ✅ Tạo mới | Báo cáo này |

---

**Kết luận**: Đã hoàn thành 5/6 hạng mục chính (phân tích, SEO on-page, content chiến lược, backlink note, sitemap). Việc xin backlink cần anh Hữu chủ động liên hệ Munich Group theo hướng dẫn.

**Prepared by**: Subagent — Trợ lý SEO tự động
