const fs = require("fs");
const path = require("path");

const srcDir = "C:/Users/DELL/.gemini/antigravity/brain/ca6cdf4b-529a-4f27-b8c6-994eebe9e1ca";
const destDir = path.join(__dirname, "..", "assets", "images");

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const mappings = {
  "media__1783011445627.jpg": "mumbai_hero.jpg",
  "media__1783011453271.jpg": "manali_hero.jpg",
  "media__1783011458239.jpg": "ladakh_hero.jpg",
  "media__1783011470593.jpg": "pune_hero.jpg",
  "media__1783011854102.jpg": "bengaluru_hero.jpg"
};

for (const [src, dest] of Object.entries(mappings)) {
  const srcPath = path.join(srcDir, src);
  const destPath = path.join(destDir, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${src} to ${dest}`);
  } else {
    console.error(`Source not found: ${srcPath}`);
  }
}
console.log("All city hero images copied successfully!");
