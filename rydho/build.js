/**
 * RYDHO Website Static Page Compiler
 * Pure Node.js - No dependencies required
 */

const fs = require("fs");
const path = require("path");

// Load central content database
const db = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json"), "utf8"));

// Load templates
const shellTpl = fs.readFileSync(path.join(__dirname, "templates", "shell.html"), "utf8");
const headerTpl = fs.readFileSync(path.join(__dirname, "templates", "header.html"), "utf8");
const footerTpl = fs.readFileSync(path.join(__dirname, "templates", "footer.html"), "utf8");
const homeTpl = fs.readFileSync(path.join(__dirname, "templates", "home.html"), "utf8");
const categoryTpl = fs.readFileSync(path.join(__dirname, "templates", "category.html"), "utf8");
const cityTpl = fs.readFileSync(path.join(__dirname, "templates", "city.html"), "utf8");
const bookingTpl = fs.readFileSync(path.join(__dirname, "templates", "booking.html"), "utf8");
const hostTpl = fs.readFileSync(path.join(__dirname, "templates", "host.html"), "utf8");
const userTpl = fs.readFileSync(path.join(__dirname, "templates", "user.html"), "utf8");
const blogTpl = fs.readFileSync(path.join(__dirname, "templates", "blog.html"), "utf8");
const legalTpl = fs.readFileSync(path.join(__dirname, "templates", "legal.html"), "utf8");
const toolTpl = fs.readFileSync(path.join(__dirname, "templates", "tool.html"), "utf8");
const rtoTpl = fs.readFileSync(path.join(__dirname, "templates", "rto-agents.html"), "utf8");
const repairTpl = fs.readFileSync(path.join(__dirname, "templates", "repair-breakdown.html"), "utf8");
const reselloTpl = fs.readFileSync(path.join(__dirname, "templates", "resello.html"), "utf8");

// List of all compiled routes for sitemap.xml
const compiledRoutes = [];

// Ensure output directories exist
function ensureDirExists(dirPath) {
  const absolutePath = path.resolve(__dirname, dirPath);
  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(absolutePath, { recursive: true });
  }
}

// -------------------------------------------------------------
// MICRO-TEMPLATING ENGINE IMPLEMENTATION
// Custom parser to replace Handlebars-style loops and variables
// -------------------------------------------------------------

