const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public', 'images');

const PINK = '#E50071';
const BLACK = '#1A1A1A';
const BG = '#F5F0EB';
const DARK_BG = '#2D2A24';

// City images
const cities = [
  { key: 'shanghai', name: 'SHANGHAI', subtitle: '上海 · The Bund · Pudong' },
  { key: 'beijing', name: 'BEIJING', subtitle: '北京 · Forbidden City · Great Wall' },
  { key: 'hangzhou', name: 'HANGZHOU', subtitle: '杭州 · West Lake · Tea' },
  { key: 'ningbo', name: 'NINGBO', subtitle: '宁波 · Port · Culture' },
  { key: 'huangshan', name: 'HUANGSHAN', subtitle: '黄山 · Yellow Mountains · UNESCO' },
];

// Hotel data
const hotels = {
  shanghai: [
    { id: 'sh1', name: 'Shangri-La Qiantan', district: 'Цяньтань', price: '25 000₽' },
    { id: 'sh2', name: 'Amanyangyun', district: 'Пригород', price: '127 000₽' },
    { id: 'sh3', name: 'The Sukhothai Shanghai', district: 'Центр', price: '18 600₽' },
    { id: 'sh4', name: 'Banyan Tree on the Bund', district: 'Бунд', price: '29 600₽' },
    { id: 'sh5', name: 'InterContinental Wonderland', district: 'Шэшань', price: '34 000₽' },
    { id: 'sh6', name: 'Radisson Blu New World', district: 'Народная пл.', price: '12 700₽' },
  ],
  beijing: [
    { id: 'bj1', name: 'Commune by the Great Wall', district: 'Бадалин', price: '17 000₽' },
    { id: 'bj2', name: 'Great Wall Box House', district: 'Сяншуй', price: '4 200₽' },
    { id: 'bj3', name: 'Beijing Safari Hotel', district: 'Дасин', price: '10 000₽' },
    { id: 'bj4', name: 'Aman at Summer Palace', district: 'Летний дворец', price: '55 000₽' },
    { id: 'bj5', name: 'Mandarin Oriental Qianmen', district: 'Цяньмэнь', price: '152 000₽' },
    { id: 'bj6', name: 'Unbounded Hotel Gubei', district: 'Губэй', price: '17 000₽' },
    { id: 'bj7', name: 'CHAO Beijing', district: 'Саньлитун', price: '23 700₽' },
    { id: 'bj8', name: 'The PuXuan Hotel & Spa', district: 'Ванфуцзин', price: '42 300₽' },
    { id: 'bj9', name: 'NUO Resort Universal', district: 'Тунчжоу', price: '25 400₽' },
    { id: 'bj10', name: 'The Temple Hotel', district: 'Храмы', price: '34 000₽' },
  ],
};

function citySVG(city) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2D2A24"/>
      <stop offset="100%" style="stop-color:#1A1A1A"/>
    </linearGradient>
    <pattern id="grid" patternUnits="userSpaceOnUse" width="80" height="80">
      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#E50071" stroke-width="1" opacity="0.15"/>
    </pattern>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <rect width="1600" height="900" fill="url(#grid)"/>
  <rect x="0" y="0" width="1600" height="900" fill="none" stroke="#E50071" stroke-width="8"/>
  <rect x="20" y="20" width="1560" height="860" fill="none" stroke="#E50071" stroke-width="2"/>
  <line x1="0" y1="280" x2="1600" y2="280" stroke="#E50071" stroke-width="3" opacity="0.5"/>
  <line x1="0" y1="620" x2="1600" y2="620" stroke="#E50071" stroke-width="3" opacity="0.5"/>
  <!-- Decorative circle -->
  <circle cx="1200" cy="350" r="200" fill="none" stroke="#E50071" stroke-width="2" opacity="0.2"/>
  <circle cx="1200" cy="350" r="150" fill="none" stroke="#E50071" stroke-width="1" opacity="0.15"/>
  <circle cx="1200" cy="350" r="100" fill="none" stroke="#E50071" stroke-width="1" opacity="0.1"/>
  <text x="80" y="200" font-family="Impact, 'Arial Black', sans-serif" font-size="140" font-weight="900" fill="#E50071" letter-spacing="8">${city.name}</text>
  <text x="80" y="260" font-family="'Courier New', monospace" font-size="24" fill="#F5F0EB" letter-spacing="4" opacity="0.8">${city.subtitle}</text>
  <!-- Decorative bars -->
  <rect x="80" y="500" width="600" height="4" fill="#E50071"/>
  <rect x="80" y="520" width="400" height="2" fill="#E50071" opacity="0.5"/>
  <text x="80" y="600" font-family="Impact, 'Arial Black', sans-serif" font-size="36" fill="#F5F0EB" letter-spacing="6" opacity="0.3">CHINA 2026</text>
