/* TRẦN HỮU MINH — DỮ LIỆU SẢN PHẨM */
const PRODUCTS = {
  munich: [
    { code: "G20", name: "Chống thấm đàn hồi 200%", spec: "Bộ 26kg (bột 16 + nước 10)", desc: "Chống thấm 2TP xi măng-polyme. Đàn hồi cao. Dùng cho tầng hầm, sàn mái, bể nước, WC, ban công.", dm: "0,6kg/m², 2-3 lớp" },
    { code: "G20C", name: "Siêu cứng, siêu bám dính, lá sen", spec: "Bộ 20kg (bột 15 + nước 5)", desc: "Hiệu ứng lá sen, chống thấm cao cấp. Giống G20. 8m²/4 lớp.", dm: "0,6-1kg/m²/lớp" },
    { code: "C20", name: "Siêu cứng cải tiến", spec: "Thùng 20kg", desc: "Làm lót cho PU S700/S400/AC02. Chống thấm hiệu quả.", dm: "0,6-1kg/m²/lớp" },
    { code: "G20C-Đen", name: "Bể cá Koi", spec: "Bộ 20kg", desc: "Màu đen cho bể cá Koi. Cơ chế thở chống phồng rộp.", dm: "0,6-1kg/m²/lớp" },
    { code: "CT0", name: "Acrylic sàn pha xi măng", spec: "Lon 5kg / Thùng 18kg", desc: "Chống thấm Acrylic sàn mái, ban công, tường ngoài, thay sơn NT.", dm: "1kg+0,5kgX+0,3kg nước" },
    { code: "PU S700", name: "PU 1TP gốc nước đàn hồi 700%", spec: "Lon 1L/4L / Thùng 18L", desc: "Chống thấm lộ thiên. 1000+ màu. Chịu UV.", dm: "0,75kg/m²/lớp" },
    { code: "PU S400", name: "PU 1TP đàn hồi 400%", spec: "Lon 5L / Thùng 18L", desc: "Giống S700, đàn hồi thấp hơn, giá rẻ hơn.", dm: "~6m²/lớp" },
    { code: "EP12 Lót", name: "Lót Epoxy gốc nước", spec: "Bộ 25kg/5kg", desc: "Lót cho PU S700/S400. Không độc, không mùi. ~150m²/lớp.", dm: "~150m²/lớp" },
    { code: "Walling", name: "Chống thấm tinh thể gốc nước", spec: "Chai 1L / Can 5L/25L", desc: "Thẩm thấu kỵ nước. Chống muối hóa cho gạch, ngói, bê tông.", dm: "2-3m²/lớp" },
    { code: "Stone SF", name: "Chống thấm tinh thể gốc dầu", spec: "Lon 1L/4L / Thùng 18L", desc: "Giống Walling gốc dầu. Lưu ý: không lăn sơn nước được.", dm: "1-10m²/lớp" },
    { code: "G10", name: "Bitum-Polyme nhựa đường", spec: "Thùng 18kg / Lon 3,5kg", desc: "Lót 0,2-0,3. Phủ 0,6kg/m²/lớp. Mái bằng, tầng hầm, WC.", dm: "Theo hướng dẫn" },
    { code: "S902", name: "Sơn sàn PU kho lạnh", spec: "Bộ 5kg/25kg", desc: "Chịu sốc nhiệt. Dùng bê tông/kim loại/gỗ/đá/nhựa.", dm: "1kg/1m²/2 lớp" },
    { code: "Latex S", name: "Phụ gia kết nối chống thấm", spec: "Can 5KG/25KG", desc: "Làm hồ dầu, vữa trát chống thấm.", dm: "Theo hướng dẫn" },
    { code: "EP11", name: "Sơn Epoxy công nghiệp", spec: "Bộ 15kg/3kg (Lót + Phủ)", desc: "Epoxy gốc dung môi. Sàn nhà xưởng, bãi đỗ xe.", dm: "~100m²/lớp" },
    { code: "G20S", name: "Đàn hồi 200% (loại đặc biệt)", spec: "Bộ 25kg (bột 16 + dd 9)", desc: "Giống G20. Chống thấm đa năng.", dm: "0,6kg/m², 2-3 lớp" },
    { code: "Kyton K101", name: "Chống thấm tinh thể thẩm thấu", spec: "Bao 20kg", desc: "Chống thấm thuận & nghịch. Hố pit, bể ngầm.", dm: "2-5kg/m²" },
    { code: "Water Plug", name: "Đông cứng nhanh", spec: "Túi 1kg", desc: "Trám vá, bịt kín lỗ rò rỉ tức thời.", dm: "Tức thời" },
    { code: "Grout G650", name: "Vữa rót tự chảy không co ngót", spec: "Bao 25kg / Túi 4kg", desc: "Đổ cổ ống PVC, hộp kỹ thuật.", dm: "1m³=76 bao" },
  ],
  nano: [
    { code: "Nano CT01", name: "Chống thấm Nano House", spec: "Thùng 20kg", desc: "Chống thấm gốc Nano cho mọi bề mặt. Thân thiện môi trường.", dm: "0,5-0,8kg/m²" },
    { code: "Nano CT02", name: "Chống thấm sàn mái", spec: "Bộ 25kg", desc: "Chuyên dụng sàn mái, ban công, sân thượng.", dm: "0,6kg/m²/lớp" },
    { code: "Nano CT03", name: "Chống thấm WC", spec: "Bộ 20kg", desc: "Chống thấm nhà vệ sinh, phòng tắm.", dm: "0,6kg/m²" },
    { code: "Nano ST", name: "Sơn chống thấm ngoại thất", spec: "Thùng 18L", desc: "Sơn nước chống thấm ngoài trời. Bền màu.", dm: "12-14m²/lớp" },
    { code: "Nano NT", name: "Sơn nội thất cao cấp", spec: "Thùng 18L", desc: "Sơn nước nội thất, lau chùi được. Ít mùi.", dm: "14-16m²/lớp" },
    { code: "Nano Latex", name: "Hồ dầu kết nối", spec: "Can 5kg", desc: "Phụ gia kết nối chống thấm đa năng.", dm: "Theo hướng dẫn" },
  ],
  sika: [
    { code: "Sika Top 107", name: "Vữa sửa chữa bê tông", spec: "Bao 25kg", desc: "Vữa gốc xi măng polymer, sửa chữa bê tông hư hỏng.", dm: "~2kg/m²" },
    { code: "Sikalastic 1K", name: "Màng chống thấm lỏng PU", spec: "Thùng 20kg", desc: "Màng chống thấm 1TP gốc PU, đàn hồi cao, chịu UV.", dm: "1kg/m²/lớp" },
    { code: "Sika Latex", name: "Phụ gia chống thấm", spec: "Can 5L/25L", desc: "Phụ gia trộn vữa chống thấm, tăng kết dính.", dm: "0,5L/bao xi măng" },
    { code: "Sikaflex 11FC", name: "Keo trám khe đa năng", spec: "Ống 600ml", desc: "Keo PU trám khe co giãn, chịu thời tiết.", dm: "Theo khe hở" },
    { code: "SikaGrout 214", name: "Vữa rót tự chảy", spec: "Bao 25kg", desc: "Rót móng máy, neo bulon. Không co ngót.", dm: "~1m²/25kg" },
  ],
  dulux: [
    { code: "Dulux WeatherShield", name: "Sơn ngoại thất cao cấp", spec: "Thùng 18L", desc: "Chống thấm, chống kiềm, bền màu ngoài trời.", dm: "12-14m²/lớp" },
    { code: "Dulux Inspire", name: "Sơn nội thất cao cấp", spec: "Thùng 18L", desc: "Sơn nội thất sang trọng, lau sạch vết bẩn.", dm: "14-16m²/lớp" },
    { code: "Dulux 5in1", name: "Sơn nội thất đa năng", spec: "Thùng 18L", desc: "5 tác dụng - chống kiềm, chống bám bụi, dễ lau.", dm: "14-16m²/lớp" },
    { code: "Dulux Ambiance", name: "Sơn nội thất cao cấp nhất", spec: "Thùng 18L", desc: "Không mùi, chống khuẩn, siêu bền.", dm: "12-14m²/lớp" },
  ],
  jotun: [
    { code: "Jotun Majestic", name: "Sơn nội thất cao cấp", spec: "Thùng 18L", desc: "Sơn nội thất sang trọng. Bảng màu rộng.", dm: "12-14m²/lớp" },
    { code: "Jotun Jotashield", name: "Sơn ngoại thất chống thấm", spec: "Thùng 18L", desc: "Chống thấm, chống kiềm, chống bám bụi.", dm: "10-12m²/lớp" },
    { code: "Jotun Gardex", name: "Sơn ngoại thất", spec: "Thùng 18L", desc: "Chống thấm ngoài trời, giá phải chăng.", dm: "12-14m²/lớp" },
    { code: "Jotun Fenomastic", name: "Sơn nội thất", spec: "Thùng 18L", desc: "Sơn nội thất chất lượng, giá cạnh tranh.", dm: "14-16m²/lớp" },
  ],
  kova: [
    { code: "Kova CT11", name: "Chống thấm 2TP xi măng-polyme", spec: "Bộ 25kg", desc: "Chống thấm sàn mái, WC, hồ bơi.", dm: "0,5-0,8kg/m²/lớp" },
    { code: "Kova CT22", name: "Chống thấm Acrylic", spec: "Thùng 18kg", desc: "Chống thấm tường ngoài, ban công.", dm: "~10m²/lớp" },
    { code: "Kova NC", name: "Sơn nội thất", spec: "Thùng 18L", desc: "Sơn nước nội thất chất lượng cao.", dm: "14-16m²/lớp" },
    { code: "Kova KC", name: "Sơn ngoại thất", spec: "Thùng 18L", desc: "Sơn nước ngoại thất, chống thấm, bền màu.", dm: "12-14m²/lớp" },
  ],
  nippon: [
    { code: "Nippon Paint Matex", name: "Sơn nội thất", spec: "Thùng 18L", desc: "Sơn nước nội thất chất lượng, giá tốt.", dm: "14-16m²/lớp" },
    { code: "Nippon Paint Weatherbond", name: "Sơn ngoại thất", spec: "Thùng 18L", desc: "Chống thấm, chống kiềm, bền màu ngoài trời.", dm: "12-14m²/lớp" },
    { code: "Nippon Paint SuperTech", name: "Sơn nội thất cao cấp", spec: "Thùng 18L", desc: "Không mùi, lau chùi dễ dàng.", dm: "12-14m²/lớp" },
    { code: "Nippon Paint Gold", name: "Sơn ngoại thất cao cấp", spec: "Thùng 18L", desc: "Bảo vệ tường vượt trội, 15 năm bền màu.", dm: "10-12m²/lớp" },
  ]
};