function compileHtml(template, context) {
  let output = template;

  // 1. Process Conditionals: {{#if var}}...{{/if}}
  output = output.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, key, content) => {
    return context[key] ? compileHtml(content, context) : "";
  });

  // 2. Process Negations: {{#unless var}}...{{/unless}}
  output = output.replace(/\{\{#unless (\w+)\}\}([\s\S]*?)\{\{\/unless\}\}/g, (match, key, content) => {
    return !context[key] ? compileHtml(content, context) : "";
  });

  // 3. Process If-Equals: {{#if_eq a b}}...{{/if_eq}}
  output = output.replace(/\{\{#if_eq (\w+)\s+"?([^"}]+)"?\}\}([\s\S]*?)\{\{\/if_eq\}\}/g, (match, key, val, content) => {
    return context[key] === val ? compileHtml(content, context) : "";
  });

  // 4. Process Loop: {{#each cities}}...{{/each}}
  output = output.replace(/\{\{#each cities\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, content) => {
    return db.cities.map(city => {
      return compileHtml(content, { ...context, ...city });
    }).join("");
  });

  // 5. Process Loop: {{#each categories}}...{{/each}}
  output = output.replace(/\{\{#each categories\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, content) => {
    return db.categories.map(cat => {
      return compileHtml(content, { ...context, ...cat });
    }).join("");
  });

  // 6. Process Loop: {{#each popularVehicles}}...{{/each}}
  output = output.replace(/\{\{#each popularVehicles\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, content) => {
    const popular = db.vehicles.filter(v => v.popular);
    return popular.map(bike => {
      return compileHtml(content, { ...context, ...bike });
    }).join("");
  });

  // 7. Process Loop: {{#each categoryVehicles}}...{{/each}}
  output = output.replace(/\{\{#each categoryVehicles\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, content) => {
    const catSlug = context.categorySlug;
    const matches = db.vehicles.filter(v => v.category === catSlug);
    return matches.map(bike => {
      return compileHtml(content, { ...context, ...bike });
    }).join("");
  });

  // 8. Process Loop: {{#each testimonials}}...{{/each}}
  output = output.replace(/\{\{#each testimonials\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, content) => {
    return db.testimonials.map(t => {
      return compileHtml(content, { ...context, ...t });
    }).join("");
  });

  // 8b. Process Loop: {{#each hostStories}}...{{/each}}
  output = output.replace(/\{\{#each hostStories\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, content) => {
    const stories = context.hostStories || db.hostStories || [];
    return stories.map(s => {
      return compileHtml(content, { ...context, ...s });
    }).join("");
  });

  // 9. Process Loop: {{#each faq}}...{{/each}}
  output = output.replace(/\{\{#each faq\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, content) => {
    return db.faq.map(f => {
      return compileHtml(content, { ...context, ...f });
    }).join("");
  });

  // 10. Process Loop: {{#each blogs}}...{{/each}}
  output = output.replace(/\{\{#each blogs\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, content) => {
    return db.blogs.map(b => {
      return compileHtml(content, { ...context, ...b });
    }).join("");
  });

  // 11. Process Loop: {{#each cityAreas}}...{{/each}}
  output = output.replace(/\{\{#each cityAreas\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, content) => {
    const areas = context.areas || [];
    return areas.map(area => {
      return compileHtml(content, { ...context, ...area });
    }).join("");
  });

  // 11b. Nested loop: {{#each this.areas}}...{{/each}}
  output = output.replace(/\{\{#each this\.areas\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, content) => {
    const areas = context.areas || [];
    return areas.map(area => {
      return compileHtml(content, { ...context, ...area });
    }).join("");
  });

  // 12. Process Star Helper: {{#each_stars rating}}...{{/each_stars}}
  output = output.replace(/\{\{#each_stars (\w+)\}\}([\s\S]*?)\{\{\/each_stars\}\}/g, (match, key, content) => {
    const ratingVal = parseInt(context[key]) || 5;
    return Array(ratingVal).fill(content).join("");
  });

  // 13. Variables replacement (HTML Safe): {{{var}}}
  output = output.replace(/\{\{\{([\w\.]+)\}\}\}/g, (match, key) => {
    return getNestedValue(context, key) || "";
  });

  // 14. Variables replacement (Standard): {{var}}
  output = output.replace(/\{\{([\w\.\/\:\%]+)\}\}/g, (match, key) => {
    if (key.startsWith("encodeURIComponent ")) {
      const realKey = key.replace("encodeURIComponent ", "");
      return encodeURIComponent(getNestedValue(context, realKey) || "");
    }
    return escapeHtml(String(getNestedValue(context, key) || ""));
  });

  return output;
}

// Get nested properties e.g. "specs.engine" or "this.slug" inside {{#each}} loops
function getNestedValue(obj, keyPath) {
  let path = keyPath;
  if (path.startsWith("this.")) {
    path = path.slice(5);
  }
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

// Escape HTML characters to protect string outputs
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Write the page wrapped in the master shell
function writePage(filePath, title, description, keywords, canonical, contentHtml, schemaObj) {
  const folder = path.dirname(filePath);
  if (folder !== ".") ensureDirExists(folder);

  const schemaJson = JSON.stringify(schemaObj, null, 2);
  
  const headerHtml = compileHtml(headerTpl, { cities: db.cities });
  const footerHtml = compileHtml(footerTpl, {});

  const fullHtml = compileHtml(shellTpl, {
    title,
    description,
    keywords,
    canonical,
    domain: db.brand.domain,
    header: headerHtml,
    content: contentHtml,
    footer: footerHtml,
    schema: schemaJson
  });

  fs.writeFileSync(filePath, fullHtml, "utf8");
  
  // Track url route for sitemap
  const relativeUrl = filePath.replace(__dirname, "").replace(/\\/g, "/");
  compiledRoutes.push(relativeUrl);
  console.log(`Compiled: ${relativeUrl}`);
}

// -------------------------------------------------------------
// SEO & BLOG ENGINE HELPER FUNCTIONS
// -------------------------------------------------------------

function generateTOC(content) {
  const headings = [];
  const regex = /<h([23])>([\s\S]*?)<\/h\1>/g;
  let match;
  let idCounter = 1;
  
  let modifiedContent = content.replace(regex, (m, level, text) => {
    const id = `heading-${idCounter++}`;
    const cleanText = text.replace(/<[^>]+>/g, "").trim();
    headings.push({ level: parseInt(level), text: cleanText, id });
    return `<h${level} id="${id}">${text}</h${level}>`;
  });

  if (headings.length === 0) return { tocHtml: "", contentHtml: content };

  let tocHtml = `<div class="toc-container" style="background: var(--bg-light); border: 1px solid var(--border-color); padding: 24px; border-radius: var(--radius-sm); margin-bottom: 30px;">
    <strong style="color: var(--secondary); display: block; margin-bottom: 12px; font-size: 1.1rem;"><i class="fa-solid fa-list-ul text-primary"></i> Table of Contents</strong>
    <ul style="list-style: none; padding-left: 0; margin-bottom: 0; display: flex; flex-direction: column; gap: 8px;">`;
  
  headings.forEach(h => {
    const padding = h.level === 3 ? "padding-left: 15px;" : "";
    const fontSize = h.level === 3 ? "font-size: 0.85rem;" : "font-size: 0.9rem; font-weight: 600;";
    tocHtml += `<li style="${padding}"><a href="#${h.id}" style="${fontSize} color: var(--text-dark); text-decoration: none;" class="toc-link">${h.text}</a></li>`;
  });
  tocHtml += `</ul></div>`;

  return { tocHtml, contentHtml: modifiedContent };
}

function generateFAQs(faqs) {
  if (!faqs || faqs.length === 0) return "";
  let html = `<div class="faq-section" style="margin-top: 50px; border-top: 1px solid var(--border-color); padding-top: 40px;">
    <h3 style="margin-bottom: 24px; font-weight:800; color:var(--secondary);"><i class="fa-solid fa-circle-question text-primary"></i> Frequently Asked Questions</h3>
    <div style="display: flex; flex-direction: column; gap: 16px;">`;
  faqs.forEach(faq => {
    html += `<details style="background: var(--bg-light); border: 1px solid var(--border-color); padding: 18px; border-radius: var(--radius-sm); cursor: pointer; transition: background 0.2s;">
      <summary style="font-weight: 700; color: var(--secondary); outline: none; font-size:1rem; list-style:none; display:flex; justify-content:space-between; align-items:center;">
        <span>${faq.q}</span>
        <i class="fa-solid fa-chevron-down" style="font-size:0.8rem; color:var(--text-gray);"></i>
      </summary>
      <p style="margin-top: 12px; font-size: 0.9rem; color: var(--text-gray); line-height: 1.6; cursor:default;">${faq.a}</p>
    </details>`;
  });
  html += `</div></div>`;
  return html;
}

function injectInternalLinks(html) {
  const links = {
    "used bike resale value calculator": "/tools/used-bike-resale-value-calculator.html",
    "bike mileage & fuel cost calculator": "/tools/bike-mileage-fuel-cost-calculator.html",
    "traffic police challan advisor": "/tools/traffic-police-challan-consultant.html",
    "RTO agent": "/rto-agents.html",
    "breakdown mechanics": "/repair-breakdown.html",
    "used buy/sell marketplace": "/resello.html",
    "Kharadi": "/cities/pune/kharadi-bike-rental.html",
    "Hinjawadi": "/cities/pune/hinjawadi-bike-rental.html",
    "Viman Nagar": "/cities/pune/viman-nagar-bike-rental.html"
  };

  let result = html;
  for (const [term, url] of Object.entries(links)) {
    const regex = new RegExp(`\\b(${term})\\b`, "i");
    result = result.replace(regex, `<a href="${url}" style="color: var(--primary); font-weight: 600; text-decoration: underline;">$1</a>`);
  }
  return result;
}

function getRelatedPosts(currentPost, blogs) {
  const related = blogs.filter(post => post.slug !== currentPost.slug && (post.category === currentPost.category || post.author === currentPost.author)).slice(0, 2);
  if (related.length === 0) return "";

  let html = `<div style="margin-top: 60px; border-top: 1px solid var(--border-color); padding-top: 40px;">
    <h3 style="margin-bottom: 24px; font-weight:800; color:var(--secondary);">Related Articles You May Like</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;" class="hero-grid">`;

  related.forEach(post => {
    html += `<div class="vehicle-card" style="min-height: auto; background:#fff;">
      <div style="height: 160px; background: url('/${post.image}') center/cover;"></div>
      <div style="padding: 20px;">
        <span style="font-size:0.75rem; color:var(--primary); font-weight:600;">${post.date} • ${post.category}</span>
        <h4 style="font-size: 1.1rem; margin-top: 6px; margin-bottom: 12px; line-height: 1.3;">
          <a href="/blog/${post.slug}.html" style="color:var(--secondary); font-weight:700;">${post.title}</a>
        </h4>
        <a href="/blog/${post.slug}.html" style="color: var(--primary); font-weight: 600; font-size: 0.85rem;">Read More <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </div>`;
  });

  html += `</div></div>`;
  return html;
}

// -------------------------------------------------------------
// BUILD FLOW EXECUTION
// -------------------------------------------------------------

console.log("Starting RYDHO Website Static Build Compiler...");

// Ensure folders exist
ensureDirExists("cities");
ensureDirExists("cities/pune");
ensureDirExists("cities/mumbai");
ensureDirExists("cities/bangalore");
ensureDirExists("cities/goa");
ensureDirExists("legal");
ensureDirExists("user");
ensureDirExists("blog");
ensureDirExists("tools");

// --- 1. COMPILE HOME PAGE ---
const homeContent = compileHtml(homeTpl, {
  cities: db.cities,
  categories: db.categories,
  testimonials: db.testimonials,
  faq: db.faq,
  cityAreasJson: JSON.stringify(
    Object.fromEntries(
      db.cities.map((city) => [
        city.slug,
        city.areas.map((area) => ({ name: area.name, slug: area.slug }))
      ])
    )
  )
});

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": db.brand.name,
  "url": db.brand.domain,
  "logo": `${db.brand.domain}/assets/icons/logo.png`,
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": db.brand.phone,
    "contactType": "customer service",
    "email": db.brand.email
  },
  "sameAs": [
    "https://facebook.com/rydho",
    "https://instagram.com/rydho"
  ]
};
writePage(
  path.join(__dirname, "index.html"),
  "RYDHO - Rent Scooters & Bikes | 0% Security Deposit | Instant KYC",
  "Rent scooters like Honda Activa and motorcycles like Royal Enfield. Secure peer-to-peer two-wheeler rentals at 0% security deposit with instant KYC verification. Insured rides starting at ₹199/day.",
  "bike rental, scooter rental, rent Activa, rent Royal Enfield, peer to peer rental",
  `${db.brand.domain}/index.html`,
  homeContent,
  homeSchema
);

// --- 2. COMPILE CATEGORY PAGES ---
db.categories.forEach(cat => {
  const catContent = compileHtml(categoryTpl, {
    categoryName: cat.name,
    categorySlug: cat.slug,
    categoryDescription: cat.description,
    domain: db.brand.domain
  });
  
  const catSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${cat.name} Rentals`,
    "description": cat.description,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "199",
      "highPrice": "999",
      "offerCount": "10"
    }
  };

  writePage(
    path.join(__dirname, `${cat.slug}-rental.html`),
    `${cat.name} Rentals - 0% Deposit | RYDHO`,
    `Rent top-rated ${cat.name.toLowerCase()} in your city. Standard daily rates, doorstep delivery, sanitized helmets, and 24/7 breakdown help included.`,
    `${cat.name.toLowerCase()} rental, hire ${cat.name.toLowerCase()}`,
    `${db.brand.domain}/${cat.slug}-rental.html`,
    catContent,
    catSchema
  );
});

// Create generic bike & car rental pages for navigation fallback
writePage(
  path.join(__dirname, "bike-rental.html"),
  "Premium Bike Rental Online - Rent Motorcycles | RYDHO",
  "Hire top-tier cruiser and commuter motorcycles at RYDHO. Rent Royal Enfield Classic 350, Himalayan, FZ-S starting at ₹499/day. Zero deposit.",
  "bike rental, motorcycle hire, rent Enfield",
  `${db.brand.domain}/bike-rental.html`,
  compileHtml(categoryTpl, { categoryName: "Bikes & Motorcycles", categorySlug: "cruisers", categoryDescription: "Select from commuter bikes and premium cruisers.", domain: db.brand.domain }),
  {}
);
writePage(
  path.join(__dirname, "scooter-rental.html"),
  "Scooter Rental Online - Rent Activa, Vespa | RYDHO",
  "Rent automatic scooters online. Book Honda Activa, TVS Jupiter, Vespa starting at ₹299/day with clean helmets and door delivery.",
  "scooter rental, rent Activa, rent Jupiter",
  `${db.brand.domain}/scooter-rental.html`,
  compileHtml(categoryTpl, { categoryName: "Scooters & Gearless Rides", categorySlug: "scooters", categoryDescription: "Automatic, easy commuter gearless scooters.", domain: db.brand.domain }),
  {}
);
writePage(
  path.join(__dirname, "self-drive-vehicles.html"),
  "Self Drive Bike & Scooter Rentals | RYDHO",
  "Self-drive two-wheeler rental packages. Low daily, weekly, and monthly rates on scooters and motorcycles.",
  "self drive bike rental, two wheeler hire",
  `${db.brand.domain}/self-drive-vehicles.html`,
  compileHtml(categoryTpl, { categoryName: "Self-Drive Fleet", categorySlug: "scooters", categoryDescription: "Take control of your travel scenes.", domain: db.brand.domain }),
  {}
);

// --- 2.5. COMPILE RTO & REPAIR DIRECTORIES ---
writePage(
  path.join(__dirname, "rto-agents.html"),
  "Verified RTO Agents & Documentation Consultants | RYDHO",
  "Find verified local RTO agents in Pune, Bangalore, and Mumbai. Get help with ownership transfers, NOC clearances, address changes, and duplicate registrations.",
  "RTO agent, vehicle transfer agent, DL agent, RTO consultant",
  `${db.brand.domain}/rto-agents.html`,
  compileHtml(rtoTpl, { cities: db.cities }),
  {}
);

writePage(
  path.join(__dirname, "repair-breakdown.html"),
  "24/7 Roadside Assistance & Two-Wheeler Mechanics near Me | RYDHO",
  "Pincode-searchable directory of local two-wheeler garages, mechanic shops, and puncture repair services in Pune, Mumbai, and Bangalore. Contact emergency towing.",
  "mechanic near me, puncture repair shop, bike towing, roadside assistance",
  `${db.brand.domain}/repair-breakdown.html`,
  compileHtml(repairTpl, {}),
  {}
);

writePage(
  path.join(__dirname, "resello.html"),
  "Resello Used Bike & Scooter Buy/Sell Marketplace - Pre-Owned Two-Wheelers | RYDHO",
  "India's direct pre-owned two-wheeler buy and sell marketplace. Buy used Honda Activa, Royal Enfield, and KTM from verified owners with zero commission.",
  "used bikes, buy second hand scooter, pre-owned motorcycle, OLX used bike, Resello RYDHO",
  `${db.brand.domain}/resello.html`,
  compileHtml(reselloTpl, {}),
  {}
);

// --- 3. COMPILE PROGRAMMATIC CITY & LOCAL AREA PAGES (Deep Silos) ---
db.cities.forEach(city => {
  // Main City Page
  const cityContent = compileHtml(cityTpl, {
    cityName: city.name,
    citySlug: city.slug,
    cityAreas: city.areas,
    areaName: "",
    areaSlug: ""
  });

  const citySchema = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "name": `RYDHO Bike Rental ${city.name}`,
    "description": city.metaDescription,
    "url": `${db.brand.domain}/cities/${city.slug}-bike-rental.html`,
    "priceRange": "₹199 - ₹999",
    "areaServed": city.name,
    "telephone": db.brand.phone
  };

  writePage(
    path.join(__dirname, "cities", `${city.slug}-bike-rental.html`),
    city.metaTitle,
    city.metaDescription,
    `bike rental ${city.name}, scooter hire ${city.name}, rent activa ${city.name}`,
    `${db.brand.domain}/cities/${city.slug}-bike-rental.html`,
    cityContent,
    citySchema
  );

  // Nested Sub-Area pages (e.g. Pune/Kharadi)
  city.areas.forEach(area => {
    const areaContent = compileHtml(cityTpl, {
      cityName: city.name,
      citySlug: city.slug,
      cityAreas: city.areas,
      areaName: area.name,
      areaSlug: area.slug
    });

    const areaTitle = `Bike & Scooter Rental in ${area.name}, ${city.name} - RYDHO`;
    const areaDesc = `Rent scooters and bikes in ${area.name}, ${city.name} starting at ₹199/day. Choose from Honda Activa, Jupiter, Royal Enfield with 0% deposit. Door delivery available in ${area.name}.`;

    const areaSchema = {
      "@context": "https://schema.org",
      "@type": "AutoRental",
      "name": `RYDHO Bike Rental ${area.name}`,
      "description": areaDesc,
      "url": `${db.brand.domain}/cities/${city.slug}/${area.slug}-bike-rental.html`,
      "priceRange": "₹199 - ₹999",
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": area.name
      },
      "telephone": db.brand.phone
    };

    writePage(
      path.join(__dirname, "cities", city.slug, `${area.slug}-bike-rental.html`),
      areaTitle,
      areaDesc,
      `bike rental ${area.name}, scooter rental ${area.name} ${city.name}`,
      `${db.brand.domain}/cities/${city.slug}/${area.slug}-bike-rental.html`,
      areaContent,
      areaSchema
    );
  });

  // --- 3.2. COMPILE PROGRAMMATIC BIKE MODEL & SERVICE PAGES (Silo Expansion) ---
  const models = [
    { name: "Honda Activa", slug: "honda-activa" },
    { name: "TVS Jupiter", slug: "tvs-jupiter" },
    { name: "Royal Enfield Classic 350", slug: "royal-enfield-classic" },
    { name: "Bajaj Pulsar 150", slug: "bajaj-pulsar" },
    { name: "Yamaha FZ-S", slug: "yamaha-fz" },
    { name: "Suzuki Access 125", slug: "suzuki-access" },
    { name: "KTM Duke 200", slug: "ktm-duke" },
    { name: "TVS Ntorq 125", slug: "tvs-ntorq" },
    { name: "Hero Splendor Plus", slug: "hero-splendor" },
    { name: "Ola S1 Pro Electric", slug: "ola-s1" },
    { name: "Royal Enfield Himalayan", slug: "royal-enfield-himalayan" }
  ];

  const services = [
    { name: "Daily", slug: "daily-bike-rental" },
    { name: "Weekly", slug: "weekly-bike-rental" },
    { name: "Monthly", slug: "monthly-bike-rental" }
  ];

  // 1. Model-City Pages (All 8 cities)
  models.forEach(model => {
    const customTitle = `Rent ${model.name} in ${city.name} | 0% Deposit - RYDHO`;
    const customDescription = `Rent a certified ${model.name} in ${city.name} at standard daily and weekly rates. Sanitized helmet, third-party insurance, and 24/7 breakdown help included.`;

    const content = compileHtml(cityTpl, {
      cityName: city.name,
      citySlug: city.slug,
      cityAreas: city.areas,
      areaName: "",
      areaSlug: "",
      customTitle,
      customDescription,
      domain: db.brand.domain
    });

    writePage(
      path.join(__dirname, "cities", city.slug, `${model.slug}-rental.html`),
      customTitle,
      customDescription,
      `${model.name.toLowerCase()} rental ${city.name.toLowerCase()}, hire ${model.name.toLowerCase()}`,
      `${db.brand.domain}/cities/${city.slug}/${model.slug}-rental.html`,
      content,
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `${model.name} for Rent in ${city.name}`,
        "description": customDescription,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": "299",
          "valueAddedService": "Sanitized Helmet & Insurance included"
        }
      }
    );
  });

  // 2. Service-City Pages (All 8 cities)
  services.forEach(service => {
    const customTitle = `${service.name} Bike & Scooter Rental in ${city.name} | RYDHO`;
    const customDescription = `Get flexible ${service.name.toLowerCase()} two-wheeler rentals in ${city.name}. Rent active scooters and commuter motorcycles and save up to 40% on taxi commutes.`;

    const content = compileHtml(cityTpl, {
      cityName: city.name,
      citySlug: city.slug,
      cityAreas: city.areas,
      areaName: "",
      areaSlug: "",
      customTitle,
      customDescription,
      domain: db.brand.domain
    });

    writePage(
      path.join(__dirname, "cities", city.slug, `${service.slug}.html`),
      customTitle,
      customDescription,
      `${service.name.toLowerCase()} two-wheeler rental ${city.name.toLowerCase()}, monthly bike hire`,
      `${db.brand.domain}/cities/${city.slug}/${service.slug}.html`,
      content,
      {}
    );
  });

  // 3. Model-Locality & Service-Locality (Top 4 Cities to fit ~450 total pages)
  const isTopCity = ["pune", "goa", "bangalore", "mumbai"].includes(city.slug);
  if (isTopCity) {
    city.areas.forEach(area => {
      // Top 5 models for area pages
      models.slice(0, 5).forEach(model => {
        const customTitle = `Rent ${model.name} in ${area.name}, ${city.name} | RYDHO`;
        const customDescription = `Hire a verified ${model.name} in the local hub of ${area.name}, ${city.name} at standard daily and weekly rates. Zero security deposit.`;

        const content = compileHtml(cityTpl, {
          cityName: city.name,
          citySlug: city.slug,
          cityAreas: city.areas,
          areaName: area.name,
          areaSlug: area.slug,
          customTitle,
          customDescription,
          domain: db.brand.domain
        });

        writePage(
          path.join(__dirname, "cities", city.slug, area.slug, `${model.slug}-rental.html`),
          customTitle,
          customDescription,
          `${model.name.toLowerCase()} rental ${area.name.toLowerCase()}, hire ${model.name.toLowerCase()} ${area.name.toLowerCase()}`,
          `${db.brand.domain}/cities/${city.slug}/${area.slug}/${model.slug}-rental.html`,
          content,
          {}
        );
      });

      // Services for area pages
      services.forEach(service => {
        const customTitle = `${service.name} Bike & Scooter Rental in ${area.name}, ${city.name} | RYDHO`;
        const customDescription = `Flexible ${service.name.toLowerCase()} two-wheeler rental plans in the ${area.name} sector of ${city.name}. Zero security deposit and fully insured.`;

        const content = compileHtml(cityTpl, {
          cityName: city.name,
          citySlug: city.slug,
          cityAreas: city.areas,
          areaName: area.name,
          areaSlug: area.slug,
          customTitle,
          customDescription,
          domain: db.brand.domain
        });

        writePage(
          path.join(__dirname, "cities", city.slug, area.slug, `${service.slug}.html`),
          customTitle,
          customDescription,
          `${service.name.toLowerCase()} two-wheeler rental ${area.name.toLowerCase()}, monthly bike hire ${area.name.toLowerCase()}`,
          `${db.brand.domain}/cities/${city.slug}/${area.slug}/${service.slug}.html`,
          content,
          {}
        );
      });
    });
  }

});

// --- 4. COMPILE CORE marketing PAGES ---
writePage(
  path.join(__dirname, "become-a-host.html"),
  "Become a Host - Share Your Bike & Earn | RYDHO",
  "List your scooter or bike on RYDHO and start earning passive income. Keep 85% of booking payouts with damage insurance cover and GPS tracking protection.",
  "become a host, rent out my bike, passive income",
  `${db.brand.domain}/become-a-host.html`,
  compileHtml(hostTpl, { cities: db.cities, hostStories: db.hostStories }),
  {}
);
writePage(
  path.join(__dirname, "partner-program.html"),
  "Partner Program - Vendor Franchise Opportunities | RYDHO",
  "Partner with RYDHO to list large fleets of scooters and motorcycles. High payout schedules and custom CRM dashboards for fleet managers.",
  "vendor program, fleet partner, bike franchise",
  `${db.brand.domain}/partner-program.html`,
  compileHtml(hostTpl, { cities: db.cities, hostStories: db.hostStories }),
  {}
);
writePage(
  path.join(__dirname, "about-us.html"),
  "About RYDHO - India's P2P Bike Sharing Marketplace",
  "Learn how RYDHO is transforming metropolitan commutes through decentralized peer-to-peer two-wheeler sharing models.",
  "about rydho, peer to peer sharing, two wheeler marketplace",
  `${db.brand.domain}/about-us.html`,
  compileHtml(bookingTpl, {}), // Reusing booking details structure
  {}
);
writePage(
  path.join(__dirname, "contact-us.html"),
  "Contact Us - Support Center | RYDHO",
  "Contact RYDHO support. Reach our customer helpdesk via WhatsApp, phone, or email. We are available 24/7 for roadside mechanical assistance.",
  "contact rydho, support email, phone number",
  `${db.brand.domain}/contact-us.html`,
  compileHtml(bookingTpl, {}),
  {}
);
writePage(
  path.join(__dirname, "support-center.html"),
  "Support Center - Help & FAQ Helpdesk | RYDHO",
  "Get answers to FAQs on document upload, digital KYC filters, online payments, cancellations, and host terms.",
  "help center, faq support, rydho cancellations",
  `${db.brand.domain}/support-center.html`,
  compileHtml(bookingTpl, {}),
  {}
);

// --- 5. COMPILE BLOG INDEX & POSTS ---
const blogIndexContent = compileHtml(blogTpl, { blogs: db.blogs, domain: db.brand.domain });
writePage(
  path.join(__dirname, "blog", "index.html"),
  "RYDHO Blog - Riding Guides, Travel Routes & Commuter Tips",
  "Read the latest articles on road trip guides, scooter maintenance advice, and passive earnings calculators.",
  "bike blog, riding guides, travel tips",
  `${db.brand.domain}/blog/index.html`,
  blogIndexContent,
  {}
);

ensureDirExists("blog/author");

db.blogs.forEach(post => {
  const authorInfo = db.authors[post.author] || { slug: "rydho", bio: "RYDHO Writing Team", avatar: "assets/images/category_scooters.jpg" };
  
  // Apply blog parser extensions
  const { tocHtml, contentHtml } = generateTOC(post.content);
  const faqHtml = generateFAQs(post.faqs);
  const contentLinked = injectInternalLinks(contentHtml);
  const relatedHtml = getRelatedPosts(post, db.blogs);

  const postContent = compileHtml(blogTpl, {
    postTitle: post.title,
    postAuthor: post.author,
    postAuthorSlug: authorInfo.slug,
    postAuthorBio: authorInfo.bio,
    postAuthorAvatar: authorInfo.avatar,
    postCategory: post.category,
    postDate: post.date,
    postImage: post.image,
    postContent: contentLinked,
    postTOC: tocHtml,
    postFAQs: faqHtml,
    postRelatedHtml: relatedHtml,
    domain: db.brand.domain
  });

  const postSchema = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "datePublished": "2026-07-02",
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "publisher": {
        "@type": "Organization",
        "name": db.brand.name
      }
    }
  ];

  if (post.faqs && post.faqs.length > 0) {
    postSchema.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": post.faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    });
  }

  writePage(
    path.join(__dirname, "blog", `${post.slug}.html`),
    `${post.title} - RYDHO Blog`,
    post.summary,
    "blog, travel, travel tips, scooter commute",
    `${db.brand.domain}/blog/${post.slug}.html`,
    postContent,
    postSchema
  );
});

// Compile Author Bio Profile Pages
Object.keys(db.authors).forEach(authorName => {
  const author = db.authors[authorName];
  const authorBlogs = db.blogs.filter(post => post.author === authorName);
  
  const authorPageContent = compileHtml(blogTpl, {
    authorName: author.name,
    authorBio: author.bio,
    authorAvatar: author.avatar,
    authorBlogs: authorBlogs,
    domain: db.brand.domain
  });
  
  writePage(
    path.join(__dirname, "blog", "author", `${author.slug}.html`),
    `Articles by ${author.name} | RYDHO`,
    `Read two-wheeler rental advice, travel routes, and ownership finance articles written by ${author.name} on RYDHO.`,
    `articles by ${author.name}, rydho guest columnist`,
    `${db.brand.domain}/blog/author/${author.slug}.html`,
    authorPageContent,
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "mainEntity": {
        "@type": "Person",
        "name": author.name,
        "description": author.bio
      }
    }
  );
});

// --- 6. COMPILE USER GATEWAY PAGES ---
const userContent = compileHtml(userTpl, {});
const userSubroutes = [
  "login", "signup", "otp-login", "dashboard", "bookings", "payments", "refunds", "documents", "wishlist", "profile"
];
userSubroutes.forEach(route => {
  writePage(
    path.join(__dirname, "user", `${route}.html`),
    `RYDHO Account Portal - ${route.charAt(0).toUpperCase() + route.slice(1)}`,
    "Access your RYDHO user dashboard to manage bookings, track invoices, or check KYC verification details.",
    "user login, bookings dashboard",
    `${db.brand.domain}/user/${route}.html`,
    userContent,
    {}
  );
});

// --- 6.5. COMPILE SEO UTILITY TOOLS ---
db.tools.forEach(tool => {
  const toolContent = compileHtml(toolTpl, {
    toolTitle: tool.name,
    toolSubtitle: tool.description,
    toolSlug: tool.slug,
    toolContent: tool.seoContent || ""
  });

  writePage(
    path.join(__dirname, "tools", `${tool.slug}.html`),
    `${tool.name} | RYDHO Tools`,
    tool.description,
    "resale value, mileage calculator, average calculator, challan lookup",
    `${db.brand.domain}/tools/${tool.slug}.html`,
    toolContent,
    {}
  );
});

// --- 7. COMPILE LEGAL POLICY PAGES ---
const legalPolicies = [
  { name: "Terms & Conditions", slug: "terms-and-conditions", content: "<h2>1. Agreement to Terms</h2><p>By listing or renting vehicles on RYDHO, you agree to comply with our Terms of Service...</p>" },
  { name: "Privacy Policy", slug: "privacy-policy", content: "<h2>1. Data Collection</h2><p>We respect your privacy and encrypt all uploaded Aadhar and DL data records...</p>" },
  { name: "Refund Policy", slug: "refund-policy", content: "<h2>1. Booking Cancelled Refunds</h2><p>Refunds are processed back to the original source payment account within 24 hours of approval...</p>" },
  { name: "Cancellation Policy", slug: "cancellation-policy", content: "<h2>1. Cancellation Deadlines</h2><p>Free cancellation is available up to 24 hours before your booking start schedule...</p>" },
  { name: "Marketplace Rules", slug: "marketplace-rules", content: "<h2>1. Fair Listings</h2><p>Hosts must keep vehicles clean, with adequate fuel, and with correct pricing grids...</p>" },
  { name: "User Agreement", slug: "user-agreement", content: "<h2>1. Riding Regulations</h2><p>Riders must possess a valid license and follow local state transport rules...</p>" },
  { name: "Host Agreement", slug: "host-agreement", content: "<h2>1. Host Registration</h2><p>Hosts confirm that the shared two-wheelers have valid registration and insurance...</p>" },
  { name: "Vendor Agreement", slug: "vendor-agreement", content: "<h2>1. Partnership Terms</h2><p>Fleet partners agree to maintain vehicle availability logs via our APIs...</p>" },
  { name: "Cookie Policy", slug: "cookie-policy", content: "<h2>1. Cookie usage</h2><p>We use local cookies to save your city search preferences and maintain account sessions...</p>" },
  { name: "Disclaimer", slug: "disclaimer", content: "<h2>1. General Warnings</h2><p>RYDHO acts as a secure listing mediator and is not liable for riding errors...</p>" },
  { name: "KYC Policy", slug: "kyc-policy", content: "<h2>1. Verification Standards</h2><p>Verified licenses are mandatory before any vehicle handover takes place...</p>" },
  { name: "Insurance Policy", slug: "insurance-policy", content: "<h2>1. Fleet Coverage</h2><p>Third-party accident damage cover applies according to active insurance policies...</p>" },
  { name: "Grievance Policy", slug: "grievance-policy", content: "<h2>1. Customer Redressal</h2><p>Submit grievance claims to our legal compliance helpdesk at legal@rydho.com...</p>" }
];

legalPolicies.forEach(policy => {
  const policyHtml = compileHtml(legalTpl, {
    policyName: policy.name,
    policyContent: policy.content
  });

  writePage(
    path.join(__dirname, "legal", `${policy.slug}.html`),
    `${policy.name} - RYDHO Marketplace`,
    `Review the active ${policy.name.toLowerCase()} governing host listings and booking commissions.`,
    "legal policy, rental terms",
    `${db.brand.domain}/legal/${policy.slug}.html`,
    policyHtml,
    {}
  );
});

// --- 8. GENERATE SITEMAP.XML ---
const sitemapUrls = compiledRoutes.map(route => {
  const url = `${db.brand.domain}${route}`;
  const priority = route.includes("index") ? "1.0" : (route.includes("cities") ? "0.8" : "0.5");
  return `  <url>
    <loc>${url}</loc>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join("\n");

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>`;

fs.writeFileSync(path.join(__dirname, "sitemap.xml"), sitemapXml, "utf8");
console.log("Compiled sitemap.xml");

// --- 9. GENERATE ROBOTS.TXT ---
const robotsTxt = `User-agent: *
Allow: /
Disallow: /user/
Disallow: /editor.html

Sitemap: ${db.brand.domain}/sitemap.xml
`;

fs.writeFileSync(path.join(__dirname, "robots.txt"), robotsTxt, "utf8");
console.log("Compiled robots.txt");

console.log("RYDHO Website Static Compilation Completed Successfully!");
