/* DỮ LIỆU SẢN PHẨM - TRẦN HỮU MINH */
const BRANDS = [
  { id:'munich', name:'Munich', icon:'⭐', color:'#e94560', desc:'Chống thấm & Sơn công nghiệp - Phân phối chính thức', count:0 },
  { id:'nano', name:'Nano House', icon:'🏡', color:'#0fb9b1', desc:'Sơn & Chống thấm công nghệ Nano - Phân phối chính thức', count:0 },
  { id:'sika', name:'Sika', icon:'🧪', color:'#6c5ce7', desc:'Vữa kỹ thuật & Chống thấm', count:0 },
  { id:'dulux', name:'Dulux', icon:'🎨', color:'#0984e3', desc:'Sơn nội thất & ngoại thất', count:0 },
  { id:'jotun', name:'Jotun', icon:'🖌️', color:'#f39c12', desc:'Sơn nội thất & ngoại thất cao cấp', count:0 },
  { id:'kova', name:'Kova', icon:'🏺', color:'#e17055', desc:'Chống thấm & Sơn nước', count:0 },
  { id:'nippon', name:'Nippon', icon:'🇯🇵', color:'#00b894', desc:'Sơn nội thất & ngoại thất', count:0 },
];

const PRODUCTS = {
  munich: {
    "Chống thấm xi măng-polymer": [
      { code:'G20', name:'Màng chống thấm đàn hồi 200%', spec:'Bộ 26kg (bột 16 + nước 10)', desc:'Chống thấm hai thành phần xi măng-polymer siêu đàn hồi. Dùng cho tầng hầm, sàn mái, bể nước, nhà vệ sinh, ban công.', dm:'0,6 kg/m², 2-3 lớp' },
      { code:'G20S', name:'Màng chống thấm đàn hồi 200%', spec:'Bộ 25kg (bột 16 + dung dịch 9)', desc:'Giống G20, quy cách đóng gói khác.', dm:'0,6 kg/m², 2-3 lớp' },
      { code:'G20C', name:'Siêu cứng, siêu bám dính, hiệu ứng lá sen', spec:'Bộ 20kg (bột 15 + nước 5)', desc:'Chống thấm cao cấp hiệu ứng lá sen. Chống bám bụi, dễ vệ sinh.', dm:'0,6-1 kg/m²/lớp, 8 m²/4 lớp' },
      { code:'G20C-Đen', name:'Chống thấm màu đen cho bể cá Koi', spec:'Bộ 20kg', desc:'Chuyên dụng cho bể cá Koi, cơ chế thở chống phồng rộp, an toàn cho sinh vật.', dm:'0,6-1 kg/m²/lớp' },
      { code:'C20', name:'Màng chống thấm siêu cứng cải tiến', spec:'Thùng 20kg', desc:'Làm lót cho PU S700, S400, AC02. Chống thấm tường ngoài, trám vết nứt.', dm:'0,6-1 kg/m²/lớp' },
    ],
    "Chống thấm Acrylic": [
      { code:'CT0', name:'Acrylic chống thấm pha xi măng', spec:'Lon 5kg / Thùng 18kg', desc:'Chống thấm acrylic cho sàn mái, ban công, tường ngoài. Có thể thay thế sơn ngoại thất.', dm:'1kg + 0,5kg xi măng + 0,3kg nước' },
    ],
    "Chống thấm Polyurethane": [
      { code:'PU S700', name:'Chống thấm PU một thành phần gốc nước - đàn hồi 700%', spec:'Lon 1L/4L / Thùng 18L', desc:'Chống thấm lộ thiên, chịu UV. Hơn 1.000 màu sắc.', dm:'0,75 kg/m²/lớp, ~6 m²/lớp' },
      { code:'PU S400', name:'Chống thấm PU một thành phần gốc nước - đàn hồi 400%', spec:'Lon 5L / Thùng 18L', desc:'Giống S700, độ đàn hồi thấp hơn, giá thành hợp lý hơn.', dm:'~6 m²/lớp' },
      { code:'PU S800F', name:'Chống thấm PU hai thành phần gốc dầu - đàn hồi 700%', spec:'Bộ 3,6kg/18kg', desc:'Chống thấm lộ thiên, cần lót EP11 trước khi thi công.', dm:'1 kg/m²' },
      { code:'Pu Glass', name:'Chống thấm PU trong suốt - đàn hồi 600%', spec:'Lon 1L/4L / Thùng 18L', desc:'Màng chống thấm trong suốt một thành phần gốc nước.', dm:'0,75 kg/m²/lớp' },
    ],
    "Sơn Epoxy công nghiệp": [
      { code:'EP11 Lót', name:'Sơn lót Epoxy gốc dung môi', spec:'Bộ 15kg/3kg', desc:'Lót cho sơn Epoxy và PU S800F. Cần thông gió khi thi công.', dm:'~100 m²/lớp' },
      { code:'EP11 Phủ', name:'Sơn phủ Epoxy hệ lăn', spec:'Bộ 15kg/3kg', desc:'Sơn phủ Epoxy gốc dung môi cho sàn nhà xưởng, bãi đỗ xe.', dm:'~100 m²/lớp' },
      { code:'EP11 Tự san', name:'Sơn phủ Epoxy hệ tự san phẳng', spec:'Bộ 25kg/5kg', desc:'Tự san phẳng, độ dày tối thiểu 2mm.', dm:'1 kg/m²/dày 1mm' },
      { code:'EP12 Lót', name:'Sơn lót Epoxy gốc nước', spec:'Bộ 25kg/5kg', desc:'Không độc, không mùi. Dùng cho môi trường ẩm.', dm:'~150 m²/lớp' },
      { code:'EP12 Phủ', name:'Sơn phủ Epoxy gốc nước', spec:'Bộ 25kg/5kg', desc:'Tương tự EP11 nhưng gốc nước, thân thiện môi trường.', dm:'~150 m²/lớp' },
    ],
    "Sơn nước nội thất": [
      { code:'Luxury Prime NT', name:'Sơn lót kháng kiềm nội thất', spec:'Lon 5L / Thùng 18L', desc:'Sơn lót kháng kiềm cao cấp cho tường nội thất.', dm:'Theo hướng dẫn' },
      { code:'Luxury - Siêu bóng NT', name:'Sơn siêu bóng nội thất', spec:'Lon 5L / Thùng 18L', desc:'Công nghệ Polymer cao cấp, siêu bóng, dễ lau chùi.', dm:'2-3 lớp, cách nhau 1-2 giờ' },
      { code:'Fly - Bóng mờ NT', name:'Sơn bóng mờ cao cấp nội thất', spec:'Lon 5L / Thùng 18L', desc:'Bóng mờ sang trọng, phù hợp mọi không gian.', dm:'2-3 lớp, cách 5-6 giờ' },
      { code:'Action - Siêu mịn NT', name:'Sơn siêu mịn nội thất', spec:'Lon 5L / Thùng 18L', desc:'Sơn mịn chất lượng cao, giá hợp lý.', dm:'2 lớp, cách 30-60 phút' },
      { code:'Nano AB', name:'Sơn diệt khuẩn 99,99% nội thất', spec:'Lon 5L / Thùng 18L', desc:'Công nghệ Nano bạc diệt khuẩn. Dùng cho bệnh viện, trường học, nhà máy thực phẩm.', dm:'Theo hướng dẫn' },
      { code:'Economy', name:'Sơn kinh tế nội thất', spec:'Lon 5L / Thùng 18L', desc:'Sơn nội thất giá rẻ, chất lượng cơ bản.', dm:'Theo hướng dẫn' },
    ],
    "Sơn nước ngoại thất": [
      { code:'Luxury Prime NT (NT2)', name:'Sơn lót kháng kiềm ngoại thất', spec:'Lon 5L / Thùng 18L', desc:'Sơn lót kháng kiềm cho tường ngoài trời.', dm:'Theo hướng dẫn' },
      { code:'Luxury - Siêu bóng NT (NT2)', name:'Sơn siêu bóng ngoại thất', spec:'Lon 5L / Thùng 18L', desc:'Siêu bóng ngoại thất, chịu thời tiết khắc nghiệt.', dm:'2-3 lớp' },
      { code:'Fly - Bóng mờ NT (NT2)', name:'Sơn bóng mờ cao cấp ngoại thất', spec:'Lon 5L / Thùng 18L', desc:'Bóng mờ ngoại thất, chịu thời tiết tốt.', dm:'Theo hướng dẫn' },
      { code:'Action - Siêu mịn NT (NT2)', name:'Sơn siêu mịn ngoại thất', spec:'Lon 5L / Thùng 18L', desc:'Sơn mịn ngoại thất chất lượng cao.', dm:'Theo hướng dẫn' },
    ],
    "Sơn chống nóng & Sơn thể thao": [
      { code:'UV20', name:'Sơn chống nóng cách nhiệt', spec:'Thùng 4L/18L', desc:'Giảm 5-28 độ C bề mặt mái. Thi công 2 lớp.', dm:'Theo hướng dẫn' },
      { code:'UV20 Primer', name:'Lót chống nóng cho tôn cũ', spec:'Thùng 4L/18L', desc:'Lớp lót chống nóng cho mái tôn đã qua sử dụng.', dm:'Theo hướng dẫn' },
      { code:'S632', name:'Sơn sân chơi thể thao', spec:'Lon 5L / Thùng 18L', desc:'Sơn trắng chưa pha màu cho sân thể thao, pha 5% nước.', dm:'Theo hướng dẫn' },
    ],
    "Chống thấm Bitum & đặc chủng": [
      { code:'G10', name:'Chống thấm Bitum - Polymer nhựa đường', spec:'Thùng 18kg / Lon 3,5kg', desc:'Chống thấm mái bằng, tầng hầm, nhà vệ sinh. Làm lót cho màng khò Bitum.', dm:'Lót 0,2-0,3; Phủ 0,6 kg/m²/lớp' },
      { code:'G68', name:'Bitum nhựa đường biến tính', spec:'Thùng 18kg', desc:'Lớp lót cho màng khò Bitum.', dm:'Theo hướng dẫn' },
      { code:'S902', name:'Sơn sàn PU kho lạnh', spec:'Bộ 5kg/25kg', desc:'Chịu sốc nhiệt, chịu UV. Dùng cho bê tông, kim loại, gỗ, đá, nhựa.', dm:'1 kg/m²/2 lớp' },
    ],
    "Phụ gia & Vật liệu xây dựng": [
      { code:'Latex S', name:'Phụ gia kết nối chống thấm', spec:'Can 5kg/25kg', desc:'Làm hồ dầu, vữa trát chống thấm, tăng kết dính.', dm:'Theo hướng dẫn' },
      { code:'S208', name:'Phụ gia trộn vữa chống thấm', spec:'Túi 1kg', desc:'4-7 bao xi măng. Chống nứt, tăng bám dính.', dm:'4-7 bao xi măng' },
      { code:'S302', name:'Phụ gia trộn vữa chống co ngót', spec:'Túi 1kg', desc:'Chống co ngót, tăng bám dính cho vữa xây trát.', dm:'Theo hướng dẫn' },
      { code:'Walling', name:'Chống thấm tinh thể thẩm thấu gốc nước', spec:'Chai 1L / Can 5L/25L', desc:'Thẩm thấu kỵ nước, chống muối hóa. Dùng cho gạch, ngói, bê tông, đá.', dm:'2-3 m²/lớp' },
      { code:'Stone SF', name:'Chống thấm tinh thể thẩm thấu gốc dầu', spec:'Lon 1L/4L / Thùng 18L', desc:'Giống Walling nhưng gốc dầu. Lưu ý: không lăn sơn nước được lên trên.', dm:'1-10 m²/lớp tùy bề mặt' },
      { code:'Kyton K101', name:'Chống thấm tinh thể thẩm thấu dạng bột', spec:'Bao 20kg', desc:'Chống thấm thuận và nghịch. Dùng cho hố pit, bể ngầm.', dm:'2-5 kg/m²' },
      { code:'Water Plug', name:'Vật liệu đông cứng nhanh', spec:'Túi 1kg', desc:'Trám vá, bịt kín lỗ rò rỉ nước tức thời.', dm:'Tức thời' },
      { code:'Grout G650', name:'Vữa rót tự chảy không co ngót', spec:'Bao 25kg / Túi 4kg', desc:'Đổ cổ ống PVC, hộp kỹ thuật, máy móc.', dm:'1 m³ = 76 bao' },
      { code:'Repair G50', name:'Vữa sửa chữa bê tông', spec:'Bao 25kg', desc:'Sửa chữa bê tông hư hỏng, chống thấm ngược tường.', dm:'10 m²/3 lớp' },
      { code:'Gel G-01', name:'Keo dán gạch đá các loại', spec:'Bao 25kg', desc:'C1 cho gạch khổ lớn, C2 cho gạch tới 1m, C3 cho gạch tới 80cm.', dm:'Theo hướng dẫn' },
      { code:'Tile G07', name:'Keo chà ron miết mạch', spec:'Túi 1kg', desc:'Nhiều màu sắc. 1kg + 0,3L nước.', dm:'Theo hướng dẫn' },
      { code:'HF', name:'Bột rắc tăng cứng sàn', spec:'Bao 25kg', desc:'Tăng cứng sàn, chống mài mòn. Nhiều màu: xám, xanh, đỏ.', dm:'Theo hướng dẫn' },
    ],
  },
  nano: {
    "Sơn nội thất": [
      { code:'Nano Interior', name:'Sơn nội thất cao cấp', spec:'Thùng 18L', desc:'Sơn nước nội thất chất lượng cao, ít mùi, bền màu.', dm:'14-16 m²/lớp' },
      { code:'Nano Classic', name:'Sơn mịn nội thất cao cấp', spec:'Thùng 18L', desc:'Sơn mịn nội thất, lau chùi được.', dm:'14-16 m²/lớp' },
      { code:'Nano Guard', name:'Sơn bóng nội thất cao cấp', spec:'Thùng 18L', desc:'Sơn bóng nội thất, chống bám bụi.', dm:'14-16 m²/lớp' },
      { code:'Primer IN', name:'Sơn lót kiềm nội thất', spec:'Thùng 18L', desc:'Sơn lót kháng kiềm nội thất cao cấp.', dm:'14-16 m²/lớp' },
    ],
    "Sơn ngoại thất": [
      { code:'Primer EX', name:'Sơn lót kiềm ngoại thất', spec:'Thùng 18L', desc:'Sơn lót kháng kiềm ngoại thất cao cấp.', dm:'12-14 m²/lớp' },
      { code:'ProGuard', name:'Sơn chống thấm ngoại thất', spec:'Thùng 18L', desc:'Sơn chống thấm ngoại thất cao cấp, chịu thời tiết.', dm:'12-14 m²/lớp' },
      { code:'Primer EX - Siêu bóng', name:'Sơn siêu bóng ngoại thất chống nóng', spec:'Thùng 18L', desc:'Sơn siêu bóng ngoại thất kết hợp chống nóng.', dm:'12-14 m²/lớp' },
    ],
  },
  sika: [
    { code:'Sika Top 107', name:'Vữa sửa chữa bê tông', spec:'Bao 25kg', desc:'Vữa gốc xi măng polymer. Sửa chữa bê tông hư hỏng, trám vá.', dm:'~2 kg/m²' },
    { code:'Sikalastic 1K', name:'Màng chống thấm lỏng PU một thành phần', spec:'Thùng 20kg', desc:'Màng chống thấm gốc PU, đàn hồi cao, chịu UV.', dm:'1 kg/m²/lớp' },
    { code:'Sika Latex', name:'Phụ gia chống thấm', spec:'Can 5L/25L', desc:'Phụ gia trộn vữa chống thấm, tăng kết dính, chống thấm.', dm:'0,5L/bao xi măng' },
    { code:'Sikaflex 11FC', name:'Keo trám khe đa năng', spec:'Ống 600ml', desc:'Keo PU trám khe co giãn, chịu thời tiết khắc nghiệt.', dm:'Theo khe hở' },
    { code:'SikaGrout 214', name:'Vữa rót tự chảy không co ngót', spec:'Bao 25kg', desc:'Rót móng máy, neo bulon. Cường độ cao, không co ngót.', dm:'~1 m²/25kg' },
  ],
  dulux: [
    { code:'WeatherShield', name:'Sơn ngoại thất chống thấm cao cấp', spec:'Thùng 18L', desc:'Chống thấm, chống kiềm, bền màu ngoài trời. Công nghệ bảo vệ vượt trội.', dm:'12-14 m²/lớp' },
    { code:'Inspire', name:'Sơn nội thất cao cấp', spec:'Thùng 18L', desc:'Sơn nội thất sang trọng, lau sạch vết bẩn dễ dàng.', dm:'14-16 m²/lớp' },
    { code:'5in1', name:'Sơn nội thất đa năng', spec:'Thùng 18L', desc:'5 tác dụng: chống kiềm, chống bám bụi, dễ lau chùi, bền màu, phủ tốt.', dm:'14-16 m²/lớp' },
    { code:'Ambiance', name:'Sơn nội thất cao cấp nhất', spec:'Thùng 18L', desc:'Không mùi, chống khuẩn, siêu bền. Dòng sơn cao cấp nhất của Dulux.', dm:'12-14 m²/lớp' },
  ],
  jotun: [
    { code:'Majestic', name:'Sơn nội thất cao cấp', spec:'Thùng 18L', desc:'Sơn nội thất sang trọng với bảng màu rộng. Độ phủ cao.', dm:'12-14 m²/lớp' },
    { code:'Jotashield', name:'Sơn ngoại thất chống thấm', spec:'Thùng 18L', desc:'Chống thấm, chống kiềm, chống bám bụi cho tường ngoài.', dm:'10-12 m²/lớp' },
    { code:'Gardex', name:'Sơn ngoại thất chất lượng', spec:'Thùng 18L', desc:'Sơn ngoại thất chống thấm giá phải chăng, chất lượng tốt.', dm:'12-14 m²/lớp' },
    { code:'Fenomastic', name:'Sơn nội thất giá cạnh tranh', spec:'Thùng 18L', desc:'Sơn nội thất chất lượng, giá thành hợp lý.', dm:'14-16 m²/lớp' },
  ],
  kova: [
    { code:'CT11', name:'Chống thấm hai thành phần xi măng-polymer', spec:'Bộ 25kg', desc:'Chống thấm sàn mái, nhà vệ sinh, hồ bơi. Chất lượng cao.', dm:'0,5-0,8 kg/m²/lớp' },
    { code:'CT22', name:'Chống thấm Acrylic', spec:'Thùng 18kg', desc:'Chống thấm tường ngoài, ban công. Dễ thi công.', dm:'~10 m²/lớp' },
    { code:'NC', name:'Sơn nội thất', spec:'Thùng 18L', desc:'Sơn nước nội thất chất lượng cao, bền đẹp.', dm:'14-16 m²/lớp' },
    { code:'KC', name:'Sơn ngoại thất', spec:'Thùng 18L', desc:'Sơn nước ngoại thất, chống thấm, bền màu theo thời gian.', dm:'12-14 m²/lớp' },
  ],
  nippon: [
    { code:'Matex', name:'Sơn nội thất', spec:'Thùng 18L', desc:'Sơn nước nội thất chất lượng tốt, giá thành hợp lý, phủ cao.', dm:'14-16 m²/lớp' },
    { code:'Weatherbond', name:'Sơn ngoại thất chống thấm', spec:'Thùng 18L', desc:'Chống thấm, chống kiềm, bền màu ngoài trời.', dm:'12-14 m²/lớp' },
    { code:'SuperTech', name:'Sơn nội thất cao cấp', spec:'Thùng 18L', desc:'Không mùi, lau chùi dễ dàng, siêu bền.', dm:'12-14 m²/lớp' },
    { code:'Gold', name:'Sơn ngoại thất cao cấp', spec:'Thùng 18L', desc:'Bảo vệ tường vượt trội, 15 năm bền màu.', dm:'10-12 m²/lớp' },
  ],
};

