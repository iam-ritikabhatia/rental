const fs = require("fs");
const path = require("path");

const brainDir = "C:\\Users\\DELL\\.gemini\\antigravity\\brain\\ca6cdf4b-529a-4f27-b8c6-994eebe9e1ca";
const destDir = path.join(__dirname, "..", "assets", "images");

// Ensure destination exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const fileMap = {
  "media__1783000808649.jpg": "infographic.jpg",
  "media__1783000894717.jpg": "handover_leaseout.jpg",
  "media__1783000903190.jpg": "handover_shop.jpg",
  "media__1783000917992.jpg": "handover_helmet.jpg",
  "media__1783001040388.jpg": "desktop_hero_reference.jpg"
};

console.log("Copying user uploaded marketing images...");

Object.entries(fileMap).forEach(([srcName, destName]) => {
  const srcPath = path.join(brainDir, srcName);
  const destPath = path.join(destDir, destName);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcName} -> ${destName}`);
  } else {
    console.warn(`Source file not found: ${srcPath}`);
  }
});

console.log("Image copying task completed!");
