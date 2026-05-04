/* DỮ LIỆU SẢN PHẨM - TRẦN HỮU MINH */
const BRANDS = [
  { id:'munich', name:'Munich', icon:'⭐', color:'#e94560', desc:'Chống thấm & Sơn công nghiệp - Phân phối chính thức', count:43 },
  { id:'nano', name:'Nano House', icon:'🏡', color:'#0fb9b1', desc:'Sơn & Chống thấm công nghệ Nano - Phân phối chính thức', count:22 },
  { id:'sika', name:'Sika', icon:'🧪', color:'#6c5ce7', desc:'Vữa kỹ thuật & Chống thấm', count:5 },
  { id:'dulux', name:'Dulux', icon:'🎨', color:'#0984e3', desc:'Sơn nội thất & ngoại thất', count:30 },
  { id:'jotun', name:'Jotun', icon:'🖌️', color:'#f39c12', desc:'Sơn nội thất & ngoại thất cao cấp', count:24 },
  { id:'kova', name:'Kova', icon:'🏺', color:'#e17055', desc:'Chống thấm & Sơn nước', count:21 },
  { id:'nippon', name:'Nippon', icon:'🇯🇵', color:'#00b894', desc:'Sơn nội thất & ngoại thất', count:19 },
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
  nano: {
    "Sơn phủ nội thất": [
      { code:'NO1', name:'SUPER INTERIOR - Sơn siêu bóng nội thất thượng hạng', spec:'15L / 5L / 1L', desc:'Bóng ngọc trai, bền màu gấp 3 lần, lau chùi hiệu quả, kháng khuẩn, chống nấm mốc. Sơn sinh thái eco, không APO, phooc môn, kim loại nặng.', dm:'Theo hướng dẫn nhà sản xuất' },
      { code:'NO2', name:'ECO NANO GUARD - Sơn bóng nội thất cao cấp', spec:'18L / 5L', desc:'Công nghệ nano, màng sơn bóng công nghệ mới, lau chùi hiệu quả, kháng khuẩn, chống nấm mốc, an toàn sức khỏe.', dm:'Theo hướng dẫn nhà sản xuất' },
      { code:'NO3', name:'ECO NANO GLOSSY - Sơn bóng nội thất cao cấp', spec:'18L / 5L', desc:'Công nghệ nano, lau chùi hiệu quả, kháng khuẩn, chống nấm mốc, màu sắc sắc nét, thân thiện môi trường.', dm:'Theo hướng dẫn nhà sản xuất' },
      { code:'NO4', name:'ECO NANO CLEAN - Sơn bóng nội thất đặc biệt', spec:'18L / 5L', desc:'Công nghệ nano, lau chùi hiệu quả, chống nấm mốc, màu sắc sắc nét, thân thiện môi trường.', dm:'Theo hướng dẫn nhà sản xuất' },
      { code:'NO5', name:'ECO CLASSIC - Sơn mịn nội thất cao cấp', spec:'18L / 5L', desc:'Màng sơn mịn, dễ lau chùi, không chì, thủy ngân, kim loại nặng, chống nấm mốc.', dm:'Theo hướng dẫn nhà sản xuất' },
      { code:'NO6', name:'ECO SUPER WHITE - Sơn siêu trắng trần', spec:'18L / 5L', desc:'Siêu trắng sáng, chống nấm mốc hiệu quả, độ phủ cao.', dm:'Theo hướng dẫn nhà sản xuất' },
      { code:'NO7', name:'ECO REGULAR - Sơn nội – ngoại thất đặc biệt', spec:'18L / 5L', desc:'Màng sơn mờ, độ phủ cao, dễ thi công, màu sắc đẹp và đa dạng.', dm:'Theo hướng dẫn nhà sản xuất' },
    ],
    "Sơn phủ ngoại thất": [
      { code:'NA1', name:'SUPER EXTERIOR - Sơn siêu bóng ngoại thất thượng hạng', spec:'5L / 1L', desc:'Chống bám bụi, bền màu gấp 5 lần, giảm nhiệt chống nóng, chống thấm, chống nấm mốc, kháng tia UV, cọ rửa tối đa. Sơn sinh thái eco.', dm:'Theo hướng dẫn nhà sản xuất' },
      { code:'NA2', name:'ECO PRIMER EX - Sơn siêu bóng ngoại chống nóng cao cấp', spec:'15L / 5L / 1L', desc:'Chống bám bụi bền màu gấp 3 lần, giảm nhiệt chống nóng hiệu quả, chống thấm, chống nấm mốc, kháng tia UV. Sơn sinh thái eco.', dm:'Theo hướng dẫn nhà sản xuất' },
      { code:'NA3', name:'ECO NANO SHIELD - Sơn bóng ngoại thất cao cấp', spec:'15L / 5L', desc:'Lau chùi hiệu quả, màng sơn tự làm sạch, chống thấm, chống rong rêu nấm mốc, an toàn sức khỏe.', dm:'Theo hướng dẫn nhà sản xuất' },
      { code:'NA4', name:'ECO PLATIUM - Sơn mịn ngoại thất cao cấp', spec:'18L / 5L', desc:'Màu sắc rực rỡ, dễ lau chùi, bền màu, kháng khuẩn, màng sơn láng mịn, chịu thời tiết khắc nghiệt.', dm:'Theo hướng dẫn nhà sản xuất' },
      { code:'NA5', name:'ECO CLEAR - Sơn siêu bóng ngoại chống nóng cao cấp', spec:'5L / 1L', desc:'Phủ bóng trong suốt, lau chùi hiệu quả tối đa, màng bóng đẹp trang trí và bảo vệ màng sơn trong.', dm:'Theo hướng dẫn nhà sản xuất' },
      { code:'NA6', name:'ECO PROGUARD - Sơn chống thấm cao cấp', spec:'18L / 5L', desc:'Chống thấm cho sàn, mái, tường đứng, khu WC. Tăng tuổi thọ công trình.', dm:'Theo hướng dẫn nhà sản xuất' },
      { code:'NA7', name:'ECO PROGUARD MÀU - Sơn chống thấm màu cao cấp', spec:'18L / 5L', desc:'Chống thấm đa màu Acrylic kết hợp silicone gốc nước, chống thấm tối ưu, màu bền đẹp.', dm:'Theo hướng dẫn nhà sản xuất' },
    ],
    "Sơn lót chống kiềm": [
      { code:'KT1', name:'ECO SEALER - Sơn lót kiềm nội – ngoại thất', spec:'18L / 5L', desc:'Chống kiềm hóa, chống rêu mốc, bảo vệ lớp sơn phủ.', dm:'Theo hướng dẫn nhà sản xuất' },
      { code:'KT2', name:'ECO SEALER - Sơn lót kiềm nội thất đặc biệt', spec:'18L / 5L', desc:'Chống kiềm hóa, chống rêu mốc, độ phủ cao, chống phai màu, bảo vệ lớp sơn phủ.', dm:'Theo hướng dẫn nhà sản xuất' },
      { code:'KT3', name:'INTERIOR - Sơn lót kiềm nội thất cao cấp', spec:'18L / 5L', desc:'Chống kiềm hoàn hảo, độ phủ cao, chống rêu mốc, tăng bám dính, bảo vệ lớp sơn màu.', dm:'Theo hướng dẫn nhà sản xuất' },
      { code:'KN1', name:'EX-MASTER - Sơn lót kiềm ngoại thất đặc biệt', spec:'18L / 5L', desc:'Chống kiềm và muối hóa hoàn hảo, chống rêu mốc, tăng gấp 2 bám dính cho sơn màu.', dm:'Theo hướng dẫn nhà sản xuất' },
      { code:'KN2', name:'EX-TERIOR - Sơn lót kiềm ngoại thất cao cấp', spec:'18L / 5L', desc:'Chống kiềm và muối hóa hoàn hảo, độ phủ cao, chống rêu mốc, tăng gấp 2 bám dính.', dm:'Theo hướng dẫn nhà sản xuất' },
      { code:'KN3', name:'ECO PRIMER - Sơn lót kiềm ngoại thất thượng hạng', spec:'18L / 5L', desc:'Siêu chống kiềm, chống muối hóa hoàn hảo, độ phủ cao, chống rêu mốc, bảo vệ màu, tăng gấp 2 bám dính.', dm:'Theo hướng dẫn nhà sản xuất' },
    ],
    "Bột bả": [
      { code:'B1', name:'HOME COAT - Bột bả trong và ngoài cao cấp', spec:'40kg', desc:'Bột bả trong và ngoài cao cấp.', dm:'Theo hướng dẫn nhà sản xuất' },
      { code:'B2', name:'LEVEN COAT - Bột bả chống thấm cao cấp', spec:'40kg', desc:'Bột bả chống thấm cao cấp.', dm:'Theo hướng dẫn nhà sản xuất' },
    ],
  },
  sika: {
    "🧪 Chống thấm & Vữa": [
      { code:'Sika Top 107', name:'Vữa sửa chữa bê tông', spec:'Bao 25kg', desc:'Vữa gốc xi măng polymer. Sửa chữa bê tông hư hỏng, trám vá.', dm:'~2 kg/m²' },
      { code:'Sikalastic 1K', name:'Màng chống thấm lỏng PU một thành phần', spec:'Thùng 20kg', desc:'Màng chống thấm gốc PU, đàn hồi cao, chịu UV.', dm:'1 kg/m²/lớp' },
      { code:'Sika Latex', name:'Phụ gia chống thấm', spec:'Can 5L/25L', desc:'Phụ gia trộn vữa chống thấm, tăng kết dính, chống thấm.', dm:'0,5L/bao xi măng' },
      { code:'SikaGrout 214', name:'Vữa rót tự chảy không co ngót', spec:'Bao 25kg', desc:'Rót móng máy, neo bulon. Cường độ cao, không co ngót.', dm:'~1 m²/25kg' },
    ],
    "🔧 Keo & Phụ kiện": [
      { code:'Sikaflex 11FC', name:'Keo trám khe đa năng', spec:'Ống 600ml', desc:'Keo PU trám khe co giãn, chịu thời tiết khắc nghiệt.', dm:'Theo khe hở' },
    ],
  },
  dulux: {
    "🛡️ Ngoại thất siêu cao cấp": {
      "Weathershield Royal Shine": [
        { code:'WS-RoyalShine', name:'Weathershield Royal Shine - Chống vệt bẩn, chống bám bụi', spec:'1L / 5L', desc:'Chống vệt bẩn, chống bám bụi, chống rêu mốc mạnh gấp 3 lần. Chống kiềm hóa, chống phai màu. Bảo vệ màng sơn 12 năm.', dm:'Theo hướng dẫn' },
      ],
      "Weathershield Powerflexx": [
        { code:'WS-Powerflexx', name:'Weathershield Powerflexx - Màng co giãn gấp 6 lần', spec:'1L / 5L', desc:'Màng sơn co giãn gấp 6 lần, chống rạn nứt, chống thấm vượt trội, chống kiềm hóa, chống phai màu, chống rêu mốc.', dm:'Theo hướng dẫn' },
      ],
    },
    "🛡️ Ngoại thất cao cấp": {
      "Weathershield": [
        { code:'WS-CaoCap', name:'Weathershield Cao cấp - Chống rêu mốc, chống phai màu', spec:'1L / 5L / 15L', desc:'Chống rêu mốc dài lâu gấp 2 lần. Chống kiềm hóa, chống phai màu, chống bám bẩn, chống thấm.', dm:'Theo hướng dẫn' },
      ],
      "Weathershield Colour": [
        { code:'WS-Colour', name:'Weathershield Colour - Chống phai màu vượt trội', spec:'15L', desc:'Chống phai màu vượt trội, chống kiềm hóa, chống thấm, chống bám bẩn, chống rêu mốc.', dm:'Theo hướng dẫn' },
      ],
      "Inspire Ngoại thất": [
        { code:'IN-NgoaiThat-Bong', name:'Inspire Ngoại thất Bóng', spec:'5L', desc:'Màng sơn bền chắc, chống rêu mốc, chống bong tróc, bề mặt láng mịn, che phủ tốt.', dm:'Theo hướng dẫn' },
        { code:'IN-NgoaiThat-Mo', name:'Inspire Ngoại thất Mờ', spec:'5L / 15L / 18L', desc:'Màng sơn bền chắc, chống rêu mốc, bề mặt láng mịn, che phủ tốt.', dm:'Theo hướng dẫn' },
      ],
    },
    "🎨 Nội thất siêu cao cấp": {
      "Ambiance Breathing": [
        { code:'AM-Breathing', name:'Ambiance Breathing - Sơn sinh học 22% gốc sinh học', spec:'5L', desc:'22% thành phần gốc sinh học (than tre hoạt tính). Vô hiệu hóa formaldehyde, benzene, VOC. Bảo vệ sức khỏe.', dm:'Theo hướng dẫn' },
      ],
      "Ambiance 5in1 Superflexx": [
        { code:'AM-5in1-SieuBong', name:'Ambiance 5in1 Superflexx Siêu Bóng', spec:'1L / 3L', desc:'Màng sơn co giãn gấp 3 lần che lấp khe nứt nhỏ. Kháng khuẩn, ngăn ngừa nấm mốc.', dm:'Theo hướng dẫn' },
        { code:'AM-5in1-BongMo', name:'Ambiance 5in1 Superflexx Bóng Mờ', spec:'1L / 3L / 5L / 8L', desc:'Giải pháp toàn diện về trang trí và bảo vệ.', dm:'Theo hướng dẫn' },
      ],
      "Ambiance 5in1 Diamond Glow": [
        { code:'AM-DiamondGlow', name:'Ambiance 5in1 Diamond Glow Siêu Bóng', spec:'1L / 5L', desc:'Màu sắc rực rỡ, sắc nét, bền màu. Bề mặt láng mịn tuyệt hảo.', dm:'Theo hướng dẫn' },
      ],
    },
    "🎨 Nội thất cao cấp": {
      "EasyClean Chống Bám Bẩn": [
        { code:'EC-ChongBan-Bong', name:'EasyClean Chống Bám Bẩn Kháng Virus (Bóng)', spec:'1L / 5L / 15L', desc:'Kháng Virus & vi khuẩn. Chủ động chống bám bẩn, lau chùi cực hiệu quả. Bề mặt láng mịn, ngăn ngừa nấm mốc.', dm:'Theo hướng dẫn' },
        { code:'EC-ChongBan-Mo', name:'EasyClean Chống Bám Bẩn Kháng Virus (Mờ)', spec:'1L / 5L / 15L', desc:'Kháng Virus. Chống bám bẩn, lau chùi hiệu quả. Bề mặt mờ sang trọng.', dm:'Theo hướng dẫn' },
      ],
      "EasyClean Lau Chùi Vượt Trội": [
        { code:'EC-LauChuiVT-Bong', name:'EasyClean Lau Chùi Vượt Trội Kháng Virus (Bóng)', spec:'1L / 5L / 15L', desc:'Kháng Virus, lau chùi vượt trội, kháng khuẩn. Công nghệ Colourguard bảo vệ màng sơn.', dm:'Theo hướng dẫn' },
        { code:'EC-LauChuiVT-Mo', name:'EasyClean Lau Chùi Vượt Trội Kháng Virus (Mờ)', spec:'5L / 15L', desc:'Kháng Virus, lau chùi vượt trội. Bề mặt mờ.', dm:'Theo hướng dẫn' },
      ],
      "Inspire Nội thất MỚI": [
        { code:'IN-NoiThat-Bong-Moi', name:'Inspire Bóng (Mới) - ChromaBrite', spec:'5L', desc:'Công nghệ ChromaBrite giữ màu sắc bền và tươi đẹp. Dễ lau sạch vết bẩn. Chống vi khuẩn & nấm mốc.', dm:'Theo hướng dẫn' },
        { code:'IN-NoiThat-Mo-Moi', name:'Inspire Bóng Mờ (Mới)', spec:'5L', desc:'Công nghệ ChromaBrite. Dễ lau sạch vết bẩn. Chống vi khuẩn & nấm mốc.', dm:'Theo hướng dẫn' },
      ],
    },
    "🎨 Nội thất kinh tế": {
      "EasyClean Lau Chùi Hiệu Quả": [
        { code:'EC-LauChuiHQ-Bong', name:'EasyClean Lau Chùi Hiệu Quả (Bóng)', spec:'1L / 5L / 15L / 18L', desc:'Lau chùi, kháng khuẩn. Công nghệ Colourguard. Bề mặt láng mịn, ngăn ngừa nấm mốc.', dm:'Theo hướng dẫn' },
        { code:'EC-LauChuiHQ-Mo', name:'EasyClean Lau Chùi Hiệu Quả (Mờ)', spec:'1L / 5L / 15L / 18L', desc:'Lau chùi hiệu quả. Công nghệ Colourguard. Bề mặt mờ.', dm:'Theo hướng dẫn' },
      ],
    },
    "🧱 Sơn lót nội thất": [
      { code:'Supersealer', name:'Supersealer - Sơn lót nội thất', spec:'5L / 18L', desc:'Độ bám dính cao, tạo độ nhẵn mịn, chống kiềm, lấp lỗ kim.', dm:'Theo hướng dẫn' },
      { code:'AM-Primer', name:'Ambiance Primer - Lót nội thất cao cấp', spec:'5L / 18L', desc:'Tương thích dòng Ambiance. Bám dính cao, che phủ cao, tăng độ láng mịn.', dm:'Theo hướng dẫn' },
      { code:'IN-Primer', name:'Interior Primer - Lót nội thất', spec:'5L / 18L', desc:'Độ bám dính cao, tăng độ bền màu cho lớp phủ.', dm:'Theo hướng dẫn' },
      { code:'EC-Primer', name:'EasyClean Primer - Lót nội thất', spec:'5L / 15L', desc:'Tương thích dòng EasyClean & Inspire. Bám dính cực tốt.', dm:'Theo hướng dẫn' },
    ],
    "💧 Chống thấm Dulux": [
      { code:'Aquatech-Max', name:'Aquatech Max - Chống thấm sàn thế hệ mới', spec:'5kg / 20kg', desc:'Chống thấm gấp 2 lần. Màng chống thấm dày, co giãn cao, che lấp khe nứt. Không cần pha xi măng.', dm:'Theo hướng dẫn' },
      { code:'Aquatech-Flex', name:'Aquatech Flex - Chống thấm tường thế hệ mới', spec:'6kg / 20kg', desc:'Chống thấm gấp 2 lần. Màng dày, co giãn cao. Không cần pha xi măng.', dm:'Theo hướng dẫn' },
      { code:'Aquatech-VuotTroi', name:'Aquatech Chống thấm Vượt trội', spec:'6kg / 20kg', desc:'Bề mặt dai chắc, bám dính cao, bề mặt sáng đẹp. Pha trộn với xi măng.', dm:'Theo hướng dẫn' },
      { code:'Aquatech-BaoVe', name:'Chống thấm Bảo vệ Cao cấp', spec:'6kg / 20kg', desc:'Chống loang màu do kiềm hóa. Che phủ vết nứt. Không cần pha xi măng.', dm:'Theo hướng dẫn' },
    ],
    "🧱 Bột trét Dulux": [
      { code:'Botret-IN-EX', name:'Bột trét Nội & Ngoại thất', spec:'40kg', desc:'Tạo bề mặt láng mịn, độ bám dính cao.', dm:'Theo hướng dẫn' },
      { code:'Botret-IN', name:'Bột trét Nội thất', spec:'40kg', desc:'Tạo bề mặt láng mịn, độ bám dính cao, dễ thi công.', dm:'Theo hướng dẫn' },
    ],
    "🪵 Gỗ & Kim loại": [
      { code:'SonDau-Maxilite', name:'Sơn Dầu Maxilite cho Gỗ & Kim Loại', spec:'0.75L / 2.5L / 17L', desc:'Bề mặt bóng mịn, nhanh khô, độ phủ cao. Hơn 1.000 màu. Không chì, không thủy ngân.', dm:'Theo hướng dẫn' },
      { code:'Lot-ChongRi', name:'Sơn lót ngăn ngừa rỉ sét Maxilite', spec:'0.8L / 3L', desc:'Ngăn ngừa rỉ sét cho kim loại sắt thép. Tạo bám dính cho lớp hoàn thiện.', dm:'Theo hướng dẫn' },
    ],
  },
  jotun: {
    "🎨 Sơn nội thất": {
      "Majestic": [
        { code:'MJ-NguyenBan', name:'Majestic Đẹp Nguyên Bản - Siêu mờ, siêu bền', spec:'1L / 5L', desc:'Sơn nội thất đẹp nhất từ Jotun: mờ & siêu cao cấp, màu sắc trung thực, không phản quang, siêu bền, lau chùi vượt trội, kháng khuẩn, chống nấm mốc, rất nhẹ mùi.', dm:'Theo hướng dẫn' },
        { code:'MJ-HoanHao-Bong5', name:'Majestic Đẹp Hoàn Hảo Bóng 5%', spec:'1L / 5L / 15L', desc:'Cải tiến vượt trội về bề mặt nhăn mịn và khả năng dễ lau chùi, màu sắc rực rỡ, bền màu, kháng khuẩn, chống nấm mốc.', dm:'Theo hướng dẫn' },
        { code:'MJ-HoanHao-Mo', name:'Majestic Đẹp Hoàn Hảo Mờ', spec:'1L / 5L / 15L', desc:'Cải tiến vượt trội về bề mặt nhăn mịn và khả năng dễ lau chùi, màu sắc rực rỡ, bền màu, kháng khuẩn, chống nấm mốc, nhẹ mùi.', dm:'Theo hướng dẫn' },
      ],
      "Essence": [
        { code:'ES-ChePhu-Bong', name:'Essence Che Phủ Tối Đa Bóng', spec:'1L / 5L / 15L', desc:'Che phủ tối đa, bề mặt láng mịn, dễ lau chùi, chống nấm mốc, VOC thấp, nhẹ mùi, dễ thi công.', dm:'Theo hướng dẫn' },
        { code:'ES-ChePhu-Mo', name:'Essence Che Phủ Tối Đa Mờ', spec:'1L / 5L / 15L', desc:'Che phủ tối đa, bề mặt láng mịn, dễ lau chùi, chống nấm mốc, VOC thấp, nhẹ mùi, dễ thi công.', dm:'Theo hướng dẫn' },
        { code:'ES-SonTrangTran', name:'Essence Sơn Trắng Trần Chuyên Dụng', spec:'3L / 17L', desc:'Chống văng bắn, che phủ tốt, siêu trắng, dễ thi công, chống nấm mốc, VOC thấp, nhẹ mùi.', dm:'Theo hướng dẫn' },
        { code:'ES-DeLauChui', name:'Essence Dễ Lau Chùi', spec:'1L / 5L / 17L', desc:'Dễ lau chùi, nhẹ mùi, chống nấm mốc, VOC thấp, dễ thi công, độ che phủ cao.', dm:'Theo hướng dẫn' },
      ],
      "Jotaplast": [
        { code:'Jotaplast', name:'Jotaplast - Sơn kinh tế', spec:'5L', desc:'Màu tiêu chuẩn và siêu trắng, màng sơn mờ, chống nấm mốc, độ phủ cao, dễ thi công, hiệu quả kinh tế.', dm:'Theo hướng dẫn' },
      ],
    },
    "🛡️ Sơn ngoại thất": {
      "Jotashield": [
        { code:'JS-BenMauToanDien', name:'Jotashield Bền Màu Toàn Diện', spec:'1L / 5L / 15L', desc:'Bảo vệ bền bỉ, bền màu, chống bám bụi tối ưu.', dm:'Theo hướng dẫn' },
        { code:'JS-BenMauToiUu', name:'Jotashield Bền Màu Tối Ưu', spec:'1L / 5L', desc:'Bền màu dài lâu, ít bám bụi, chống rong rêu & nấm mốc, kháng tia UV tối đa.', dm:'Theo hướng dẫn' },
        { code:'JS-SachVuotTroi', name:'Jotashield Sạch Vượt Trội', spec:'1L / 5L / 15L', desc:'Chống bám bụi đột phá, tự làm sạch bề mặt, chống rong rêu & nấm mốc, giảm nhiệt, kháng UV.', dm:'Theo hướng dẫn' },
        { code:'JS-ChePhu-VetNut', name:'Jotashield Che Phủ Vết Nứt', spec:'5L', desc:'Đàn hồi cao cấp, che phủ vết nứt gấp 2 lần, ít bám bụi.', dm:'Theo hướng dẫn' },
        { code:'JS-ChongPhaiMau', name:'Jotashield Chống Phai Màu', spec:'5L / 15L', desc:'Chống nắng hiệu quả, giảm nhiệt, ngăn ngừa vệt nước, chống rong rêu & nấm mốc, chống bám bụi, chống thấm nước.', dm:'Theo hướng dẫn' },
      ],
      "Tough Shield": [
        { code:'TS-Max', name:'Tough Shield Max', spec:'5L / 17L', desc:'Kháng UV, chống rong rêu & nấm mốc, che phủ tốt.', dm:'Theo hướng dẫn' },
      ],
      "Chống thấm": [
        { code:'WaterGuard', name:'Jotun WaterGuard Chống thấm', spec:'20kg', desc:'Kháng thấm tối ưu, độ đàn hồi cao, dễ sử dụng, chống nấm mốc.', dm:'Theo hướng dẫn' },
      ],
    },
    "Sơn gỗ & Kim loại": {
      "Gardex": [
        { code:'Gardex-Primer', name:'Gardex Primer - Sơn lót gỗ', spec:'1L', desc:'Sơn lót Gardex nhẹ mùi, tăng cường độ bám dính.', dm:'Theo hướng dẫn' },
        { code:'Gardex-Bong', name:'Gardex Bóng - Sơn phủ gỗ', spec:'0.8L / 2.5L', desc:'Chống thấm, bền màu, nhẹ mùi, nhanh khô, chống nấm mốc và rỉ sét.', dm:'Theo hướng dẫn' },
      ],
    },
    "🧱 Sơn lót & Bột trét": {
      "Sơn lót": [
        { code:'Lot-Majestic', name:'Sơn lót chống kiềm Majestic', spec:'3L / 5L / 17L', desc:'Sơn lót chống kiềm cao cấp nội thất, tăng cường bám dính.', dm:'Theo hướng dẫn' },
        { code:'Lot-Essence', name:'Sơn lót chống kiềm Essence', spec:'3L / 5L', desc:'Sơn lót chống kiềm nội & ngoại thất, bám dính tốt, dễ thi công.', dm:'Theo hướng dẫn' },
        { code:'Alkyd-Xam', name:'Sơn lót chống rỉ Alkyd màu xám', spec:'5L / 20L', desc:'Sơn lót chống rỉ cho bề mặt kim loại.', dm:'Theo hướng dẫn' },
        { code:'Alkyd-Do', name:'Sơn lót chống rỉ Alkyd màu đỏ', spec:'5L / 20L', desc:'Sơn lót chống rỉ cho bề mặt kim loại.', dm:'Theo hướng dẫn' },
      ],
      "Bột trét": [
        { code:'Putty-IN-EX', name:'Jotun Interior & Exterior Putty', spec:'40kg', desc:'Bột trét cao cấp nội & ngoại thất.', dm:'Theo hướng dẫn' },
        { code:'Putty-EX', name:'Jotun Exterior Putty', spec:'40kg', desc:'Bột trét cao cấp ngoại thất.', dm:'Theo hướng dẫn' },
        { code:'Putty-IN', name:'Jotun Interior Putty', spec:'40kg', desc:'Bột trét cao cấp nội thất.', dm:'Theo hướng dẫn' },
      ],
    },
  },
  kova: {
    "🎨 Sơn nội thất": [
      { code:'K871 GOLD', name:'Sơn bóng nội thất cao cấp', spec:'Thùng 20kg / Lon 4kg', desc:'Sơn bóng GOLD trong nhà, độ phủ cao, bền màu.', dm:'120-140 m²/20kg' },
      { code:'K5500 GOLD', name:'Sơn bóng nội thất', spec:'Thùng 20kg / Lon 4kg', desc:'Sơn bóng trong nhà cao cấp.', dm:'90-100 m²/20kg' },
      { code:'K260 GOLD', name:'Sơn không bóng trong nhà', spec:'Thùng 20kg / Lon 4kg', desc:'Sơn mịn không bóng nội thất chất lượng cao.', dm:'60-70 m²/20kg' },
      { code:'K771 GOLD', name:'Sơn trang trí nội thất', spec:'Thùng 25kg', desc:'Sơn trang trí nội thất độ bám dính cao.', dm:'75-88 m²/25kg' },
      { code:'K10 GOLD', name:'Sơn trần trang trí', spec:'Thùng 25kg', desc:'Sơn trần nhà, tường trang trí cao cấp.', dm:'125-150 m²/25kg' },
      { code:'K109 GOLD', name:'Sơn lót kháng kiềm nội thất', spec:'Thùng 25kg', desc:'Sơn lót kháng kiềm cao cấp trong nhà.', dm:'120-140 m²/25kg' },
    ],
    "🛡️ Sơn ngoại thất & Chống thấm": [
      { code:'K360 GOLD', name:'Sơn bóng ngoại thất cao cấp', spec:'Thùng 20kg / Lon 4kg', desc:'Sơn bóng cao cấp ngoại thất, chịu thời tiết khắc nghiệt.', dm:'120-140 m²/20kg' },
      { code:'CT04T GOLD', name:'Sơn trang trí chống thấm ngoại thất', spec:'Thùng 20kg', desc:'Sơn trang trí, chống thấm cao cấp ngoài trời.', dm:'100-110 m²/20kg' },
      { code:'K5800 GOLD', name:'Sơn bóng ngoại thất', spec:'Thùng 20kg', desc:'Sơn bóng ngoại thất bền màu, chịu thời tiết.', dm:'Theo hướng dẫn' },
      { code:'CT-11A GOLD', name:'Chống thấm xi măng, bê tông', spec:'Thùng 20kg / Lon 4kg', desc:'Chống thấm sàn mái, tường, toilet, bể nước bằng xi măng polymer.', dm:'Tùy bề mặt' },
      { code:'CT-11B GOLD', name:'Phụ gia chống thấm xi măng', spec:'Thùng 19kg / Lon 3.8kg', desc:'Phụ gia trộn vữa xi măng, bê tông chống thấm.', dm:'Tùy bề mặt' },
      { code:'CT-14 GOLD', name:'Chống thấm co giãn chống áp lực ngược', spec:'Thùng 20kg / Lon 4kg', desc:'Chất chống thấm co giãn, chống áp lực ngược cho xi măng, bê tông.', dm:'Tùy bề mặt' },
    ],
    "🧱 Bột bả & Sàn": [
      { code:'MTN GOLD', name:'Matit ngoại thất', spec:'Bao 25kg', desc:'Bột bả ngoại thất chống thấm, chống nứt.', dm:'1,2-1,4 kg/m²' },
      { code:'KOVA-BT', name:'Bột bả cao cấp trong nhà', spec:'Bao 40kg', desc:'Bột bả trong nhà cao cấp, độ bám dính cao.', dm:'0,9-1,0 kg/m²' },
      { code:'KOVA-BN', name:'Bột bả cao cấp ngoại thất', spec:'Bao 40kg', desc:'Bột bả ngoại thất cao cấp, chống thấm.', dm:'0,9-1,0 kg/m²' },
      { code:'MB-T', name:'Bột bả trong nhà', spec:'Bao 25kg', desc:'Bột bả trong nhà, chất lượng kinh tế.', dm:'0,8-1,0 kg/m²' },
      { code:'MB-N', name:'Bột bả ngoại thất', spec:'Bao 25kg', desc:'Bột bả ngoại thất, giá hợp lý.', dm:'0,8-1,0 kg/m²' },
      { code:'CT08 GOLD', name:'Sơn sân tennis, sân thể thao', spec:'Thùng 20kg / Lon 4kg', desc:'Sơn sân thể thao đa năng, chịu mài mòn, nhiều màu sắc.', dm:'Tùy bề mặt' },
      { code:'KL55T GOLD', name:'Sơn men bóng phủ sàn trong nhà', spec:'Thùng 20kg / Lon 4kg', desc:'Sơn phủ sàn trong nhà, chịu mài mòn.', dm:'Theo hướng dẫn' },
      { code:'KLST GOLD', name:'Sơn men bóng phủ sàn chịu mài mòn', spec:'Thùng 20kg / Lon 4kg', desc:'Sơn phủ sàn chịu mài mòn cao, hai thành phần.', dm:'2,0-2,5 kg/m²' },
      { code:'TNA GOLD', name:'Chất phủ đệm sàn thể thao', spec:'Bao 25kg', desc:'Chất phủ đệm cho sân tennis, sân thể thao đa năng.', dm:'Tùy bề mặt' },
    ],
  },
  nippon: {
    "Sơn ngoại thất": {
      "Weathergard Siêu Bóng": [
        { code:'WG-SieuBong', name:'Weathergard Siêu Bóng - INFINIMATRIX', spec:'1L / 5L', desc:'Độ bóng cao, chống thấm, Colour Care bền màu x2, Solar Reflective giảm nhiệt.', dm:'Theo hướng dẫn' },
        { code:'WG-SieuBong18L', name:'Weathergard Siêu Bóng (thùng 18L)', spec:'18L', desc:'Cùng INFINIMATRIX, dung tích lớn.', dm:'Theo hướng dẫn' },
      ],
      "Weathergard Plus+": [
        { code:'WG-Plus', name:'Weathergard Plus+ - MicroGel bảo vệ 10 năm', spec:'1L / 5L / 18L', desc:'MicroGel bền bỉ 10 năm. Chống bám bụi. Colour Care bền màu.', dm:'Theo hướng dẫn' },
      ],
      "Weathergard Bóng": [
        { code:'WG-Bong', name:'Weathergard Bóng - TitanGuard', spec:'1L / 5L', desc:'TitanGuard chống bám bụi. Colour Care bền màu. Bảo vệ 8 năm.', dm:'Theo hướng dẫn' },
      ],
      "Weathergard Mờ": [
        { code:'WG-Mo', name:'Weathergard Mờ - thanh lịch bền màu', spec:'1L / 5L / 18L', desc:'Hoàn thiện mờ sang trọng. Chống thấm, chống rêu mốc.', dm:'Theo hướng dẫn' },
      ],
    },
    "Sơn nội thất siêu cao cấp": {
      "Odour-Less All-in-1 Siêu Bóng": [
        { code:'OL-Allin1', name:'Odour-Less All-in-1 Siêu Bóng', spec:'1L / 5L', desc:'INFINIMATRIX. Dễ lau x2. Colour Guard bền màu. Green Label.', dm:'Theo hướng dẫn' },
      ],
      "Odour-Less Bóng Sang Trọng": [
        { code:'OL-BongST', name:'Odour-Less Bóng Sang Trọng - EZWash', spec:'1L / 5L', desc:'EZWash lau chùi tuyệt vời. Kháng khuẩn. Colour Guard bền màu.', dm:'Theo hướng dẫn' },
      ],
      "Odour-Less Mờ Cao Cấp": [
        { code:'OL-Mo', name:'Odour-Less Mờ Cao Cấp', spec:'1L / 5L', desc:'Hoàn thiện mờ. EZWash. Kháng khuẩn.', dm:'Theo hướng dẫn' },
      ],
      "Odour-Less Siêu Trắng": [
        { code:'OL-Trang', name:'Odour-Less Siêu Trắng Mịn', spec:'5L', desc:'Siêu trắng sáng, mịn màng.', dm:'Theo hướng dẫn' },
      ],
    },
    "Sơn nội thất chất lượng": {
      "Matex Bóng": [
        { code:'Matex-Bong', name:'Matex Bóng - Chất lượng cao', spec:'5L / 18L', desc:'Bao phủ cao. Dễ thi công. Mùi nhẹ.', dm:'Theo hướng dẫn' },
      ],
      "Matex Mờ": [
        { code:'Matex-Mo', name:'Matex Mờ - Chất lượng cao', spec:'5L / 18L', desc:'Mờ sang trọng. Bao phủ cao.', dm:'Theo hướng dẫn' },
      ],
      "Vatex Bóng": [
        { code:'Vatex-Bong', name:'Vatex Bóng - Kinh tế', spec:'5L / 18L', desc:'Sơn kinh tế, che phủ và bám dính tốt.', dm:'Theo hướng dẫn' },
      ],
      "Vatex Mờ": [
        { code:'Vatex-Mo', name:'Vatex Mờ - Kinh tế', spec:'5L / 18L', desc:'Giá tốt, chất lượng ổn định.', dm:'Theo hướng dẫn' },
      ],
      "Super White Siêu Trắng": [
        { code:'SuperWhite', name:'Super White Siêu Trắng - Sơn trần', spec:'5L / 18L', desc:'Siêu trắng, độ phủ cao, chống kiềm.', dm:'Theo hướng dẫn' },
      ],
    },
    "Sơn lót": {
      "Nội thất": [
        { code:'OL-Sealer', name:'Odour-Less Sealer - Lót cao cấp', spec:'18L', desc:'Chống rêu mốc. Chống phai màu. Tạo nền hoàn hảo.', dm:'Theo hướng dẫn' },
        { code:'Vatex-PrimerNT', name:'Vatex Primer - Lót kiềm nội thất', spec:'18L', desc:'Chống kiềm, tăng bám dính.', dm:'Theo hướng dẫn' },
      ],
      "Ngoại thất": [
        { code:'WG-Primer', name:'Weathergard Primer - Lót kiềm ngoại thất', spec:'5L / 18L', desc:'Chống kiềm, chống muối hóa.', dm:'Theo hướng dẫn' },
      ],
    },
    "Chống thấm": [
      { code:'NP-CT', name:'Chống thấm chống rêu mốc Nippon', spec:'4L / 18L', desc:'Chống thấm ngoại thất, chống rêu mốc.', dm:'Theo hướng dẫn' },
      { code:'NP-WP', name:'Chống thấm xi măng polymer', spec:'Bộ 20kg', desc:'Chống thấm sân thượng, tường ngoài.', dm:'Theo hướng dẫn' },
    ],
  },
};