// Count products
for (const b of BRANDS) {
  const data = PRODUCTS[b.id];
  if (Array.isArray(data)) b.count = data.length;
  else { let c=0; for(const k in data) c+=data[k].length; b.count = c; }
}

const PRICES = [
  { brand:'Munich', product:'G20 - Màng chống thấm đàn hồi 200%', spec:'Bộ 26kg', price:'Liên hệ' },
  { brand:'Munich', product:'G20C - Siêu cứng hiệu ứng lá sen', spec:'Bộ 20kg', price:'Liên hệ' },
  { brand:'Munich', product:'PU S700 - Chống thấm PU đàn hồi 700%', spec:'Thùng 18L', price:'Liên hệ' },
  { brand:'Munich', product:'AC02 - Chống thấm Acrylic', spec:'Thùng 18kg', price:'Liên hệ' },
  { brand:'Munich', product:'Latex S - Phụ gia kết nối', spec:'Can 5kg', price:'Liên hệ' },
  { brand:'Munich', product:'Luxury - Sơn siêu bóng nội thất', spec:'Thùng 18L', price:'Liên hệ' },
  { brand:'Munich', product:'UV20 - Sơn chống nóng', spec:'Thùng 18L', price:'Liên hệ' },
  { brand:'Nano House', product:'Nano Interior - Sơn nội thất', spec:'Thùng 18L', price:'Liên hệ' },
  { brand:'Nano House', product:'ProGuard - Sơn chống thấm', spec:'Thùng 18L', price:'Liên hệ' },
  { brand:'Sika', product:'Sikalastic 1K', spec:'Thùng 20kg', price:'Liên hệ' },
  { brand:'Sika', product:'Sika Top 107', spec:'Bao 25kg', price:'Liên hệ' },
  { brand:'Dulux', product:'WeatherShield', spec:'Thùng 18L', price:'Liên hệ' },
  { brand:'Jotun', product:'Jotashield', spec:'Thùng 18L', price:'Liên hệ' },
  { brand:'Kova', product:'CT11 Chống thấm', spec:'Bộ 25kg', price:'Liên hệ' },
  { brand:'Nippon', product:'Weatherbond', spec:'Thùng 18L', price:'Liên hệ' },
];