</svg>`;
}

function hotelSVG(hotel) {
  // Generate a unique color tint based on hotel id
  const colors = ['#E50071', '#D40061', '#C00050', '#E50071', '#0033A0', '#D40061'];
  const accent = colors[hotel.id.charCodeAt(hotel.id.length - 1) % colors.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#2D2A24"/>
      <stop offset="100%" style="stop-color:#1A1A1A"/>
    </linearGradient>
    <pattern id="dots" patternUnits="userSpaceOnUse" width="30" height="30" patternTransform="rotate(45)">
      <circle cx="15" cy="15" r="1.5" fill="${accent}" opacity="0.12"/>
    </pattern>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <rect width="800" height="600" fill="url(#dots)"/>
  <rect x="0" y="0" width="800" height="600" fill="none" stroke="#E50071" stroke-width="6"/>
  <rect x="15" y="15" width="770" height="570" fill="none" stroke="#E50071" stroke-width="1.5"/>
  <!-- Accent line -->
  <rect x="0" y="0" width="8" height="600" fill="${accent}"/>
  <!-- Top corner marker -->
  <rect x="15" y="15" width="60" height="3" fill="${accent}"/>
  <rect x="15" y="15" width="3" height="40" fill="${accent}"/>
  <!-- Hotel icon area -->
  <rect x="60" y="180" width="120" height="120" fill="none" stroke="${accent}" stroke-width="2" opacity="0.3"/>
  <rect x="70" y="190" width="100" height="100" fill="none" stroke="${accent}" stroke-width="1" opacity="0.2"/>
  <!-- Hotel name -->
  <text x="60" y="120" font-family="Impact, 'Arial Black', sans-serif" font-size="40" font-weight="900" fill="#F5F0EB" letter-spacing="2">${hotel.name}</text>
  <text x="60" y="155" font-family="'Courier New', monospace" font-size="16" fill="#F5F0EB" opacity="0.6">${hotel.district}</text>
  <!-- Divider -->
  <rect x="60" y="370" width="680" height="1" fill="#E50071" opacity="0.4"/>
  <!-- Bottom info -->
  <text x="60" y="420" font-family="'Courier New', monospace" font-size="14" fill="#F5F0EB" opacity="0.4">HOTEL ID: ${hotel.id.toUpperCase()}</text>
  <text x="60" y="450" font-family="Impact, 'Arial Black', sans-serif" font-size="28" fill="${accent}" letter-spacing="3">${hotel.price}</text>
  <text x="60" y="480" font-family="'Courier New', monospace" font-size="12" fill="#F5F0EB" opacity="0.25">/ night per room</text>
  <!-- Bottom right tag -->
  <text x="700" y="560" font-family="Impact, 'Arial Black', sans-serif" font-size="14" fill="#E50071" letter-spacing="4" opacity="0.5" text-anchor="end">CHINA 2026</text>
  <!-- Corner bracket -->
  <rect x="770" y="570" width="15" height="15" fill="none" stroke="${accent}" stroke-width="2"/>
</svg>`;
}

// Generate city images
const citiesDir = path.join(PUBLIC, 'cities');
if (!fs.existsSync(citiesDir)) fs.mkdirSync(citiesDir, { recursive: true });

cities.forEach(city => {
  const filepath = path.join(citiesDir, city.key + '.jpg');
  if (fs.existsSync(filepath)) {
    const size = fs.statSync(filepath).size;
    if (size > 1000) {
      console.log(`SKIP (exists): cities/${city.key}.jpg (${size} bytes)`);
      return;
    }
  }
  // Write as SVG since JPG isn't possible, the HTML will reference either
  const svgPath = path.join(citiesDir, city.key + '.svg');
  fs.writeFileSync(svgPath, citySVG(city));
  console.log(`OK: cities/${city.key}.svg`);
});

// Generate hotel images
Object.entries(hotels).forEach(([city, hotelList]) => {
  const hotelDir = path.join(PUBLIC, 'hotels', city);
  if (!fs.existsSync(hotelDir)) fs.mkdirSync(hotelDir, { recursive: true });
  
  hotelList.forEach(hotel => {
    const svgPath = path.join(hotelDir, hotel.id + '.svg');
    fs.writeFileSync(svgPath, hotelSVG(hotel));
    console.log(`OK: hotels/${city}/${hotel.id}.svg`);
  });
});

console.log('\nDone! All placeholder images generated.');