/* ===== BẢNG GIÁ (từ USB VLHT tháng 04-07/2025 & 04/2026) ===== */

// Price map: brand_id -> { code: { price, spec } }
const PRICE_MAP = {
  munich: {
    // Sơn nước - bảng giá 04/2026
    'Luxury Prime NT':          { price:'883.333đ', spec:'Lon 5L' },
    'Luxury Prime NT2':         { price:'950.000đ', spec:'Lon 5L' },
    'Luxury - Siêu bóng NT':    { price:'983.333đ', spec:'Lon 5L' },
    'Luxury - Siêu bóng NT2':   { price:'1.266.667đ', spec:'Lon 5L' },
    'Fly - Bóng mờ NT':        { price:'780.000đ', spec:'Lon 5L' },
    'Fly - Bóng mờ NT2':       { price:'870.000đ', spec:'Lon 5L' },
    'Action - Siêu mịn NT':    { price:'466.667đ', spec:'Lon 5L' },
    'Action - Siêu mịn NT2':   { price:'633.333đ', spec:'Lon 5L' },
    'Nano AB':                  { price:'2.943.333đ', spec:'Lon 5L' },
    'Economy':                  { price:'190.000đ', spec:'Lon 5L' },
    'UV20':                     { price:'1.200.000đ', spec:'Lon 4L' },
    'UV20 Primer':              { price:'1.200.000đ', spec:'Lon 4L' },
    'Action Primer NT':         { price:'450.000đ', spec:'Lon 5L' },
    'Action Primer NT2':        { price:'493.333đ', spec:'Lon 5L' },
    // Chống thấm - bảng giá 04/2026
    'G20':                      { price:'1.925.950đ', spec:'Bộ 26kg' },
    'G20S':                     { price:'1.431.000đ', spec:'Bộ 25kg' },
    'G20C':                     { price:'1.143.718đ', spec:'Bộ 20kg' },
    'G20C-Đen':                 { price:'1.291.868đ', spec:'Bộ 20kg' },
    'C20':                      { price:'1.232.608đ', spec:'Thùng 20kg' },
    'CT0':                      { price:'829.640đ', spec:'Lon 5kg' },
    'PU S700':                  { price:'247.104đ', spec:'Lon 1L' },
    'PU S400':                  { price:'1.104.300đ', spec:'Lon 5L' },
    'PU S800F':                 { price:'1.311.660đ', spec:'Bộ 3,6kg' },
    'Pu Glass':                 { price:'247.104đ', spec:'Lon 1L' },
    'G10':                      { price:'400.005đ', spec:'Lon 3,5kg' },
    'G68':                      { price:'950.000đ', spec:'Thùng 18kg' },
    'S902':                     { price:'1.859.220đ', spec:'Bộ 5kg' },
    'Latex S':                  { price:'400.000đ', spec:'Can 5kg' },
    'S208':                     { price:'234.077đ', spec:'Túi 1kg' },
    'S302':                     { price:'174.817đ', spec:'Túi 1kg' },
    'Walling':                  { price:'237.040đ', spec:'Chai 1L' },
    'Stone SF':                 { price:'428.520đ', spec:'Lon 1L' },
    'Kyton K101':               { price:'1.000.540đ', spec:'Bao 20kg' },
    'Water Plug':               { price:'162.965đ', spec:'Túi 1kg' },
    'Grout G650':               { price:'296.300đ', spec:'Bao 25kg' },
    'Repair G50':               { price:'503.710đ', spec:'Bao 25kg' },
    'Gel G-01':                 { price:'296.300đ', spec:'Bao 25kg' },
    'Tile G07':                 { price:'47.408đ', spec:'Túi 1kg' },
    'HF':                       { price:'251.855đ', spec:'Bao 25kg' },
    // Sơn công nghiệp - bảng giá 04/2026
    'EP11 Lót':                 { price:'4.185.000đ', spec:'Bộ 15kg' },
    'EP11 Phủ':                 { price:'4.050.000đ', spec:'Bộ 15kg' },
    'EP11 Tự san':              { price:'6.785.270đ', spec:'Bộ 25kg' },
    'EP12 Lót':                 { price:'5.896.370đ', spec:'Bộ 25kg' },
    'EP12 Phủ':                 { price:'6.637.120đ', spec:'Bộ 25kg' },
    'S632':                     { price:'2.451.999đ', spec:'Lon 5kg' },
    'S909 Noi':                 { price:'445.000đ', spec:'Bao 25kg' },
    'S909 Ngoai':               { price:'500.000đ', spec:'Bao 25kg' },
    'S106':                     { price:'983.716đ', spec:'Bộ 3kg' },
  },
  nano: {
    'NO1':  { price:'1.765.000đ', spec:'5L' },
    'NO2':  { price:'1.620.000đ', spec:'5L' },
    'NA1':  { price:'2.138.000đ', spec:'5L' },
    'NA6':  { price:'1.340.000đ', spec:'5L' },
  },
  sika: {
    'Sika Top 107':             { price:'1.316.000đ', spec:'Bao 25kg' },
    'Sika Latex':               { price:'185.000đ', spec:'Can 5L' },
    'Sikaflex 11FC':            { price:'278.000đ', spec:'Tuýp 600ml' },
    'SikaGrout 214':            { price:'1.996.000đ', spec:'Bao 25kg' },
  },
  dulux: {
    // Ngoại thất (bảng giá OCR 07/2025)
    'WS-RoyalShine':            { price:'2.980.000đ', spec:'5L' },
    'WS-Powerflexx':            { price:'2.580.000đ', spec:'5L' },
    'WS-CaoCap':                { price:'2.580.000đ', spec:'5L' },
    'WS-Colour':                { price:'2.045.000đ', spec:'5L' },
    'IN-NgoaiThat-Bong':        { price:'1.575.000đ', spec:'5L' },
    'IN-NgoaiThat-Mo':          { price:'1.575.000đ', spec:'5L' },
    // Nội thất (bảng giá OCR 07/2025)
    'AM-5in1-SieuBong':         { price:'2.234.000đ', spec:'5L' },
    'AM-5in1-BongMo':           { price:'2.122.000đ', spec:'5L' },
    'AM-DiamondGlow':           { price:'2.137.000đ', spec:'5L' },
    'EC-ChongBan-Bong':         { price:'1.238.000đ', spec:'5L' },
    'EC-ChongBan-Mo':           { price:'1.180.000đ', spec:'5L' },
    'EC-LauChuiVT-Bong':        { price:'1.046.000đ', spec:'5L' },
    'EC-LauChuiVT-Mo':          { price:'998.000đ', spec:'5L' },
    'IN-NoiThat-Bong-Moi':      { price:'861.000đ', spec:'5L' },
    'IN-NoiThat-Mo-Moi':        { price:'820.000đ', spec:'5L' },
    'EC-LauChuiHQ-Bong':        { price:'1.153.000đ', spec:'5L' },
    'EC-LauChuiHQ-Mo':          { price:'1.098.000đ', spec:'5L' },
    // Sơn lót
    'Supersealer':              { price:'976.000đ', spec:'5L' },
    'AM-Primer':                { price:'869.000đ', spec:'5L' },
    'IN-Primer':                { price:'869.000đ', spec:'5L' },
    'EC-Primer':                { price:'783.000đ', spec:'5L' },
    // Chống thấm Dulux
    'Aquatech-Max':             { price:'1.301.000đ', spec:'6kg' },
    'Aquatech-Flex':            { price:'1.275.000đ', spec:'6kg' },
    'Aquatech-VuotTroi':        { price:'1.274.000đ', spec:'6kg' },
    'Aquatech-BaoVe':           { price:'936.000đ', spec:'6kg' },
    // Bột trét
    'Botret-IN-EX':             { price:'666.000đ', spec:'40kg' },
    'Botret-IN':                { price:'493.500đ', spec:'40kg' },
  },
  jotun: {
    // Ngoại thất - bảng giá 04/2026
    'JS-BenMauToanDien':        { price:'3.580.000đ', spec:'5L' },
    'JS-BenMauToiUu':           { price:'3.335.000đ', spec:'5L' },
    'JS-SachVuotTroi':          { price:'2.715.000đ', spec:'5L' },
    'JS-ChePhu-VetNut':         { price:'2.910.000đ', spec:'5L' },
    'JS-ChongPhaiMau':          { price:'2.695.000đ', spec:'5L' },
    'TS-Max':                   { price:'1.815.000đ', spec:'5L' },
    'WaterGuard':               { price:'1.560.000đ', spec:'6kg' },
    // Nội thất - bảng giá 04/2026
    'MJ-NguyenBan':             { price:'2.440.000đ', spec:'5L' },
    'MJ-HoanHao-Bong5':         { price:'1.815.000đ', spec:'5L' },
    'MJ-HoanHao-Mo':            { price:'1.815.000đ', spec:'5L' },
    'MJ-SangTrong':             { price:'2.120.000đ', spec:'5L' },
    'ES-ChePhu-Bong':           { price:'1.465.000đ', spec:'5L' },
    'ES-ChePhu-Mo':             { price:'1.465.000đ', spec:'5L' },
    'ES-SonTrangTran':          { price:'1.215.000đ', spec:'5L' },
    'ES-DeLauChui':             { price:'1.240.000đ', spec:'5L' },
    'Jotaplast':                { price:'605.000đ', spec:'5L' },
    // Sơn gỗ & kim loại
    'Gardex-Primer':            { price:'195.000đ', spec:'1L' },
    'Gardex-Bong':              { price:'570.000đ', spec:'2.5L' },
    // Sơn lót & bột trét
    'Lot-Majestic':             { price:'1.215.000đ', spec:'5L' },
    'Lot-Essence':              { price:'1.135.000đ', spec:'5L' },
    'Alkyd-Xam':                { price:'860.000đ', spec:'5L' },
    'Alkyd-Do':                 { price:'805.000đ', spec:'5L' },
    'Putty-IN-EX':              { price:'535.000đ', spec:'40kg' },
    'Putty-EX':                 { price:'515.000đ', spec:'40kg' },
    'Putty-IN':                 { price:'390.000đ', spec:'40kg' },
  },
  kova: {
    // Kova - tạm thời liên hệ (chờ bảng giá mới)
    'K871 GOLD':      { price:'Liên hệ', spec:'Thùng 20kg' },
    'K5500 GOLD':     { price:'Liên hệ', spec:'Thùng 20kg' },
    'K260 GOLD':      { price:'Liên hệ', spec:'Thùng 20kg' },
    'K771 GOLD':      { price:'Liên hệ', spec:'Thùng 25kg' },
    'K10 GOLD':       { price:'Liên hệ', spec:'Thùng 25kg' },
    'K109 GOLD':      { price:'Liên hệ', spec:'Thùng 25kg' },
    'K360 GOLD':      { price:'Liên hệ', spec:'Thùng 20kg' },
    'CT04T GOLD':     { price:'Liên hệ', spec:'Thùng 20kg' },
    'K5800 GOLD':     { price:'Liên hệ', spec:'Thùng 20kg' },
    'CT-11A GOLD':    { price:'Liên hệ', spec:'Thùng 20kg' },
    'CT-11B GOLD':    { price:'Liên hệ', spec:'Thùng 19kg' },
    'CT-14 GOLD':     { price:'Liên hệ', spec:'Thùng 20kg' },
    'MTN GOLD':       { price:'Liên hệ', spec:'Bao 25kg' },
    'KOVA-BT':        { price:'Liên hệ', spec:'Bao 40kg' },
    'KOVA-BN':        { price:'Liên hệ', spec:'Bao 40kg' },
    'MB-T':           { price:'Liên hệ', spec:'Bao 25kg' },
    'MB-N':           { price:'Liên hệ', spec:'Bao 25kg' },
    'CT08 GOLD':      { price:'Liên hệ', spec:'Thùng 20kg' },
    'KL55T GOLD':     { price:'Liên hệ', spec:'Thùng 20kg' },
    'CT05':           { price:'Liên hệ', spec:'4kg' },
  },
  nippon: {
    // Ngoại thất - bảng giá 07/2025
    'WG-SieuBong':    { price:'513.000đ', spec:'1L' },
    'WG-SieuBong18L': { price:'2.272.000đ', spec:'5L' },
    'WG-Plus':        { price:'Liên hệ', spec:'1L / 5L / 18L' },
    'WG-Bong':        { price:'Liên hệ', spec:'1L / 5L' },
    'WG-Mo':          { price:'Liên hệ', spec:'1L / 5L / 18L' },
    // Nội thất siêu cao cấp - bảng giá 07/2025
    'OL-Allin1':      { price:'513.000đ', spec:'1L' },
    'OL-BongST':      { price:'458.000đ', spec:'1L' },
    'OL-Mo':          { price:'250.000đ', spec:'1L' },
    'OL-Trang':       { price:'Liên hệ', spec:'5L' },
    // Nội thất chất lượng - bảng giá 07/2025
    'Matex-Bong':     { price:'575.000đ', spec:'5KG' },
    'Matex-Mo':       { price:'519.000đ', spec:'5L' },
    'Vatex-Bong':     { price:'332.000đ', spec:'4.8KG' },
    'Vatex-Mo':       { price:'Liên hệ', spec:'5L' },
    'SuperWhite':     { price:'Liên hệ', spec:'5L' },
    // Sơn lót - bảng giá 07/2025
    'OL-Sealer':      { price:'1.040.000đ', spec:'5L' },
    'Vatex-PrimerNT': { price:'593.000đ', spec:'5L' },
    'WG-Primer':      { price:'1.491.000đ', spec:'5L' },
    // Chống thấm - bảng giá 07/2025
    'NP-CT':          { price:'1.196.000đ', spec:'5KG' },
    'NP-WP':          { price:'1.378.000đ', spec:'6KG' },
  },
};