// Product count per brand
const BRAND_INFO = [
  { id: "munich", name: "Munich", icon: "⭐", color: "#e94560", desc: "Chống thấm & Sơn công nghiệp", count: 18 },
  { id: "nano", name: "Nano House", icon: "🏡", color: "#0fb9b1", desc: "Sơn & Chống thấm Nano", count: 6 },
  { id: "sika", name: "Sika", icon: "🧪", color: "#6c5ce7", desc: "Vữa & Chống thấm", count: 5 },
  { id: "dulux", name: "Dulux", icon: "🎨", color: "#0984e3", desc: "Sơn nội & ngoại thất", count: 4 },
  { id: "jotun", name: "Jotun", icon: "🖌️", color: "#f39c12", desc: "Sơn nội & ngoại thất", count: 4 },
  { id: "kova", name: "Kova", icon: "🏺", color: "#e17055", desc: "Chống thấm & Sơn nước", count: 4 },
  { id: "nippon", name: "Nippon", icon: "🇯🇵", color: "#00b894", desc: "Sơn nội & ngoại thất", count: 4 },
];

// Price data
const PRICES = [
  { brand: "Munich", product: "G20 Chống thấm 2TP", spec: "Bộ 26kg", price: "Liên hệ" },
  { brand: "Munich", product: "G20C Siêu cứng lá sen", spec: "Bộ 20kg", price: "Liên hệ" },
  { brand: "Munich", product: "PU S700 Chống thấm PU", spec: "Thùng 18L", price: "Liên hệ" },
  { brand: "Munich", product: "AC02 Chống thấm Acrylic", spec: "Thùng 18kg", price: "~2.874.000đ" },
  { brand: "Munich", product: "Latex S Phụ gia kết nối", spec: "Can 5KG", price: "Liên hệ" },
  { brand: "Munich", product: "EP12 Lót Epoxy gốc nước", spec: "Bộ 25kg", price: "Liên hệ" },
  { brand: "Nano House", product: "Chống thấm CT01", spec: "Thùng 20kg", price: "Liên hệ" },
  { brand: "Nano House", product: "Sơn nội thất ST", spec: "Thùng 18L", price: "Liên hệ" },
  { brand: "Sika", product: "Sikalastic 1K", spec: "Thùng 20kg", price: "Liên hệ" },
  { brand: "Dulux", product: "WeatherShield", spec: "Thùng 18L", price: "Liên hệ" },
  { brand: "Jotun", product: "Jotashield", spec: "Thùng 18L", price: "Liên hệ" },
  { brand: "Kova", product: "CT11 Chống thấm", spec: "Bộ 25kg", price: "Liên hệ" },
  { brand: "Nippon", product: "Weatherbond", spec: "Thùng 18L", price: "Liên hệ" },
];
