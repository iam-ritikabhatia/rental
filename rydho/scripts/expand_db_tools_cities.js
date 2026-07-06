const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "data.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

// 1. Expand Cities & Areas
const newCities = [
  {
    "name": "Pune",
    "slug": "pune",
    "image": "assets/images/pune_hero.jpg",
    "areas": [
      { "name": "Kothrud", "slug": "kothrud" },
      { "name": "Baner", "slug": "baner" },
      { "name": "Pune Airport", "slug": "pune-airport" },
      { "name": "Pune Railway Station", "slug": "pune-railway-station" },
      { "name": "FC Road", "slug": "fc-road" },
      { "name": "Hinjawadi", "slug": "hinjawadi" },
      { "name": "Kharadi", "slug": "kharadi" },
      { "name": "Viman Nagar", "slug": "viman-nagar" },
      { "name": "Swargate", "slug": "swargate" },
      { "name": "Balewadi", "slug": "balewadi" },
      { "name": "Shivaji Nagar", "slug": "shivaji-nagar" },
      { "name": "Bibwewadi", "slug": "bibwewadi" }
    ]
  },
  {
    "name": "Goa",
    "slug": "goa",
    "image": "assets/images/ladakh_hero.jpg",
    "areas": [
      { "name": "Goa Airport", "slug": "goa-airport" },
      { "name": "Thivim Railway Station", "slug": "thivim-railway-station" },
      { "name": "Calangute", "slug": "calangute" },
      { "name": "Baga", "slug": "baga" },
      { "name": "Candolim", "slug": "candolim" },
      { "name": "Anjuna", "slug": "anjuna" },
      { "name": "Vagator", "slug": "vagator" },
      { "name": "Palolem", "slug": "palolem" },
      { "name": "Panjim", "slug": "panjim" }
    ]
  },
  {
    "name": "Bangalore",
    "slug": "bangalore",
    "image": "assets/images/bengaluru_hero.jpg",
    "areas": [
      { "name": "Bangalore Airport", "slug": "bangalore-airport" },
      { "name": "Whitefield", "slug": "whitefield" },
      { "name": "Electronic City", "slug": "electronic-city" },
      { "name": "Koramangala", "slug": "koramangala" },
      { "name": "Indiranagar", "slug": "indiranagar" },
      { "name": "HSR Layout", "slug": "hsr-layout" },
      { "name": "Marathahalli", "slug": "marathahalli" }
    ]
  },
  {
    "name": "Mumbai",
    "slug": "mumbai",
    "image": "assets/images/mumbai_hero.jpg",
    "areas": [
      { "name": "Mumbai Airport", "slug": "mumbai-airport" },
      { "name": "Andheri", "slug": "andheri" },
      { "name": "Bandra", "slug": "bandra" },
      { "name": "Borivali", "slug": "borivali" },
      { "name": "Dadar", "slug": "dadar" },
      { "name": "Kurla", "slug": "kurla" },
      { "name": "Colaba", "slug": "colaba" }
    ]
  },
  {
    "name": "Delhi",
    "slug": "delhi",
    "image": "assets/images/riders_hero.jpg",
    "areas": [
      { "name": "Delhi Airport", "slug": "delhi-airport" },
      { "name": "New Delhi Railway Station", "slug": "new-delhi-railway-station" },
      { "name": "Connaught Place", "slug": "connaught-place" },
      { "name": "Karol Bagh", "slug": "karol-bagh" },
      { "name": "Noida", "slug": "noida" },
      { "name": "Gurugram", "slug": "gurugram" }
    ]
  },
  {
    "name": "Hyderabad",
    "slug": "hyderabad",
    "image": "assets/images/category_cruisers.jpg",
    "areas": [
      { "name": "Hyderabad Airport", "slug": "hyderabad-airport" },
      { "name": "Hitech City", "slug": "hitech-city" },
      { "name": "Gachibowli", "slug": "gachibowli" },
      { "name": "Secunderabad", "slug": "secunderabad" }
    ]
  },
  {
    "name": "Manali",
    "slug": "manali",
    "image": "assets/images/manali_hero.jpg",
    "areas": [
      { "name": "Mall Road", "slug": "mall-road" },
      { "name": "Old Manali", "slug": "old-manali" },
      { "name": "Vashisht", "slug": "vashisht" }
    ]
  },
  {
    "name": "Leh",
    "slug": "leh",
    "image": "assets/images/ladakh_hero.jpg",
    "areas": [
      { "name": "Leh Airport", "slug": "leh-airport" },
      { "name": "Leh Market", "slug": "leh-market" },
      { "name": "Nubra Valley", "slug": "nubra-valley" },
      { "name": "Pangong Lake", "slug": "pangong-lake" }
    ]
  }
];

