/* DỮ LIỆU SẢN PHẨM - TRẦN HỮU MINH */
const BRANDS = [
  { id:'munich', name:'Munich', icon:'⭐', color:'#e94560', desc:'Nhà phân phối chính thức MUNICH tại Hải Phòng - Hải Dương - Quảng Ninh', count:43 },
];

const PRODUCTS = {
  munich: {
    "🎨 Sơn nước": {
      "Nội thất": [
        { code:'Luxury Prime NT', name:'Sơn lót kháng kiềm nội thất', spec:'Lon 5L / Thùng 18L', desc:'Sơn lót kháng kiềm cao cấp cho tường nội thất.', dm:'Theo hướng dẫn' },
        { code:'Luxury - Siêu bóng NT', name:'Sơn siêu bóng nội thất', spec:'Lon 5L / Thùng 18L', desc:'Công nghệ Polymer cao cấp, siêu bóng, dễ lau chùi.', dm:'2-3 lớp, cách nhau 1-2 giờ' },
        { code:'Fly - Bóng mờ NT', name:'Sơn bóng mờ cao cấp nội thất', spec:'Lon 5L / Thùng 18L', desc:'Bóng mờ sang trọng, phù hợp mọi không gian.', dm:'2-3 lớp, cách 5-6 giờ' },
        { code:'Action - Siêu mịn NT', name:'Sơn siêu mịn nội thất', spec:'Lon 5L / Thùng 18L', desc:'Sơn mịn chất lượng cao, giá hợp lý.', dm:'2 lớp, cách 30-60 phút' },
        { code:'Nano AB', name:'Sơn diệt khuẩn 99,99% nội thất', spec:'Lon 5L / Thùng 18L', desc:'Công nghệ Nano bạc diệt khuẩn. Dùng cho bệnh viện, trường học, nhà máy thực phẩm.', dm:'Theo hướng dẫn' },
        { code:'Economy', name:'Sơn kinh tế nội thất', spec:'Lon 5L / Thùng 18L', desc:'Sơn nội thất giá rẻ, chất lượng cơ bản.', dm:'Theo hướng dẫn' },
      ],
      "Ngoại thất": [
        { code:'Luxury Prime NT2', name:'Sơn lót kháng kiềm ngoại thất', spec:'Lon 5L / Thùng 18L', desc:'Sơn lót kháng kiềm cho tường ngoài trời.', dm:'Theo hướng dẫn' },
        { code:'Luxury - Siêu bóng NT2', name:'Sơn siêu bóng ngoại thất', spec:'Lon 5L / Thùng 18L', desc:'Siêu bóng ngoại thất, chịu thời tiết khắc nghiệt.', dm:'2-3 lớp' },
        { code:'Fly - Bóng mờ NT2', name:'Sơn bóng mờ cao cấp ngoại thất', spec:'Lon 5L / Thùng 18L', desc:'Bóng mờ ngoại thất, chịu thời tiết tốt.', dm:'Theo hướng dẫn' },
        { code:'Action - Siêu mịn NT2', name:'Sơn siêu mịn ngoại thất', spec:'Lon 5L / Thùng 18L', desc:'Sơn mịn ngoại thất chất lượng cao.', dm:'Theo hướng dẫn' },
      ],
    },
    "🛡️ Sơn chống thấm": {
      "Xi măng-polymer": [
        { code:'G20', name:'Màng chống thấm đàn hồi 200%', spec:'Bộ 26kg', desc:'Chống thấm hai thành phần xi măng-polymer siêu đàn hồi.', dm:'0,6 kg/m², 2-3 lớp' },
        { code:'G20S', name:'Màng chống thấm đàn hồi 200%', spec:'Bộ 25kg', desc:'Giống G20, quy cách khác.', dm:'0,6 kg/m², 2-3 lớp' },
        { code:'G20C', name:'Siêu cứng, hiệu ứng lá sen', spec:'Bộ 20kg', desc:'Chống thấm cao cấp hiệu ứng lá sen.', dm:'0,6-1 kg/m²/lớp' },
        { code:'G20C-Đen', name:'Chống thấm màu đen bể cá Koi', spec:'Bộ 20kg', desc:'Chuyên cho bể cá Koi, an toàn cho sinh vật.', dm:'0,6-1 kg/m²/lớp' },
        { code:'C20', name:'Màng chống thấm siêu cứng', spec:'Thùng 20kg', desc:'Lót cho PU S700, S400, chống thấm tường ngoài.', dm:'0,6-1 kg/m²/lớp' },
      ],
      "Acrylic": [
        { code:'CT0', name:'Acrylic chống thấm pha xi măng', spec:'Lon 5kg / Thùng 18kg', desc:'Chống thấm sàn mái, ban công, tường ngoài.', dm:'1kg + 0,5kg xi măng + 0,3kg nước' },
      ],
      "Polyurethane (PU)": [
        { code:'PU S700', name:'Chống thấm PU 1 TP (gốc nước) - đàn hồi 700%', spec:'Lon 1L/4L / Thùng 18L', desc:'Chống thấm lộ thiên, chịu UV. Hơn 1.000 màu.', dm:'0,75 kg/m²/lớp' },
        { code:'PU S400', name:'Chống thấm PU 1 TP (gốc nước) - đàn hồi 400%', spec:'Lon 5L / Thùng 18L', desc:'Giống S700, giá hợp lý hơn.', dm:'~6 m²/lớp' },
        { code:'PU S800F', name:'Chống thấm PU 2 TP (gốc dầu) - đàn hồi 700%', spec:'Bộ 3,6kg/18kg', desc:'Chống thấm lộ thiên, cần lót EP11.', dm:'1 kg/m²' },
        { code:'Pu Glass', name:'Chống thấm PU trong suốt - đàn hồi 600%', spec:'Lon 1L/4L / Thùng 18L', desc:'Màng chống thấm trong suốt 1 TP gốc nước.', dm:'0,75 kg/m²/lớp' },
      ],
      "Bitum & Đặc chủng": [
        { code:'G10', name:'Chống thấm Bitum-Polymer', spec:'Thùng 18kg / Lon 3,5kg', desc:'Chống thấm mái bằng, tầng hầm, WC.', dm:'Lót 0,2-0,3; Phủ 0,6 kg/m²/lớp' },
        { code:'G68', name:'Bitum nhựa đường biến tính', spec:'Thùng 18kg', desc:'Lớp lót cho màng khò Bitum.', dm:'Theo hướng dẫn' },
        { code:'S902', name:'Sơn sàn PU kho lạnh', spec:'Bộ 5kg/25kg', desc:'Chịu sốc nhiệt, chịu UV.', dm:'1 kg/m²/2 lớp' },
      ],
    },
    "🏭 Sơn công nghiệp": {
      "Epoxy": [
        { code:'EP11 Lót', name:'Sơn lót Epoxy gốc dung môi', spec:'Bộ 15kg/3kg', desc:'Lót cho sơn Epoxy và PU.', dm:'~100 m²/lớp' },
        { code:'EP11 Phủ', name:'Sơn phủ Epoxy hệ lăn', spec:'Bộ 15kg/3kg', desc:'Sơn phủ Epoxy cho sàn nhà xưởng.', dm:'~100 m²/lớp' },
        { code:'EP11 Tự san', name:'Sơn Epoxy tự san phẳng', spec:'Bộ 25kg/5kg', desc:'Tự san phẳng, dày ≥2mm.', dm:'1 kg/m²/dày 1mm' },
        { code:'EP12 Lót', name:'Sơn lót Epoxy gốc nước', spec:'Bộ 25kg/5kg', desc:'Không độc, không mùi.', dm:'~150 m²/lớp' },
        { code:'EP12 Phủ', name:'Sơn phủ Epoxy gốc nước', spec:'Bộ 25kg/5kg', desc:'Thân thiện môi trường.', dm:'~150 m²/lớp' },
      ],
      "Chống nóng & Thể thao": [
        { code:'UV20', name:'Sơn chống nóng cách nhiệt', spec:'Thùng 4L/18L', desc:'Giảm 5-28°C bề mặt mái.', dm:'Theo hướng dẫn' },
        { code:'UV20 Primer', name:'Lót chống nóng cho tôn cũ', spec:'Thùng 4L/18L', desc:'Lớp lót cho mái tôn cũ.', dm:'Theo hướng dẫn' },
        { code:'S632', name:'Sơn sân chơi thể thao', spec:'Lon 5L / Thùng 18L', desc:'Sơn trắng cho sân thể thao.', dm:'Theo hướng dẫn' },
      ],
    },
    "🔧 Phụ gia & VLXD": {
      "Phụ gia chống thấm": [
        { code:'Latex S', name:'Phụ gia kết nối chống thấm', spec:'Can 5kg/25kg', desc:'Làm hồ dầu, vữa trát chống thấm.', dm:'Theo hướng dẫn' },
        { code:'S208', name:'Phụ gia trộn vữa chống thấm', spec:'Túi 1kg', desc:'4-7 bao xi măng.', dm:'Theo hướng dẫn' },
        { code:'S302', name:'Phụ gia trộn vữa chống co ngót', spec:'Túi 1kg', desc:'Chống co ngót, tăng bám dính.', dm:'Theo hướng dẫn' },
        { code:'Walling', name:'Chống thấm tinh thể thẩm thấu (nước)', spec:'Chai 1L / Can 5L/25L', desc:'Chống muối hóa cho gạch, ngói, bê tông.', dm:'2-3 m²/lớp' },
        { code:'Stone SF', name:'Chống thấm tinh thể thẩm thấu (dầu)', spec:'Lon 1L/4L / Thùng 18L', desc:'Không lăn sơn nước lên trên được.', dm:'1-10 m²/lớp' },
        { code:'Kyton K101', name:'Chống thấm tinh thể dạng bột', spec:'Bao 20kg', desc:'Chống thấm thuận và nghịch.', dm:'2-5 kg/m²' },
        { code:'Water Plug', name:'Vật liệu đông cứng nhanh', spec:'Túi 1kg', desc:'Bịt kín lỗ rò rỉ nước tức thời.', dm:'Tức thời' },
      ],
      "Vữa & Keo dán": [
        { code:'Grout G650', name:'Vữa rót tự chảy không co ngót', spec:'Bao 25kg / Túi 4kg', desc:'Đổ cổ ống, hộp kỹ thuật.', dm:'1 m³ = 76 bao' },
        { code:'Repair G50', name:'Vữa sửa chữa bê tông', spec:'Bao 25kg', desc:'Sửa chữa bê tông hư hỏng.', dm:'10 m²/3 lớp' },
        { code:'Gel G-01', name:'Keo dán gạch đá', spec:'Bao 25kg', desc:'C1/C2/C3 tùy kích thước gạch.', dm:'Theo hướng dẫn' },
        { code:'Tile G07', name:'Keo chà ron miết mạch', spec:'Túi 1kg', desc:'Nhiều màu sắc.', dm:'1kg + 0,3L nước' },
        { code:'HF', name:'Bột rắc tăng cứng sàn', spec:'Bao 25kg', desc:'Tăng cứng sàn, chống mài mòn.', dm:'Theo hướng dẫn' },
      ],
    },
  },
  mpe: {
    "💡 Đèn LED Bulb": [
      { code:'LBD3-5', name:'LED Bulb Chống Ẩm 5W', spec:'5W', desc:'Chip SMD 2835, 500Lm, 6000K/3000K, đui E27, chống ẩm.', dm:'1 cái/hộp' },
      { code:'LBD3-9', name:'LED Bulb Chống Ẩm 9W', spec:'9W', desc:'Chip SMD 2835, 900Lm, 6000K/3000K, đui E27, chống ẩm.', dm:'1 cái/hộp' },
      { code:'LBD3-12', name:'LED Bulb Chống Ẩm 12W', spec:'12W', desc:'Chip SMD 2835, 1200Lm, 6000K/3000K, đui E27, chống ẩm.', dm:'1 cái/hộp' },
      { code:'LBD3-15', name:'LED Bulb Chống Ẩm 15W', spec:'15W', desc:'Chip SMD 2835, 1500Lm, 6000K/3000K, đui E27, chống ẩm.', dm:'1 cái/hộp' },
    ],
    "🔌 Công tắc & Ổ cắm A6": [
      { code:'A6M1', name:'Công tắc 1 chiều 16A-250V', spec:'1 module', desc:'Công tắc 1 chiều seri A6, màu trắng, 16A-250V.', dm:'1 cái' },
      { code:'A6M2', name:'Công tắc 2 chiều 16A-250V', spec:'1 module', desc:'Công tắc 2 chiều seri A6, màu trắng, 16A-250V.', dm:'1 cái' },
      { code:'A6US', name:'Ổ cắm 2 chấu 16A-250V', spec:'1 module', desc:'Ổ cắm 2 chấu seri A6, màu trắng, 16A-250V.', dm:'1 cái' },
      { code:'A6UES2', name:'Ổ cắm 3 chấu 16A-250V', spec:'1 module', desc:'Ổ cắm 3 chấu seri A6, có tiếp địa, 16A-250V.', dm:'1 cái' },
    ],
    "🔌 Công tắc & Ổ cắm A70 Plus": [
      { code:'A70M1', name:'Công tắc 1 chiều 16A (A70)', spec:'1 module', desc:'Công tắc 1 chiều seri A70 Plus, thiết kế sang trọng.', dm:'1 cái' },
      { code:'A70M2', name:'Công tắc 2 chiều 16A (A70)', spec:'1 module', desc:'Công tắc 2 chiều seri A70 Plus, thiết kế sang trọng.', dm:'1 cái' },
      { code:'A70US', name:'Ổ cắm 2 chấu (A70)', spec:'1 module', desc:'Ổ cắm 2 chấu seri A70 Plus, màu trắng sang trọng.', dm:'1 cái' },
      { code:'A70UES2', name:'Ổ cắm 3 chấu (A70)', spec:'1 module', desc:'Ổ cắm 3 chấu có tiếp địa seri A70 Plus.', dm:'1 cái' },
      { code:'A70USB', name:'Ổ cắm sạc USB (A70)', spec:'2 module', desc:'Ổ cắm sạc USB type A, DC 5V-2.1A, seri A70 Plus.', dm:'1 cái' },
    ],
    "⚡ Thiết bị đóng cắt": [
      { code:'MCB-MPE', name:'MCB Tép 6-63A', spec:'1P', desc:'Aptomat tép MPE, 6-63A, 6kA, 230/400VAC.', dm:'1 cái' },
      { code:'RCBO-MPE', name:'RCBO Chống giật 6-40A', spec:'1P+N', desc:'Aptomat chống giật MPE, 6-40A, 30mA, 230VAC.', dm:'1 cái' },
      { code:'RCCB-MPE', name:'RCCB Chống giật 25-100A', spec:'2P/4P', desc:'Aptomat chống giật tổng MPE, 25-100A, 100mA.', dm:'1 cái' },
    ],
  },
};

/* GIÁ SẢN PHẨM: Xem prices.js (file chuẩn) */

// Count products (hỗ trợ cả cây 2 cấp và 3 cấp)
for (const b of BRANDS) {
  const data = PRODUCTS[b.id];
  if (!data) { b.count = 0; continue; }
  if (Array.isArray(data)) { b.count = data.length; continue; }
  let c = 0;
  for (const k in data) {
    if (Array.isArray(data[k])) { c += data[k].length; }
    else {
      // Cây 3 cấp: Category → Subcategory → Array
      for (const sk in data[k]) {
        if (Array.isArray(data[k][sk])) c += data[k][sk].length;
      }
    }
  }
  b.count = c;
}

