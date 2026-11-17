const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const items = [
  {
    id: 1,
    name: 'DeWalt 20V Cordless Hammer Drill',
    category: 'Power Tools',
    badge: 'Masonry & Wood Drilling',
    tag: '20V Dual Battery Pack',
    bg1: '#1e293b',
    bg2: '#0f172a',
    accent: '#f59e0b',
    iconText: 'DRILL'
  },
  {
    id: 2,
    name: 'Bosch 7-Inch Angle Grinder',
    category: 'Power Tools',
    badge: 'Metal Fabrication & Smoothing',
    tag: '8500 RPM High Torque',
    bg1: '#1e293b',
    bg2: '#0f172a',
    accent: '#38bdf8',
    iconText: 'GRINDER'
  },
  {
    id: 3,
    name: 'Honda 3000W Inverter Generator',
    category: 'Power & Energy',
    badge: 'Site Electricity Backup',
    tag: 'Pure Sine Wave 120V/240V',
    bg1: '#1e293b',
    bg2: '#0f172a',
    accent: '#ef4444',
    iconText: 'GENERATOR'
  },
  {
    id: 4,
    name: 'Wagner Professional Paint Sprayer',
    category: 'Painting & Finishing',
    badge: 'Exterior & Interior Spraying',
    tag: 'Airless High Pressure',
    bg1: '#1e293b',
    bg2: '#0f172a',
    accent: '#10b981',
    iconText: 'SPRAYER'
  },
  {
    id: 5,
    name: 'Makita Rotary Demolition Breaker',
    category: 'Demolition',
    badge: 'Tile & Concrete Demolition',
    tag: '15.5 Joules Impact Energy',
    bg1: '#1e293b',
    bg2: '#0f172a',
    accent: '#f97316',
    iconText: 'BREAKER'
  },
  {
    id: 6,
    name: 'Werner 24ft Heavy Duty Ladder',
    category: 'Access Equipment',
    badge: '2nd-Story Roofing & Repair',
    tag: '300-lb Commercial Duty',
    bg1: '#1e293b',
    bg2: '#0f172a',
    accent: '#6366f1',
    iconText: 'LADDER'
  },
  {
    id: 7,
    name: 'Caterpillar 1.8T Mini Excavator',
    category: 'Heavy Machinery',
    badge: 'Trenching & Earthmoving',
    tag: 'Rubber Tracks & Push Blade',
    bg1: '#1e293b',
    bg2: '#0f172a',
    accent: '#eab308',
    iconText: 'EXCAVATOR'
  },
  {
    id: 8,
    name: 'Stihl 14-Inch Concrete Cut-Off Saw',
    category: 'Drilling & Cutting',
    badge: 'Reinforced Concrete & Asphalt',
    tag: '70cc Gas Powered Wheel',
    bg1: '#1e293b',
    bg2: '#0f172a',
    accent: '#f43f5e',
    iconText: 'CUT SAW'
  },
  {
    id: 9,
    name: 'Wacker Neuson Soil Plate Compactor',
    category: 'Heavy Machinery',
    badge: 'Subbase & Soil Compaction',
    tag: '11 kN Centrifugal Force',
    bg1: '#1e293b',
    bg2: '#0f172a',
    accent: '#14b8a6',
    iconText: 'COMPACTOR'
  },
  {
    id: 10,
    name: 'Karcher 3000 PSI Pressure Washer',
    category: 'Cleaning Equipment',
    badge: 'Commercial Deep Washing',
    tag: '3000 PSI High Pressure',
    bg1: '#1e293b',
    bg2: '#0f172a',
    accent: '#06b6d4',
    iconText: 'WASHER'
  },
  {
    id: 11,
    name: 'JLG 19ft Electric Scissor Lift',
    category: 'Access Equipment',
    badge: 'Indoor Facility & Ceiling Access',
    tag: '19ft Reach, Non-Marking Tires',
    bg1: '#1e293b',
    bg2: '#0f172a',
    accent: '#a855f7',
    iconText: 'SCISSOR LIFT'
  },
  {
    id: 12,
    name: 'Atlas Copco 185 CFM Air Compressor',
    category: 'Power & Energy',
    badge: 'Pneumatic Rigs & Sandblasting',
    tag: '185 CFM Rotary Screw',
    bg1: '#1e293b',
    bg2: '#0f172a',
    accent: '#3b82f6',
    iconText: 'COMPRESSOR'
  }
];

function generateSvg(item) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="bgGrad${item.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${item.bg1}"/>
      <stop offset="100%" stop-color="${item.bg2}"/>
    </linearGradient>
    <linearGradient id="accentGrad${item.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${item.accent}"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.3"/>
    </linearGradient>
    <pattern id="grid${item.id}" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="800" height="500" fill="url(#bgGrad${item.id})"/>
  <rect width="800" height="500" fill="url(#grid${item.id})"/>

  <!-- Top Accent Bar -->
  <rect x="0" y="0" width="800" height="8" fill="${item.accent}"/>

  <!-- Category Badge -->
  <g transform="translate(60, 50)">
    <rect width="180" height="34" rx="17" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    <text x="90" y="22" fill="${item.accent}" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle" letter-spacing="1">
      ${item.category.toUpperCase()}
    </text>
  </g>

  <!-- Center Machine Visual Emblem -->
  <g transform="translate(400, 200)">
    <circle r="85" fill="rgba(255,255,255,0.04)" stroke="${item.accent}" stroke-width="2" stroke-dasharray="6,4"/>
    <circle r="70" fill="rgba(255,255,255,0.06)"/>
    <text x="0" y="8" fill="#ffffff" font-family="system-ui, sans-serif" font-size="17" font-weight="800" text-anchor="middle" letter-spacing="2">
      ${item.iconText}
    </text>
    <text x="0" y="28" fill="${item.accent}" font-family="system-ui, sans-serif" font-size="11" font-weight="600" text-anchor="middle" letter-spacing="1">
      COMMERCIAL FLEET
    </text>
  </g>

  <!-- Equipment Title -->
  <text x="400" y="340" fill="#ffffff" font-family="system-ui, sans-serif" font-size="28" font-weight="700" text-anchor="middle" letter-spacing="-0.5">
    ${item.name}
  </text>

  <!-- Subtitle Tag -->
  <text x="400" y="375" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="16" font-weight="500" text-anchor="middle">
    ${item.badge}
  </text>

  <!-- Specs Bottom Pill -->
  <g transform="translate(250, 415)">
    <rect width="300" height="38" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <text x="150" y="24" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle">
      ${item.tag}
    </text>
  </g>
</svg>`;
}

items.forEach(item => {
  const filePath = path.join(targetDir, `equipment-${item.id}.svg`);
  fs.writeFileSync(filePath, generateSvg(item), 'utf8');
  console.log(`Generated ${filePath}`);
});
console.log('All 12 local SVGs created successfully!');