function getPrice(bid, code) {
  const pm = PRICE_MAP[bid];
  if (!pm) return null;
  if (pm[code]) return pm[code];
  for (const key in pm) {
    if (code.startsWith(key)) return pm[key];
  }
  return null;
}

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

// Danh sách giá cho bảng giá (front-end display)
const PRICES = [
  // --- MUNICH - SƠN NƯỚC & CHỐNG THẤM (bảng giá 04/2026) ---
  { brand:'Munich', product:'Luxury Prime Lót kháng kiềm Nội thất', spec:'5L', price:'883.333đ' },
  { brand:'Munich', product:'Luxury Prime Lót kháng kiềm Nội thất', spec:'18L', price:'2.650.000đ' },
  { brand:'Munich', product:'Luxury Prime Lót kháng kiềm Ngoại thất', spec:'5L', price:'950.000đ' },
  { brand:'Munich', product:'Luxury Prime Lót kháng kiềm Ngoại thất', spec:'18L', price:'2.850.000đ' },
  { brand:'Munich', product:'Luxury Siêu bóng Nội thất', spec:'5L', price:'983.333đ' },
  { brand:'Munich', product:'Luxury Siêu bóng Nội thất', spec:'18L', price:'2.950.000đ' },
  { brand:'Munich', product:'Luxury Siêu bóng Ngoại thất', spec:'5L', price:'1.266.667đ' },
  { brand:'Munich', product:'Luxury Siêu bóng Ngoại thất', spec:'18L', price:'3.800.000đ' },
  { brand:'Munich', product:'Action Siêu mịn Nội thất', spec:'5L', price:'466.667đ' },
  { brand:'Munich', product:'Action Siêu mịn Nội thất', spec:'18L', price:'1.400.000đ' },
  { brand:'Munich', product:'Action Siêu mịn Ngoại thất', spec:'5L', price:'633.333đ' },
  { brand:'Munich', product:'Action Siêu mịn Ngoại thất', spec:'18L', price:'1.900.000đ' },
  { brand:'Munich', product:'Action Primer Lót kháng kiềm Nội thất', spec:'5L', price:'450.000đ' },
  { brand:'Munich', product:'Action Primer Lót kháng kiềm Nội thất', spec:'18L', price:'1.350.000đ' },
  { brand:'Munich', product:'Action Primer Lót kháng kiềm Ngoại thất', spec:'5L', price:'493.333đ' },
  { brand:'Munich', product:'Action Primer Lót kháng kiềm Ngoại thất', spec:'18L', price:'1.480.000đ' },
  { brand:'Munich', product:'Economy Kinh tế', spec:'5L', price:'190.000đ' },
  { brand:'Munich', product:'Economy Kinh tế', spec:'18L', price:'592.500đ' },
  { brand:'Munich', product:'FLY Bóng mờ Nội thất', spec:'5L', price:'780.000đ' },
  { brand:'Munich', product:'FLY Bóng mờ Nội thất', spec:'18L', price:'2.000.000đ' },
  { brand:'Munich', product:'FLY Bóng mờ Ngoại thất', spec:'5L', price:'870.000đ' },
  { brand:'Munich', product:'FLY Bóng mờ Ngoại thất', spec:'18L', price:'2.300.000đ' },
  { brand:'Munich', product:'Nano AB Diệt khuẩn Siêu bóng', spec:'5L', price:'2.943.333đ' },
  { brand:'Munich', product:'Nano AB Diệt khuẩn Siêu bóng', spec:'18L', price:'8.830.000đ' },
  { brand:'Munich', product:'UV20 Chống nóng', spec:'4L', price:'1.200.000đ' },
  { brand:'Munich', product:'UV20 Chống nóng', spec:'18L', price:'6.225.000đ' },
  { brand:'Munich', product:'UV20 Primer Lót chống nóng', spec:'4L', price:'1.200.000đ' },
  { brand:'Munich', product:'UV20 Primer Lót chống nóng', spec:'18L', price:'3.600.000đ' },
  { brand:'Munich', product:'Sport C631 Sân thể thao', spec:'5kg', price:'1.328.001đ' },
  { brand:'Munich', product:'Sport C631 Sân thể thao', spec:'18kg', price:'3.570.000đ' },
  { brand:'Munich', product:'Sport S632 Sân thể thao cao cấp', spec:'5kg', price:'2.451.999đ' },
  { brand:'Munich', product:'Sport S632 Sân thể thao cao cấp', spec:'18kg', price:'5.670.000đ' },
  { brand:'Munich', product:'Top S909 Bột bả Nội thất', spec:'25kg', price:'445.000đ' },
  { brand:'Munich', product:'Top S909 Bột bả Ngoại thất', spec:'25kg', price:'500.000đ' },
  // Munich chống thấm
  { brand:'Munich', product:'G20 Màng chống thấm đàn hồi 200%', spec:'Bộ 26kg', price:'1.925.950đ' },
  { brand:'Munich', product:'G20S Màng chống thấm đàn hồi 200%', spec:'Bộ 25kg', price:'1.431.000đ' },
  { brand:'Munich', product:'G20C Siêu cứng lá sen', spec:'Bộ 20kg', price:'1.143.718đ' },
  { brand:'Munich', product:'G20C-Đen Chống thấm bể cá Koi', spec:'Bộ 20kg', price:'1.291.868đ' },
  { brand:'Munich', product:'C20 Màng chống thấm siêu cứng', spec:'Thùng 20kg', price:'1.232.608đ' },
  { brand:'Munich', product:'CT0 Acrylic chống thấm pha xi măng', spec:'5kg', price:'829.640đ' },
  { brand:'Munich', product:'CT0 Acrylic chống thấm pha xi măng', spec:'18kg', price:'3.022.260đ' },
  { brand:'Munich', product:'PU S700 Chống thấm PU đàn hồi 700%', spec:'1L', price:'247.104đ' },
  { brand:'Munich', product:'PU S700 Chống thấm PU đàn hồi 700%', spec:'4L', price:'1.035.180đ' },
  { brand:'Munich', product:'PU S700 Chống thấm PU đàn hồi 700%', spec:'18L', price:'3.858.624đ' },
  { brand:'Munich', product:'PU S400 Chống thấm PU đàn hồi 400%', spec:'5L', price:'1.104.300đ' },
  { brand:'Munich', product:'PU S400 Chống thấm PU đàn hồi 400%', spec:'18L', price:'3.274.560đ' },
  { brand:'Munich', product:'PU S800F Chống thấm PU gốc dầu 700%', spec:'Bộ 3,6kg', price:'1.311.660đ' },
  { brand:'Munich', product:'PU S800F Chống thấm PU gốc dầu 700%', spec:'Bộ 18kg', price:'4.023.000đ' },
  { brand:'Munich', product:'Pu Glass Chống thấm PU trong suốt', spec:'1L', price:'247.104đ' },
  { brand:'Munich', product:'Pu Glass Chống thấm PU trong suốt', spec:'4L', price:'1.035.180đ' },
  { brand:'Munich', product:'Pu Glass Chống thấm PU trong suốt', spec:'18L', price:'3.858.624đ' },
  { brand:'Munich', product:'G10 Chống thấm Bitum-Polymer', spec:'3,5kg', price:'400.005đ' },
  { brand:'Munich', product:'G10 Chống thấm Bitum-Polymer', spec:'18kg', price:'1.629.650đ' },
  { brand:'Munich', product:'Grout G650 Vữa rót tự chảy', spec:'25kg', price:'296.300đ' },
  { brand:'Munich', product:'Repair G50 Vữa sửa chữa bê tông', spec:'25kg', price:'503.710đ' },
  { brand:'Munich', product:'Latex S Phụ gia kết nối chống thấm', spec:'5kg', price:'400.000đ' },
  { brand:'Munich', product:'Latex S Phụ gia kết nối chống thấm', spec:'25kg', price:'1.700.000đ' },
  { brand:'Munich', product:'S208 Phụ gia trộn vữa chống thấm', spec:'Túi 1kg', price:'234.077đ' },
  { brand:'Munich', product:'S302 Phụ gia chống co ngót', spec:'Túi 1kg', price:'174.817đ' },
  { brand:'Munich', product:'Walling Chống thấm tinh thể (nước)', spec:'1L', price:'237.040đ' },
  { brand:'Munich', product:'Walling Chống thấm tinh thể (nước)', spec:'5L', price:'918.530đ' },
  { brand:'Munich', product:'Water Plug Đông cứng nhanh', spec:'Túi 1kg', price:'162.965đ' },
  { brand:'Munich', product:'Kyton K101 Chống thấm tinh thể bột', spec:'20kg', price:'1.000.540đ' },
  { brand:'Munich', product:'Stone SF Chống thấm tinh thể (dầu)', spec:'1L', price:'428.520đ' },
  // Munich sơn công nghiệp
  { brand:'Munich', product:'Epoxy EP11 Lót', spec:'Bộ 15kg', price:'4.185.000đ' },
  { brand:'Munich', product:'Epoxy EP11 Lót', spec:'Bộ 3kg', price:'1.046.250đ' },
  { brand:'Munich', product:'Epoxy EP11 Phủ', spec:'Bộ 15kg', price:'4.050.000đ' },
  { brand:'Munich', product:'Epoxy EP11 Phủ', spec:'Bộ 3kg', price:'1.012.500đ' },
  { brand:'Munich', product:'Epoxy EP11 Tự san', spec:'Bộ 25kg', price:'6.785.270đ' },
  { brand:'Munich', product:'Epoxy EP12 Lót gốc nước', spec:'Bộ 25kg', price:'5.896.370đ' },
  { brand:'Munich', product:'Epoxy EP12 Phủ gốc nước', spec:'Bộ 25kg', price:'6.637.120đ' },
  { brand:'Munich', product:'S902 PU Kho lạnh chịu sốc nhiệt', spec:'Bộ 5kg', price:'1.859.220đ' },
  { brand:'Munich', product:'S106 Sơn chống gỉ Epoxy', spec:'Bộ 3kg', price:'983.716đ' },
  // --- JOTUN (bảng giá 04/2026) ---
  { brand:'Jotun', product:'Jotashield Bền Màu Toàn Diện', spec:'5L', price:'3.580.000đ' },
  { brand:'Jotun', product:'Jotashield Bền Màu Toàn Diện', spec:'15L', price:'9.715.000đ' },
  { brand:'Jotun', product:'Jotashield Bền Màu Tối Ưu', spec:'1L', price:'685.000đ' },
  { brand:'Jotun', product:'Jotashield Bền Màu Tối Ưu', spec:'5L', price:'3.335.000đ' },
  { brand:'Jotun', product:'Jotashield Sạch Vượt Trội', spec:'5L', price:'2.715.000đ' },
  { brand:'Jotun', product:'Jotashield Sạch Vượt Trội', spec:'15L', price:'7.945.000đ' },
  { brand:'Jotun', product:'Jotashield Che Phủ Vết Nứt', spec:'5L', price:'2.910.000đ' },
  { brand:'Jotun', product:'Jotashield Chống Phai Màu', spec:'5L', price:'2.695.000đ' },
  { brand:'Jotun', product:'Jotashield Chống Phai Màu', spec:'15L', price:'7.880.000đ' },
  { brand:'Jotun', product:'Tough Shield Max', spec:'5L', price:'1.815.000đ' },
  { brand:'Jotun', product:'Tough Shield Max', spec:'17L', price:'6.075.000đ' },
  { brand:'Jotun', product:'WaterGuard Chống thấm', spec:'6kg', price:'1.560.000đ' },
  { brand:'Jotun', product:'WaterGuard Chống thấm', spec:'20kg', price:'4.950.000đ' },
  { brand:'Jotun', product:'Majestic Đẹp Nguyên Bản', spec:'5L', price:'2.440.000đ' },
  { brand:'Jotun', product:'Majestic Đẹp Nguyên Bản', spec:'15L', price:'7.250.000đ' },
  { brand:'Jotun', product:'Majestic Sang Trọng (Bóng)', spec:'5L', price:'2.120.000đ' },
  { brand:'Jotun', product:'Majestic Sang Trọng (Bóng)', spec:'15L', price:'6.305.000đ' },
  { brand:'Jotun', product:'Majestic Đẹp Hoàn Hảo', spec:'5L', price:'1.815.000đ' },
  { brand:'Jotun', product:'Majestic Đẹp Hoàn Hảo', spec:'15L', price:'5.185.000đ' },
  { brand:'Jotun', product:'Essence Che Phủ Tối Đa', spec:'5L', price:'1.465.000đ' },
  { brand:'Jotun', product:'Essence Che Phủ Tối Đa', spec:'15L', price:'4.205.000đ' },
  { brand:'Jotun', product:'Essence Sơn Trắng Trần', spec:'5L', price:'1.215.000đ' },
  { brand:'Jotun', product:'Essence Sơn Trắng Trần', spec:'17L', price:'3.720.000đ' },
  { brand:'Jotun', product:'Essence Dễ Lau Chùi', spec:'5L', price:'1.240.000đ' },
  { brand:'Jotun', product:'Essence Dễ Lau Chùi', spec:'17L', price:'3.890.000đ' },
  { brand:'Jotun', product:'Jotaplast Kinh tế', spec:'5L', price:'605.000đ' },
  { brand:'Jotun', product:'Jotaplast Kinh tế', spec:'17L', price:'1.760.000đ' },
  { brand:'Jotun', product:'Majestic Primer Lót chống kiềm', spec:'5L', price:'1.215.000đ' },
  { brand:'Jotun', product:'Majestic Primer Lót chống kiềm', spec:'17L', price:'3.710.000đ' },
  { brand:'Jotun', product:'Essence Easy Primer', spec:'5L', price:'1.135.000đ' },
  { brand:'Jotun', product:'Essence Easy Primer', spec:'17L', price:'3.630.000đ' },
  { brand:'Jotun', product:'Alkyd Primer Chống rỉ xám', spec:'5L', price:'860.000đ' },
  { brand:'Jotun', product:'Alkyd Primer Chống rỉ xám', spec:'20L', price:'3.290.000đ' },
  { brand:'Jotun', product:'Alkyd Primer Chống rỉ đỏ', spec:'5L', price:'805.000đ' },
  { brand:'Jotun', product:'Alkyd Primer Chống rỉ đỏ', spec:'20L', price:'3.015.000đ' },
  { brand:'Jotun', product:'Interior & Exterior Putty', spec:'40kg', price:'535.000đ' },
  { brand:'Jotun', product:'Exterior Putty', spec:'40kg', price:'515.000đ' },
  { brand:'Jotun', product:'Interior Putty', spec:'40kg', price:'390.000đ' },
  { brand:'Jotun', product:'Gardex Primer', spec:'1L', price:'195.000đ' },
  { brand:'Jotun', product:'Gardex Bóng', spec:'2.5L', price:'570.000đ' },
  // --- NANO HOUSE ---
  { brand:'Nano House', product:'Super Interior NO1', spec:'5L', price:'1.765.000đ' },
  { brand:'Nano House', product:'Super Interior NO1', spec:'15L', price:'4.983.000đ' },
  { brand:'Nano House', product:'Eco Nano Guard NO2', spec:'5L', price:'1.620.000đ' },
  { brand:'Nano House', product:'Eco Nano Guard NO2', spec:'18L', price:'4.818.000đ' },
  { brand:'Nano House', product:'Super Exterior NA1', spec:'5L', price:'2.138.000đ' },
  { brand:'Nano House', product:'Eco Proguard Chống thấm NA6', spec:'5L', price:'1.340.000đ' },
  { brand:'Nano House', product:'Eco Proguard Chống thấm NA6', spec:'18L', price:'4.428.000đ' },
  // --- DULUX (bảng giá 07/2025 từ OCR) ---
  { brand:'Dulux', product:'Weathershield Royal Shine', spec:'1L', price:'660.000đ' },
  { brand:'Dulux', product:'Weathershield Royal Shine', spec:'5L', price:'2.980.000đ' },
  { brand:'Dulux', product:'Weathershield Powerflexx', spec:'1L', price:'640.000đ' },
  { brand:'Dulux', product:'Weathershield Powerflexx', spec:'5L', price:'2.580.000đ' },
  { brand:'Dulux', product:'Weathershield Cao cấp', spec:'1L', price:'570.000đ' },
  { brand:'Dulux', product:'Weathershield Cao cấp', spec:'5L', price:'2.580.000đ' },
  { brand:'Dulux', product:'Weathershield Cao cấp', spec:'18L', price:'7.350.000đ' },
  { brand:'Dulux', product:'Weathershield Colour Protect Bóng', spec:'5L', price:'2.045.000đ' },
  { brand:'Dulux', product:'Weathershield Colour Protect Mờ', spec:'5L', price:'1.500.000đ' },
  { brand:'Dulux', product:'Inspire Ngoại thất Bóng', spec:'5L', price:'1.575.000đ' },
  { brand:'Dulux', product:'Inspire Ngoại thất Bóng', spec:'15L', price:'5.145.000đ' },
  { brand:'Dulux', product:'Inspire Ngoại thất Mờ', spec:'5L', price:'1.575.000đ' },
  { brand:'Dulux', product:'Inspire Ngoại thất Mờ', spec:'15L', price:'4.518.000đ' },
  { brand:'Dulux', product:'Inspire Ngoại thất Mờ', spec:'18L', price:'5.400.000đ' },
  { brand:'Dulux', product:'Ambiance 5in1 Superflexx Siêu Bóng', spec:'5L', price:'2.234.000đ' },
  { brand:'Dulux', product:'Ambiance 5in1 Superflexx Bóng Mờ', spec:'5L', price:'2.122.000đ' },
  { brand:'Dulux', product:'Ambiance 5in1 Superflexx Bóng Mờ', spec:'18L', price:'6.075.000đ' },
  { brand:'Dulux', product:'Ambiance 5in1 Diamond Glow', spec:'5L', price:'2.137.000đ' },
  { brand:'Dulux', product:'EasyClean Chống Bám Bẩn KV Bóng', spec:'5L', price:'1.238.000đ' },
  { brand:'Dulux', product:'EasyClean Chống Bám Bẩn KV Mờ', spec:'5L', price:'1.180.000đ' },
  { brand:'Dulux', product:'EasyClean Lau Chùi Vượt Trội KV Bóng', spec:'5L', price:'1.046.000đ' },
  { brand:'Dulux', product:'EasyClean Lau Chùi Vượt Trội KV Mờ', spec:'5L', price:'998.000đ' },
  { brand:'Dulux', product:'Inspire Nội thất Bóng (Mới)', spec:'5L', price:'861.000đ' },
  { brand:'Dulux', product:'Inspire Nội thất Mờ (Mới)', spec:'5L', price:'820.000đ' },
  { brand:'Dulux', product:'EasyClean Lau Chùi Hiệu Quả Bóng', spec:'5L', price:'1.153.000đ' },
  { brand:'Dulux', product:'EasyClean Lau Chùi Hiệu Quả Mờ', spec:'5L', price:'1.098.000đ' },
  { brand:'Dulux', product:'Supersealer Lót nội thất', spec:'5L', price:'976.000đ' },
  { brand:'Dulux', product:'Supersealer Lót nội thất', spec:'18L', price:'3.341.000đ' },
  { brand:'Dulux', product:'Ambiance Primer Lót nội thất', spec:'5L', price:'869.000đ' },
  { brand:'Dulux', product:'Interior Primer Lót nội thất', spec:'5L', price:'869.000đ' },
  { brand:'Dulux', product:'EasyClean Primer Lót nội thất', spec:'5L', price:'783.000đ' },
  { brand:'Dulux', product:'Aquatech Max Chống thấm sàn', spec:'6kg', price:'1.301.000đ' },
  { brand:'Dulux', product:'Aquatech Max Chống thấm sàn', spec:'20kg', price:'4.126.000đ' },
  { brand:'Dulux', product:'Aquatech Flex Chống thấm tường', spec:'6kg', price:'1.275.000đ' },
  { brand:'Dulux', product:'Aquatech Flex Chống thấm tường', spec:'20kg', price:'4.014.000đ' },
  { brand:'Dulux', product:'Aquatech Vượt Trội', spec:'6kg', price:'1.274.000đ' },
  { brand:'Dulux', product:'Aquatech Vượt Trội', spec:'20kg', price:'4.010.000đ' },
  { brand:'Dulux', product:'Aquatech Bảo Vệ Cao cấp', spec:'6kg', price:'936.000đ' },
  { brand:'Dulux', product:'Bột trét Nội & Ngoại thất', spec:'40kg', price:'666.000đ' },
  { brand:'Dulux', product:'Bột trét Nội thất', spec:'40kg', price:'493.500đ' },
  // --- SIKA (bảng giá OCR) ---
  { brand:'Sika', product:'Sika Top 107 Vữa sửa chữa bê tông', spec:'25kg', price:'1.316.000đ' },
  { brand:'Sika', product:'Sika Latex Phụ gia chống thấm', spec:'5L', price:'185.000đ' },
  { brand:'Sika', product:'Sikaflex Pro-3 Keo trám khe', spec:'600ml', price:'382.000đ' },
  { brand:'Sika', product:'SikaGrout 214 Vữa rót không co ngót', spec:'25kg', price:'1.996.000đ' },
  // --- KOVA ---
  { brand:'Kova', product:'K871 GOLD Sơn bóng nội thất cao cấp', spec:'20kg', price:'Liên hệ' },
  { brand:'Kova', product:'K871 GOLD Sơn bóng nội thất cao cấp', spec:'4kg', price:'Liên hệ' },
  { brand:'Kova', product:'K5500 GOLD Sơn bóng nội thất', spec:'20kg', price:'Liên hệ' },
  { brand:'Kova', product:'K5500 GOLD Sơn bóng nội thất', spec:'4kg', price:'Liên hệ' },
  { brand:'Kova', product:'K260 GOLD Sơn không bóng trong nhà', spec:'20kg', price:'Liên hệ' },
  { brand:'Kova', product:'K260 GOLD Sơn không bóng trong nhà', spec:'4kg', price:'Liên hệ' },
  { brand:'Kova', product:'K771 GOLD Sơn trang trí nội thất', spec:'25kg', price:'Liên hệ' },
  { brand:'Kova', product:'K10 GOLD Sơn trần trang trí', spec:'25kg', price:'Liên hệ' },
  { brand:'Kova', product:'K109 GOLD Sơn lót kháng kiềm nội thất', spec:'25kg', price:'Liên hệ' },
  { brand:'Kova', product:'K360 GOLD Sơn bóng ngoại thất cao cấp', spec:'20kg', price:'Liên hệ' },
  { brand:'Kova', product:'K360 GOLD Sơn bóng ngoại thất cao cấp', spec:'4kg', price:'Liên hệ' },
  { brand:'Kova', product:'CT04T GOLD Sơn trang trí chống thấm ngoại thất', spec:'20kg', price:'Liên hệ' },
  { brand:'Kova', product:'K5800 GOLD Sơn bóng ngoại thất', spec:'20kg', price:'Liên hệ' },
  { brand:'Kova', product:'CT-11A GOLD Chống thấm xi măng, bê tông', spec:'20kg', price:'Liên hệ' },
  { brand:'Kova', product:'CT-11A GOLD Chống thấm xi măng, bê tông', spec:'4kg', price:'Liên hệ' },
  { brand:'Kova', product:'CT-11B GOLD Phụ gia chống thấm xi măng', spec:'19kg', price:'Liên hệ' },
  { brand:'Kova', product:'CT-11B GOLD Phụ gia chống thấm xi măng', spec:'3.8kg', price:'Liên hệ' },
  { brand:'Kova', product:'CT-14 GOLD Chống thấm co giãn chống áp lực ngược', spec:'20kg', price:'Liên hệ' },
  { brand:'Kova', product:'CT-14 GOLD Chống thấm co giãn chống áp lực ngược', spec:'4kg', price:'Liên hệ' },
  { brand:'Kova', product:'MTN GOLD Matit ngoại thất', spec:'25kg', price:'Liên hệ' },
  { brand:'Kova', product:'KOVA-BT Bột bả cao cấp trong nhà', spec:'40kg', price:'Liên hệ' },
  { brand:'Kova', product:'KOVA-BN Bột bả cao cấp ngoại thất', spec:'40kg', price:'Liên hệ' },
  { brand:'Kova', product:'MB-T Bột bả trong nhà', spec:'25kg', price:'Liên hệ' },
  { brand:'Kova', product:'MB-N Bột bả ngoại thất', spec:'25kg', price:'Liên hệ' },
  { brand:'Kova', product:'CT08 GOLD Sơn sân tennis, sân thể thao', spec:'20kg', price:'Liên hệ' },
  { brand:'Kova', product:'CT08 GOLD Sơn sân tennis, sân thể thao', spec:'4kg', price:'Liên hệ' },
  { brand:'Kova', product:'KL55T GOLD Sơn men bóng phủ sàn trong nhà', spec:'20kg', price:'Liên hệ' },
  { brand:'Kova', product:'CT05 Chống thấm', spec:'4kg', price:'Liên hệ' },
];
