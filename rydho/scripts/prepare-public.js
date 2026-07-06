/**
 * Copies compiled static site files into public/ for Vercel deployment.
 * Run after build.js: npm run build
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public");

const COPY_DIRS = ["assets", "src", "cities", "legal", "blog", "user", "tools"];

const COPY_ROOT_FILES = [
  "robots.txt",
  "sitemap.xml",
  "manifest.json",
  "sw.js",
];

function rmrf(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

rmrf(OUT);
fs.mkdirSync(OUT, { recursive: true });

for (const dir of COPY_DIRS) {
  const src = path.join(ROOT, dir);
  if (fs.existsSync(src)) {
    copyRecursive(src, path.join(OUT, dir));
  }
}

for (const file of COPY_ROOT_FILES) {
  const src = path.join(ROOT, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(OUT, file));
  }
}

for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith(".html")) {
    fs.copyFileSync(path.join(ROOT, entry.name), path.join(OUT, entry.name));
  }
}

console.log("Prepared Vercel output directory: public/");
