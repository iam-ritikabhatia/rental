/**
 * RYDHO Asset Generator
 * Writes extremely premium, layered vector SVG illustrations for categories, bikes, and users.
 * Downloads remote app screenshots for offline verification.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const imgFolder = path.join(__dirname, "assets", "images");
if (!fs.existsSync(imgFolder)) {
  fs.mkdirSync(imgFolder, { recursive: true });
}

// Download helper for screenshots
function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (Status Code: ${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`Successfully downloaded: ${path.basename(dest)}`);
        resolve();
      });
    }).on("error", (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

// -------------------------------------------------------------
// PREMIUM VECTOR SVG CODE GENERATION
// -------------------------------------------------------------

// 1. Premium Gearless Scooter SVG (Vespa/Activa hybrid)
const scooterSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff" />
      <stop offset="100%" style="stop-color:#f3f4f8" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#f11287;stop-opacity:0.12" />
      <stop offset="100%" style="stop-color:#f11287;stop-opacity:0" />
    </radialGradient>
    
    <!-- Metallic Gradients -->
    <linearGradient id="bodyPink" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f11287" />
      <stop offset="50%" style="stop-color:#d20f72" />
      <stop offset="100%" style="stop-color:#920a4e" />
    </linearGradient>
    <linearGradient id="chrome" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#e0e0e0" />
      <stop offset="50%" style="stop-color:#ffffff" />
      <stop offset="100%" style="stop-color:#b5b5b5" />
    </linearGradient>
    <linearGradient id="seatGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#2c2c35" />
      <stop offset="100%" style="stop-color:#141419" />
    </linearGradient>
    <linearGradient id="wheelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3c3c44" />
      <stop offset="50%" style="stop-color:#1c1c20" />
      <stop offset="100%" style="stop-color:#0d0d0f" />
    </linearGradient>
  </defs>

  <!-- Card Background -->
  <rect width="400" height="300" rx="18" fill="url(#bgGrad)" />
  <circle cx="200" cy="140" r="130" fill="url(#glow)" />
  
  <!-- Ground Shadow -->
  <ellipse cx="200" cy="245" rx="140" ry="12" fill="rgba(13,13,18,0.15)" filter="blur(6px)" />
  
  <!-- Rear Wheel -->
  <circle cx="105" cy="215" r="38" fill="url(#wheelGrad)" stroke="#ffffff" stroke-width="4" />
  <circle cx="105" cy="215" r="24" fill="url(#chrome)" />
  <circle cx="105" cy="215" r="8" fill="#1c1c20" />
  
  <!-- Front Wheel -->
  <circle cx="295" cy="215" r="38" fill="url(#wheelGrad)" stroke="#ffffff" stroke-width="4" />
  <circle cx="295" cy="215" r="24" fill="url(#chrome)" />
  <circle cx="295" cy="215" r="8" fill="#1c1c20" />

  <!-- Front Suspension Fork -->
  <path d="M 295,215 L 280,140" stroke="url(#chrome)" stroke-width="12" stroke-linecap="round" />
  
  <!-- Main Frame & Floorboard -->
  <path d="M 105,215 L 160,215 L 195,160 L 270,160" fill="none" stroke="#22222b" stroke-width="20" stroke-linecap="round" />
  <path d="M 160,215 L 250,215" stroke="url(#chrome)" stroke-width="10" stroke-linecap="round" /> <!-- Chrome step -->
  
  <!-- Rear Body Shell (Pink Engine Fairing) -->
  <path d="M 105,215 C 90,160 120,110 185,110 C 200,110 205,165 190,205 Z" fill="url(#bodyPink)" />
  
  <!-- Front Shield Apron -->
  <path d="M 270,160 L 290,95 C 295,80 275,80 260,82 L 245,150 Z" fill="url(#bodyPink)" />
  <!-- Front Fender (Mudguard) -->
  <path d="M 280,185 C 275,170 315,170 310,195 Z" fill="url(#bodyPink)" />

  <!-- Premium Leather Seat -->
  <path d="M 130,112 C 145,95 210,95 220,110 C 222,120 135,130 130,112 Z" fill="url(#seatGrad)" />
  <path d="M 135,108 Q 175,98 215,108" fill="none" stroke="#444452" stroke-width="2" /> <!-- Seat stitching detail -->
  
  <!-- Handlebars & Mirrors -->
  <path d="M 280,95 L 285,75" stroke="url(#chrome)" stroke-width="10" stroke-linecap="round" />
  <path d="M 270,75 L 300,73" stroke="#1c1c20" stroke-width="8" stroke-linecap="round" /> <!-- Grips -->
  <circle cx="265" cy="55" r="12" fill="url(#chrome)" /> <!-- Mirror Left -->
  <path d="M 275,70 L 267,58" stroke="url(#chrome)" stroke-width="3" />
  
  <!-- Headlight (Glowing Chrome) -->
  <path d="M 285,95 L 295,93" stroke="url(#chrome)" stroke-width="14" stroke-linecap="round" />
  <circle cx="295" cy="93" r="6" fill="#fff" />
  
  <!-- Pillion Grab Rail -->
  <path d="M 115,115 C 105,115 110,135 125,135" fill="none" stroke="url(#chrome)" stroke-width="6" stroke-linecap="round" />
</svg>
`;

// 2. Premium Cruiser Motorcycle SVG (Royal Enfield style)
const cruiserSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff" />
      <stop offset="100%" style="stop-color:#f3f4f8" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#f11287;stop-opacity:0.12" />
      <stop offset="100%" style="stop-color:#f11287;stop-opacity:0" />
    </radialGradient>
    
    <!-- Metallic paint & chrome -->
    <linearGradient id="metalGrey" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4a4a5a" />
      <stop offset="50%" style="stop-color:#2a2a35" />
      <stop offset="100%" style="stop-color:#16161c" />
    </linearGradient>
    <linearGradient id="bodyPink" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f11287" />
      <stop offset="100%" style="stop-color:#bd0c67" />
    </linearGradient>
    <linearGradient id="chrome" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#dedede" />
      <stop offset="50%" style="stop-color:#ffffff" />
      <stop offset="100%" style="stop-color:#adadad" />
    </linearGradient>
    <linearGradient id="tireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3c3c44" />
      <stop offset="100%" style="stop-color:#0d0d0f" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="400" height="300" rx="18" fill="url(#bgGrad)" />
  <circle cx="200" cy="140" r="130" fill="url(#glow)" />
  
  <!-- Ground Shadow -->
  <ellipse cx="200" cy="245" rx="150" ry="10" fill="rgba(13,13,18,0.18)" filter="blur(5px)" />
  
  <!-- Spoke Rear Wheel -->
  <circle cx="100" cy="205" r="42" fill="url(#tireGrad)" stroke="#fff" stroke-width="4" />
  <circle cx="100" cy="205" r="28" fill="none" stroke="url(#chrome)" stroke-width="3" />
  <!-- Spokes -->
  <path d="M 100,163 L 100,247 M 58,205 L 142,205 M 70,175 L 130,235 M 70,235 L 130,175" stroke="url(#chrome)" stroke-width="1.5" />
  <circle cx="100" cy="205" r="14" fill="url(#metalGrey)" />

  <!-- Spoke Front Wheel -->
  <circle cx="300" cy="205" r="42" fill="url(#tireGrad)" stroke="#fff" stroke-width="4" />
  <circle cx="300" cy="205" r="28" fill="none" stroke="url(#chrome)" stroke-width="3" />
  <!-- Spokes -->
  <path d="M 300,163 L 300,247 M 258,205 L 342,205 M 270,175 L 330,235 M 270,235 L 330,175" stroke="url(#chrome)" stroke-width="1.5" />
  <circle cx="300" cy="205" r="14" fill="url(#metalGrey)" />

  <!-- Front Forks suspension -->
  <path d="M 300,205 L 260,110" stroke="url(#chrome)" stroke-width="8" stroke-linecap="round" />
  
  <!-- Engine Cylinders Block (Layered Mechanical Details) -->
  <rect x="150" y="165" width="65" height="50" rx="6" fill="url(#metalGrey)" stroke="#fff" stroke-width="1" />
  <line x1="145" y1="175" x2="220" y2="175" stroke="#ffffff" stroke-width="3" />
  <line x1="145" y1="185" x2="220" y2="185" stroke="#ffffff" stroke-width="3" />
  <line x1="145" y1="195" x2="220" y2="195" stroke="#ffffff" stroke-width="3" />
  <circle cx="185" cy="180" r="10" fill="url(#chrome)" />
  
  <!-- Teardrop Fuel Tank -->
  <path d="M 160,140 Q 210,105 250,135 L 245,160 L 165,160 Z" fill="url(#bodyPink)" />
  <!-- Tank Pad Accent -->
  <path d="M 195,130 Q 215,120 230,135" fill="none" stroke="url(#metalGrey)" stroke-width="8" stroke-linecap="round" />

  <!-- Split Leather Seats -->
  <path d="M 120,132 C 122,122 155,122 165,135 C 167,142 120,150 120,132 Z" fill="#1c1c20" /> <!-- Rider seat -->
  <path d="M 88,146 C 90,140 115,140 120,150 Z" fill="#1c1c20" stroke="url(#chrome)" stroke-width="1" /> <!-- Pillion seat -->

  <!-- Chrome Swept Silencer Exhaust -->
  <path d="M 165,195 Q 220,195 285,212" fill="none" stroke="url(#chrome)" stroke-width="10" stroke-linecap="round" />
  
  <!-- Handlebars & Vintage Round Lamp -->
  <path d="M 260,110 L 255,85 L 235,80" fill="none" stroke="url(#chrome)" stroke-width="8" stroke-linecap="round" />
  <circle cx="268" cy="100" r="10" fill="url(#chrome)" />
  <path d="M 268,100 L 278,100" stroke="#fff" stroke-width="8" stroke-linecap="round" /> <!-- Glow headlight -->
</svg>
`;

// 3. Premium Commuter Motorcycle SVG (Sporty street bike)
const commuterSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff" />
      <stop offset="100%" style="stop-color:#f3f4f8" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#f11287;stop-opacity:0.12" />
      <stop offset="100%" style="stop-color:#f11287;stop-opacity:0" />
    </radialGradient>
    <linearGradient id="bodyBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#111116" />
      <stop offset="100%" style="stop-color:#f11287" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" rx="18" fill="url(#bgGrad)" />
  <circle cx="200" cy="140" r="130" fill="url(#glow)" />
  <ellipse cx="200" cy="245" rx="145" ry="8" fill="rgba(13,13,18,0.15)" filter="blur(4px)" />

  <!-- Wheels -->
  <circle cx="100" cy="205" r="40" fill="#1c1c20" stroke="#fff" stroke-width="6" />
  <circle cx="100" cy="205" r="26" fill="#f3f4f8" stroke="#111" stroke-width="3" />
  <circle cx="300" cy="205" r="40" fill="#1c1c20" stroke="#fff" stroke-width="6" />
  <circle cx="300" cy="205" r="26" fill="#f3f4f8" stroke="#111" stroke-width="3" />

  <!-- Frame & Tank -->
  <path d="M 100,205 L 170,135 L 260,135 L 300,205" fill="none" stroke="#222" stroke-width="14" />
  <path d="M 170,135 Q 215,100 255,130 Z" fill="url(#bodyBlue)" /> <!-- Sporty fuel tank -->
  <path d="M 120,135 Q 160,120 180,140 Z" fill="#222" /> <!-- Seat -->

  <!-- Front forks -->
  <path d="M 300,205 L 265,100" stroke="#888" stroke-width="8" stroke-linecap="round" />
  <circle cx="270" cy="100" r="8" fill="#ffa800" /> <!-- Indicator -->
</svg>
`;

// 4. User Avatars
const userSvg = (name) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f11287" />
      <stop offset="100%" style="stop-color:#820847" />
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="56" fill="url(#avatarGrad)" stroke="#ffffff" stroke-width="4" />
  <text x="50%" y="54%" font-family="'Outfit', sans-serif" font-weight="900" font-size="44" fill="#ffffff" dominant-baseline="middle" text-anchor="middle">
    ${name.charAt(0)}
  </text>
</svg>
`;

// 5. Blog Banners & Weekend GetawaysSunset Illustrations
const blogSvg = (title) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%">
  <defs>
    <linearGradient id="blogGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f11287" />
      <stop offset="40%" style="stop-color:#a20958" />
      <stop offset="100%" style="stop-color:#0d0d12" />
    </linearGradient>
    <linearGradient id="sun" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffb800" />
      <stop offset="100%" style="stop-color:#f11287" />
    </linearGradient>
  </defs>
  
  <rect width="800" height="400" fill="url(#blogGrad)" />
  
  <!-- Glowing Sun -->
  <circle cx="400" cy="240" r="100" fill="url(#sun)" opacity="0.8" />
  
  <!-- Mountain Silhouettes -->
  <path d="M 0,400 L 150,220 L 320,310 L 520,180 L 800,400 Z" fill="#14141d" opacity="0.9" />
  <path d="M 80,400 L 250,250 L 410,340 L 680,210 L 800,400 Z" fill="#0d0d12" />
  
  <!-- Heading Title -->
  <rect x="100" y="50" width="600" height="80" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
  <text x="50%" y="90" font-family="'Outfit', sans-serif" font-weight="900" font-size="28" fill="#ffffff" dominant-baseline="middle" text-anchor="middle">
    ${title.toUpperCase()}
  </text>
  
  <!-- Road lines -->
  <path d="M 380,400 L 398,340 M 420,400 L 402,340" stroke="#ffa800" stroke-width="4" stroke-dasharray="8 6" opacity="0.6" />
</svg>
`;

// Write local SVGs
fs.writeFileSync(path.join(imgFolder, "cat_scooters.svg"), scooterSvg, "utf8");
fs.writeFileSync(path.join(imgFolder, "cat_commuters.svg"), commuterSvg, "utf8");
fs.writeFileSync(path.join(imgFolder, "cat_cruisers.svg"), cruiserSvg, "utf8");

fs.writeFileSync(path.join(imgFolder, "honda_activa.svg"), scooterSvg, "utf8");
fs.writeFileSync(path.join(imgFolder, "tvs_jupiter.svg"), scooterSvg, "utf8");
fs.writeFileSync(path.join(imgFolder, "vespa_zx.svg"), scooterSvg, "utf8");

fs.writeFileSync(path.join(imgFolder, "re_classic.svg"), cruiserSvg, "utf8");
fs.writeFileSync(path.join(imgFolder, "re_himalayan.svg"), cruiserSvg, "utf8");
fs.writeFileSync(path.join(imgFolder, "yamaha_fzs.svg"), commuterSvg, "utf8");

fs.writeFileSync(path.join(imgFolder, "user1.svg"), userSvg("Rahul"), "utf8");
fs.writeFileSync(path.join(imgFolder, "user2.svg"), userSvg("Priya"), "utf8");
fs.writeFileSync(path.join(imgFolder, "user3.svg"), userSvg("Aditya"), "utf8");

fs.writeFileSync(path.join(imgFolder, "blog1.svg"), blogSvg("Scenic Pune Routes"), "utf8");
fs.writeFileSync(path.join(imgFolder, "blog2.svg"), blogSvg("Rent vs Own Scooters"), "utf8");
fs.writeFileSync(path.join(imgFolder, "blog3.svg"), blogSvg("Beat Hinjewadi Traffic"), "utf8");
fs.writeFileSync(path.join(imgFolder, "blog4.svg"), blogSvg("Rent vs Rickshaw Pune"), "utf8");
fs.writeFileSync(path.join(imgFolder, "rydho_share_banner.jpg"), blogSvg("RYDHO Marketplace"), "utf8");

console.log("RYDHO Premium Vector Graphics generated successfully.");

// 3. Download remote partner mockup screens from rentzzo
async function downloadPartnerScreens() {
  const screens = [
    { url: "https://assets.zyrosite.com/mP437XvL8nfL0bqK/renzzo-how-to-list-your-bike-1-YBgj8py0nwu4EgBl.png", name: "partner_screen_1.png" },
    { url: "https://assets.zyrosite.com/mP437XvL8nfL0bqK/renzzo-how-to-list-your-bike-2-dWxLwl071LSzxwvG.png", name: "partner_screen_2.png" },
    { url: "https://assets.zyrosite.com/mP437XvL8nfL0bqK/renzzo-how-to-list-your-bike-3-mjE4Q25lqWCKgLE9.png", name: "partner_screen_3.png" }
  ];

  console.log("Downloading partner app mockup screens from rent.rentzzo.com...");
  for (const s of screens) {
    try {
      await downloadImage(s.url, path.join(imgFolder, s.name));
    } catch (err) {
      console.warn(`Failed to download ${s.name}: ${err.message}`);
    }
  }
}

downloadPartnerScreens();