db.cities = newCities;

// 2. Expand Calculator Tools list
db.tools = [
  {
    "name": "Used Bike Resale Value Calculator",
    "slug": "used-bike-resale-value-calculator",
    "description": "Estimate market resale price of pre-owned scooters and bikes."
  },
  {
    "name": "Bike Mileage & Fuel cost Calculator",
    "slug": "bike-mileage-fuel-cost-calculator",
    "description": "Calculate daily/monthly fuel savings by renting."
  },
  {
    "name": "Traffic Police Challan Advisor",
    "slug": "traffic-police-challan-consultant",
    "description": "Consult Motor Vehicle Act penalty fees in India."
  },
  {
    "name": "Battery Replacement Cost Calculator",
    "slug": "battery-replacement-cost-calculator",
    "description": "Estimate replacement and service cost of batteries."
  },
  {
    "name": "Tire Replacement Cost Calculator",
    "slug": "tire-replacement-cost-calculator",
    "description": "Estimate tubeless tyre replacement rates."
  },
  {
    "name": "Helmet Size Calculator",
    "slug": "helmet-size-calculator",
    "description": "Measure head circumference to find the correct helmet fit."
  },
  {
    "name": "Insurance IDV Calculator",
    "slug": "insurance-idv-calculator",
    "description": "Estimate Insured Declared Value for insurance coverage."
  },
  {
    "name": "Loan Prepayment Calculator",
    "slug": "loan-prepayment-calculator",
    "description": "Calculate EMIs and interest savings on prepaying loans."
  },
  {
    "name": "Riding Cost Per Km Calculator",
    "slug": "riding-cost-per-km-calculator",
    "description": "Find per-kilometer cost of petrol, maintenance, and insurance."
  },
  {
    "name": "Electric Charging Cost Calculator",
    "slug": "electric-charging-cost-calculator",
    "description": "Calculate commercial or residential EV charging rates."
  },
  {
    "name": "Home Charging Time Calculator",
    "slug": "home-charging-time-calculator",
    "description": "Estimate charging hours based on charger kW capacity."
  },
  {
    "name": "Range Estimator for EVs",
    "slug": "range-estimator-for-evs",
    "description": "Predict actual driving range based on battery and load."
  },
  {
    "name": "Monthly Commuting Cost Calculator",
    "slug": "monthly-commuting-cost-calculator",
    "description": "Compare daily commute costs of autos vs. renting."
  },
  {
    "name": "Bike Affordability Calculator",
    "slug": "bike-affordability-calculator",
    "description": "Calculate target vehicle purchase price based on monthly salary."
  },
  {
    "name": "RTO Fee Estimator",
    "slug": "rto-fee-estimator",
    "description": "Check standard state RTO fees for ownership transfer."
  },
  {
    "name": "Registration Cost Calculator",
    "slug": "registration-cost-calculator",
    "description": "Find new registration and road tax rates in India."
  },
  {
    "name": "PUC Renewal Reminder Calculator",
    "slug": "puc-renewal-reminder-calculator",
    "description": "Find PUC expiry limits and renewal guidelines."
  },
  {
    "name": "Carbon Emission Calculator",
    "slug": "carbon-emission-calculator",
    "description": "Calculate green carbon footprint offsets of travel."
  }
];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
console.log("data.json database expanded successfully with new cities, areas, and calculators!");
