/* BẢNG GIÁ SẢN PHẨM - TRẦN HỮU MINH */
/* Cập nhật từ USB VLHT - 05/2026 */
/* Nguồn: Bảng giá Munich 04/2026, Dulux 03/2026, Jotun 04/2026 */

const PRICES = {
  munich: {
    // DÒNG SƠN SIÊU BÓNG
    'Luxury Prime NT':   { price: '883.000đ - 2.650.000đ', spec: '5L / 18L' },
    'Luxury Prime NT2':  { price: '950.000đ - 2.850.000đ', spec: '5L / 18L' },
    'Luxury - Siêu bóng NT':  { price: '983.000đ - 2.950.000đ', spec: '5L / 18L' },
    'Luxury - Siêu bóng NT2': { price: '1.267.000đ - 3.800.000đ', spec: '5L / 18L' },
    'Nano AB':           { price: '2.943.000đ - 8.830.000đ', spec: '5L / 18L' },
    // DÒNG SƠN MỊN
    'Action - Siêu mịn NT':  { price: '467.000đ - 1.400.000đ', spec: '5L / 18L' },
    'Action - Siêu mịn NT2': { price: '633.000đ - 1.900.000đ', spec: '5L / 18L' },
    // DÒNG SƠN KINH TẾ
    'Economy':           { price: '190.000đ - 593.000đ', spec: '5L / 18L' },
    // DÒNG SƠN BÓNG MỜ
    'Fly - Bóng mờ NT':  { price: '780.000đ - 2.000.000đ', spec: '5L / 18L' },
    'Fly - Bóng mờ NT2': { price: '870.000đ - 2.300.000đ', spec: '5L / 18L' },
    // CHỐNG THẤM XI MĂNG-POLYMER
    'G20':               { price: '1.926.000đ', spec: 'Bộ 26kg' },
    'G20S':              { price: '1.431.000đ', spec: 'Bộ 25kg' },
    'G20C':              { price: '1.144.000đ', spec: 'Bộ 20kg' },
    'G20C-Đen':          { price: '1.292.000đ', spec: 'Bộ 20kg' },
    'C20':               { price: '1.233.000đ', spec: 'Thùng 20kg' },
    // CHỐNG THẤM ACRYLIC
    'CT0':               { price: '830.000đ - 3.022.000đ', spec: '5kg / 18kg' },
    // CHỐNG THẤM PU
    'PU S700':           { price: '247.000đ - 3.859.000đ', spec: '1L / 4L / 18L' },
    'PU S400':           { price: '1.104.000đ - 3.275.000đ', spec: '5L / 18L' },
    'Pu Glass':          { price: '247.000đ - 3.859.000đ', spec: '1L / 4L / 18L' },
    // CHỐNG THẤM BITUM
    'G10':               { price: 'Liên hệ', spec: '' },
    'G68':               { price: 'Liên hệ', spec: '' },
    'S902':              { price: 'Liên hệ', spec: '' },
    // EPOXY
    'EP11 Lót':          { price: 'Liên hệ', spec: '' },
    'EP11 Phủ':          { price: 'Liên hệ', spec: '' },
    'EP11 Tự san':       { price: 'Liên hệ', spec: '' },
    'EP12 Lót':          { price: 'Liên hệ', spec: '' },
    'EP12 Phủ':          { price: 'Liên hệ', spec: '' },
    // CHỐNG NÓNG & THỂ THAO
    'UV20':              { price: '1.200.000đ - 6.225.000đ', spec: '4L / 18L' },
    'UV20 Primer':       { price: '1.200.000đ - 3.600.000đ', spec: '4L / 18L' },
    'S632':              { price: '2.452.000đ - 5.670.000đ', spec: '5kg / 18kg' },
    // PHỤ GIA
    'Latex S':           { price: 'Liên hệ', spec: '' },
    'S208':              { price: 'Liên hệ', spec: '' },
    'S302':              { price: 'Liên hệ', spec: '' },
    'Walling':           { price: 'Liên hệ', spec: '' },
    'Stone SF':          { price: 'Liên hệ', spec: '' },
    'Kyton K101':        { price: 'Liên hệ', spec: '' },
    'Water Plug':        { price: 'Liên hệ', spec: '' },
    'Grout G650':        { price: 'Liên hệ', spec: '' },
    'Repair G50':        { price: 'Liên hệ', spec: '' },
    'Gel G-01':          { price: 'Liên hệ', spec: '' },
    'Tile G07':          { price: 'Liên hệ', spec: '' },
    'HF':                { price: 'Liên hệ', spec: '' },
  },
  nano: {},
  sika: {},
  dulux: {},
  jotun: {},
  kova: {},
  nippon: {},
  maxilite: {},
};

function getPrice(brand, code) {
  const b = PRICES[brand];
  if (b && b[code]) {
    return { price: b[code].price, spec: b[code].spec };
  }
  return null;
}
