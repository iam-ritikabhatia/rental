/**
 * RYDHO Client UX and Event Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initFAQs();
  initExitIntent();
  initHostCalculator();
  initPWAInstaller();
  setupSearchForms();
  loadDynamicFleet();
});

// 1. Responsive Navbar Drawer
function initNavbar() {
  const menuBtn = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");
  const header = document.querySelector("header");

  if (!menuBtn || !navLinks) return;

  const closeMenu = () => {
    navLinks.classList.remove("active");
    const icon = menuBtn.querySelector("i");
    if (icon) {
      icon.classList.add("fa-bars");
      icon.classList.remove("fa-xmark");
    }
  };

  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    const icon = menuBtn.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-xmark");
    }
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (e) => {
    if (
      navLinks.classList.contains("active") &&
      header &&
      !header.contains(e.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) closeMenu();
  });
}

// 2. FAQ Accordion Panels
function initFAQs() {
  const faqQuestions = document.querySelectorAll(".faq-question");
  
  faqQuestions.forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const answer = btn.nextElementSibling;
      const isActive = item.classList.contains("active");

      // Close all other FAQs
      document.querySelectorAll(".faq-item").forEach(otherItem => {
        otherItem.classList.remove("active");
        otherItem.querySelector(".faq-answer").style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

// 3. Exit Intent Conversion Popup
function initExitIntent() {
  const modal = document.getElementById("exit-intent-modal");
  const closeBtn = document.querySelector(".modal-close");
  const couponBox = document.querySelector(".coupon-box");
  
  if (!modal) return;

  let shown = false;
  
  // Show popup if mouse leaves window (exit intent)
  document.addEventListener("mouseleave", (e) => {
    if (e.clientY < 20 && !shown) {
      modal.style.display = "flex";
      shown = true;
      localStorage.setItem("rydho_exit_shown", "true");
    }
  });

  // Close triggers
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Click to copy coupon code
  if (couponBox) {
    couponBox.addEventListener("click", () => {
      const codeText = couponBox.innerText.split("\n")[0].trim();
      navigator.clipboard.writeText(codeText).then(() => {
        const textSpan = couponBox.querySelector("span");
        if (textSpan) {
          textSpan.innerText = "COPIED TO CLIPBOARD!";
          setTimeout(() => {
            textSpan.innerText = "CLICK TO COPY CODE";
          }, 2000);
        }
      });
    });
  }
}

// 4. Host Earnings Calculator with Rolling Number Animation
function initHostCalculator() {
  const vehicleSelect = document.getElementById("calc-vehicle-type");
  const daysInput = document.getElementById("calc-days");
  const earningAmt = document.getElementById("calc-earnings-amt");

  if (!vehicleSelect || !daysInput || !earningAmt) return;

  let currentVal = 0;
  let intervalId = null;

  function calculateEarnings() {
    const type = vehicleSelect.value;
    const days = parseInt(daysInput.value) || 0;
    
    // Rates based on configuration
    let rate = 300; // Scooter
    if (type === "cruiser") rate = 800; // Classic 350
    else if (type === "commuter") rate = 500; // FZ-S

    // Calculate (85% vendor share, 15% commission)
    const hostSharePercent = 0.85;
    const targetVal = Math.round(rate * days * hostSharePercent);
    
    // Clear active rolling intervals
    if (intervalId) clearInterval(intervalId);
    
    const startVal = currentVal;
    const diff = targetVal - startVal;
    if (diff === 0) {
      earningAmt.innerText = "₹" + targetVal.toLocaleString("en-IN");
      return;
    }
    
    const duration = 750; // 0.75 seconds
    const steps = 25;
    const stepTime = duration / steps;
    let stepCount = 0;
    
    intervalId = setInterval(() => {
      stepCount++;
      currentVal = Math.round(startVal + (diff * (stepCount / steps)));
      if (stepCount >= steps) {
        currentVal = targetVal;
        clearInterval(intervalId);
      }
      earningAmt.innerText = "₹" + currentVal.toLocaleString("en-IN");
    }, stepTime);
  }

  vehicleSelect.addEventListener("change", calculateEarnings);
  daysInput.addEventListener("input", calculateEarnings);
  
  // Trigger initial calculation
  calculateEarnings();
}

// 5. Progressive Web App Installer & Banner
let deferredPrompt;
function initPWAInstaller() {
  const pwaBanner = document.getElementById("pwa-install-banner");
  const installBtn = document.getElementById("pwa-btn-install");
  const closeBtn = document.getElementById("pwa-btn-close");

  if (!pwaBanner) return;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Show banner if user hasn't closed it recently
    if (!localStorage.getItem("rydho_pwa_dismissed")) {
      pwaBanner.style.display = "block";
    }
  });

  if (installBtn) {
    installBtn.addEventListener("click", () => {
      if (!deferredPrompt) return;
      pwaBanner.style.display = "none";
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        }
        deferredPrompt = null;
      });
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      pwaBanner.style.display = "none";
      localStorage.setItem("rydho_pwa_dismissed", "true");
    });
  }
}

// 6. Setup Search Forms & Redirect Handoff
function setupSearchForms() {
  const searchForm = document.getElementById("hero-search-form");
  if (!searchForm) return;

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const city = document.getElementById("search-city")?.value || "";
    const area = document.getElementById("search-area")?.value || "";
    const vehicleType = document.getElementById("search-type")?.value || "";
    const pickupDate = document.getElementById("search-pickup")?.value || "";
    const dropoffDate = document.getElementById("search-dropoff")?.value || "";

    // Generate Next.js redirect link
    const redirectUrl = window.rydhoAPI.getBookingRedirectUrl({
      city,
      area,
      vehicleType,
      pickupDate,
      dropoffDate
    });

    window.location.href = redirectUrl;
  });
}

// 7. Dynamic Fleet Loader on City/Area pages
async function loadDynamicFleet() {
  const fleetGrid = document.getElementById("dynamic-fleet-grid");
  if (!fleetGrid) return;

  // Retrieve attributes embedded in the template script
  const city = fleetGrid.getAttribute("data-city") || "";
  const area = fleetGrid.getAttribute("data-area") || "";
  
  // Show skeleton loading loader
  fleetGrid.innerHTML = Array(3).fill(0).map(() => `
    <div class="vehicle-card skeleton" style="height:400px; background-color:#eaebee; animation:pulse 1.5s infinite;"></div>
  `).join("");

  // Fetch from Java API client (which triggers dynamic API call or fallback)
  const fleet = await window.rydhoAPI.getVehicles(city, area);
  fleetGrid.innerHTML = "";

  if (fleet.length === 0) {
    fleetGrid.innerHTML = `<div class="no-vehicles" style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-gray);">No two-wheelers available in this location at the moment.</div>`;
    return;
  }

  fleet.forEach(bike => {
    const card = document.createElement("div");
    card.className = "vehicle-card";
    
    // Check if the current category is matching or filter list
    card.innerHTML = `
      <div class="vehicle-img-wrapper">
        <span class="vehicle-tag">Available</span>
        <img class="vehicle-img" src="${window.location.origin}/${bike.image}" alt="${bike.name}" onerror="this.src='https://placehold.co/400x300?text=${encodeURIComponent(bike.name)}'">
      </div>
      <div class="vehicle-details">
        <div class="vehicle-rating">
          <i class="fa-solid fa-star"></i> ${bike.rating} <span>(${bike.reviews} reviews)</span>
        </div>
        <h3 class="vehicle-name">${bike.name}</h3>
        <div class="vehicle-specs">
          <div class="spec-item"><i class="fa-solid fa-gauge"></i> ${bike.specs.engine}</div>
          <div class="spec-item"><i class="fa-solid fa-droplet"></i> ${bike.specs.mileage}</div>
          <div class="spec-item"><i class="fa-solid fa-gears"></i> ${bike.specs.transmission}</div>
        </div>
        <div class="vehicle-price-book">
          <div class="price-box">
            <div class="price">₹${bike.pricePerDay}<span>/day</span></div>
          </div>
          <a href="${window.rydhoAPI.config.appUrl}/search?city=${encodeURIComponent(city)}&vehicle=${encodeURIComponent(bike.name)}" class="btn btn-primary" style="padding:10px 16px; font-size:0.85rem;">Book Now</a>
        </div>
      </div>
    `;
    fleetGrid.appendChild(card);
  });
}
