/* BẢNG GIÁ SẢN PHẨM - TRẦN HỮU MINH */
/* Cập nhật từ USB VLHT - 05/2026 */

const PRICES = {
  munich: {
    'Luxury Prime NT': 'Liên hệ',
    'Luxury - Siêu bóng NT': 'Liên hệ',
    'Fly - Bóng mờ NT': 'Liên hệ',
    'Action - Siêu mịn NT': 'Liên hệ',
    'Nano AB': 'Liên hệ',
    'Economy': 'Liên hệ',
    'Luxury Prime NT2': 'Liên hệ',
    'Luxury - Siêu bóng NT2': 'Liên hệ',
    'Fly - Bóng mờ NT2': 'Liên hệ',
    'Action - Siêu mịn NT2': 'Liên hệ',
    'G20': 'Liên hệ',
    'G20S': 'Liên hệ',
    'G20C': 'Liên hệ',
    'G20C-Đen': 'Liên hệ',
    'C20': 'Liên hệ',
    'CT0': 'Liên hệ',
    'PU S700': 'Liên hệ',
    'PU S400': 'Liên hệ',
    'PU S800F': 'Liên hệ',
    'Pu Glass': 'Liên hệ',
    'G10': 'Liên hệ',
    'G68': 'Liên hệ',
    'S902': 'Liên hệ',
    'EP11 Lót': 'Liên hệ',
    'EP11 Phủ': 'Liên hệ',
    'EP11 Tự san': 'Liên hệ',
    'EP12 Lót': 'Liên hệ',
    'EP12 Phủ': 'Liên hệ',
    'UV20': 'Liên hệ',
    'UV20 Primer': 'Liên hệ',
    'S632': 'Liên hệ',
    'Latex S': 'Liên hệ',
    'S208': 'Liên hệ',
    'S302': 'Liên hệ',
    'Walling': 'Liên hệ',
    'Stone SF': 'Liên hệ',
    'Kyton K101': 'Liên hệ',
    'Water Plug': 'Liên hệ',
    'Grout G650': 'Liên hệ',
    'Repair G50': 'Liên hệ',
    'Gel G-01': 'Liên hệ',
    'Tile G07': 'Liên hệ',
    'HF': 'Liên hệ',
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
  if (PRICES[brand] && PRICES[brand][code]) {
    return { price: PRICES[brand][code], spec: '' };
  }
  return null;
}
