const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "data.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

// 1. Add Authors Database
db.authors = {
  "Rahul Sharma": {
    "name": "Rahul Sharma",
    "slug": "rahul-sharma",
    "bio": "Rahul is a motorcycling veteran with 10+ years of experience trailing the Western Ghats, Ladakh highways, and coastal roads.",
    "avatar": "assets/images/category_cruisers.jpg"
  },
  "Amit Patel": {
    "name": "Amit Patel",
    "slug": "amit-patel",
    "bio": "Amit is a personal finance analyst specializing in micro-mobility comparisons, depreciation indexes, and vehicle ownership costs in India.",
    "avatar": "assets/images/category_commuters.jpg"
  },
  "Priya Rao": {
    "name": "Priya Rao",
    "slug": "priya-rao",
    "bio": "Priya is an urban lifestyle editor focused on smart cities, green commutes, and resolving gridlock in India's tech park hubs.",
    "avatar": "assets/images/category_scooters.jpg"
  }
};

// 2. Add Category and FAQs to Blog Posts
db.blogs[0].category = "Travel Guides";
db.blogs[0].faqs = [
  { "q": "What is the best time to ride from Pune to Lavasa?", "a": "Early mornings (5:30 AM to 8:00 AM) are best to escape heavy highway traffic and enjoy cool mist near Temghar Dam." },
  { "q": "Are gearless scooters suitable for the Sinhagad Fort climb?", "a": "Yes, modern 110cc and 125cc scooters can climb, but ensure brake pads are checked before descending the steep hairpins." }
];

db.blogs[1].category = "Finance & Ownership";
db.blogs[1].faqs = [
  { "q": "Is insurance and servicing included in RYDHO rentals?", "a": "Yes, all rentals include 100% third-party insurance, regular maintenance schedules, and oil changes at no extra cost." },
  { "q": "How much does a personal scooter depreciate in the first year?", "a": "Typically, a brand new scooter loses 15% to 20% of its ex-showroom value the moment it leaves the dealership registry." }
];

db.blogs[2].category = "Daily Commuting";
db.blogs[2].faqs = [
  { "q": "What is the peak traffic window in Hinjewadi IT Park?", "a": "Morning rush is between 9:00 AM and 11:30 AM, and evening exit gridlock runs from 5:30 PM to 8:30 PM." },
  { "q": "How does two-wheeler sharing help save time in Wakad?", "a": "Bikes can filter through stationary bumper-to-bumper car lanes, cutting Wakad-Hinjewadi commutes by up to 40 minutes." }
];

db.blogs[3].category = "Finance & Ownership";
db.blogs[3].faqs = [
  { "q": "How expensive is auto-rickshaw commuting daily in Kharadi?", "a": "A round trip between Kharadi and Swargate/Kothrud costs ₹450+ using on-demand apps, compared to ₹199/day RYDHO rentals." },
  { "q": "Do RYDHO hosts provide extra helmets?", "a": "Yes, you can request an additional sanitized helmet for a pillion rider when confirming your booking details." }
];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
console.log("Blog posts in data.json updated with category metadata, FAQs, and authors successfully!");
