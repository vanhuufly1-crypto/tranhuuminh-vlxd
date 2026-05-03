/* APP - TRẦN HỮU MINH WEBSITE */

// Product images list - CHỈ TỪ USB VLHT
const PROD_IMAGES = [
  // Kova (32)
  'kova_bn-1699232156',
  'kova_bt-1699231775',
  'kova_cn05-1658475473',
  'kova_ct-14-v-1658475387',
  'kova_ct04t-mt-1710492182',
  'kova_ct08-v-1658471994',
  'kova_ct08-v-1658472017',
  'kova_ct11a-mt-1710492043',
  'kova_ct11bmt-1732503757',
  'kova_k-1025kg-1694074913',
  'kova_k109-1694074693',
  'kova_k180-v-1658473768',
  'kova_k209-v-1658472483',
  'kova_k260-v-1658473602',
  'kova_k261-1654583954',
  'kova_k280-1639720515',
  'kova_k280-1639720668',
  'kova_k360-mt-1701836928',
  'kova_k5500mt-1708937363',
  'kova_k5501-v-1658472808',
  'kova_k5800-mt-1658068718',
  'kova_k77125kg-1694075325',
  'kova_k871mt-1709520533',
  'kova_kl5t-aqua-v-1658463129',
  'kova_kl5t-v-1658471824',
  'kova_kl5tbb-v-1658463892',
  'kova_mb-t300923-1694060672',
  'kova_mt-kl5t-aqua-v-1678765368',
  'kova_mtn-v-1658471648',
  'kova_mtt-v-1658473852',
  'kova_nt26-1kg-1710492254',
  'kova_z6669805729346_420fc41fbc0cea2cbb521e3002f5eabb',
  // Nano House (17)
  'nano_a1',
  'nano_IMG_1623337789048_1623337954888-300x300',
  'nano_IMG_1623337789048_1623337954888-300x300_1',
  'nano_IMG_1623337789150_1623337954972-300x300',
  'nano_IMG_1623337789358_1623337954932-1-300x300',
  'nano_IMG_1623337789479_1623337954569-300x300',
  'nano_IMG_1623337789570_1623337955073-300x300',
  'nano_IMG_1623337789678_1623337954507-300x300',
  'nano_IMG_1623337789778_1623337954639-300x300',
  'nano_IMG_1623337789879_1623337954683-300x300',
  'nano_IMG_1623337789979_1623337954742-300x300',
  'nano_IMG_1623337790189_1623337954806-1-300x300',
  'nano_IMG_1623337790398_1623337955032-300x300',
  'nano_IMG_1623337790500_1623337954849-300x300',
  'nano_IMG_1623337790500_1623337954849-300x300_1',
  'nano_IMG_1623337790600_1623337955112-300x300',
  'nano_IMG_20210721_112021-300x300',
  // Munich (1)
  'munich_z6669805737655_e0331211320f6d0f2f99d9f6cf995495',
  // Jotun (1)
  'jotun_z6669805735502_f29cf55851d62b8728fdd1683d311afb',
  // Dulux (1)
  'dulux_z6669805730688_c375ad9ba90c3d57d166aa6f66640b7b',
  // Sika (1)
  'sika_a2',
];

// Assign images to brands
function getBrandImages(brandId) {
  const map = {
    kova:    [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
    nano:    [32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48],
    munich:  [49],
    jotun:   [50],
    dulux:   [51],
    sika:    [52],
    nippon:  [],
  };
  return (map[brandId] || []).map(i => PROD_IMAGES[i]).filter(Boolean);
}

// Image error fallback
function handleImgError(img) {
  img.onerror = null;
  img.style.display = 'none';
}

// Ảnh đại diện cho từng thương hiệu (từ USB)
const BRAND_IMG = {
  kova: 'images/kova_bn-1699232156.webp',
  nano: 'images/nano_IMG_1623337789048_1623337954888-300x300.webp',
  munich: 'images/munich_z6669805737655_e0331211320f6d0f2f99d9f6cf995495.webp',
  jotun: 'images/jotun_z6669805735502_f29cf55851d62b8728fdd1683d311afb.webp',
  dulux: 'images/dulux_z6669805730688_c375ad9ba90c3d57d166aa6f66640b7b.webp',
  sika: 'images/sika_a2.webp',
  nippon: '',
};
