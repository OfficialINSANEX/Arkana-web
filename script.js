(function () {

  // Dynamic Header
  function createHeader() {
    const header = document.createElement('header');
    header.className = 'header';
    header.innerHTML = `
      <div class="headerLeft">
        <a href="#hero"><img src="svg/Arkana02.svg" alt="Arkana" class="headerLogo"></a>
      </div>
      <nav class="headerCenter">
        <button class="headerButtonLeft" data-target="hero">Home</button>
        <button class="headerButtonLeft" data-target="pricing">Plans</button>
        <button class="headerButtonLeft" data-target="community">Community</button>
        <button class="headerButtonLeft headerButtonPrimary" data-target="download">Download</button>
      </nav>
    `;
    document.body.insertBefore(header, document.body.firstChild);
  }

  // Scroll
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  // Reveal
  function initReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // Init
  function init() {
    createHeader();

    document.querySelectorAll('[data-target]').forEach(btn => {
      btn.addEventListener('click', () => scrollTo(btn.dataset.target));
    });

    document.getElementById('download-windows')?.addEventListener('click', () => {
      window.open('https://drive.google.com/file/d/1UOHOwdWfPbdnHsjTdZpgAkBb3AwJPbHG/view?usp=sharing', '_blank');
    });

    document.getElementById('join-discord')?.addEventListener('click', () => {
      window.open('https://discord.gg/NdmUCByGc6', '_blank');
    });

    document.getElementById('year').textContent = new Date().getFullYear();
    initReveal();
  }

  document.readyState === "loading" ? 
    document.addEventListener("DOMContentLoaded", init) : init();

})();

// Hero image click → Download
const heroImg = document.getElementById('heroImage');
if (heroImg) {
    heroImg.style.cursor = 'pointer';
    heroImg.addEventListener('click', () => {
        document.getElementById('download').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

/* ========================= */
/* PRICE FLIP ANIMATION      */
/* ========================= */

function animatePrice(id, newPrice) {
    const box = document.getElementById(id);
    const span = box.querySelector(".priceFlip span");

    box.classList.add("animating");

    setTimeout(() => {
        span.textContent = newPrice;
        box.classList.remove("animating");
    }, 300);
}

// Setup initial flip structure
["pro-price", "enterprise-price"].forEach(id => {
    const el = document.getElementById(id);
    const priceText = el.textContent.trim();
    el.innerHTML = `<div class="priceFlip"><span>${priceText}</span></div>`;
});

// Pricing Toggle
function initPricingToggle() {
    const monthlyBtn = document.getElementById('toggle-monthly');
    const annualBtn = document.getElementById('toggle-annual');

    monthlyBtn.addEventListener('click', () => {
        monthlyBtn.classList.add('active');
        annualBtn.classList.remove('active');

        animatePrice("pro-price", "0.99 € / month");
        animatePrice("enterprise-price", "4.99 € / month");
    });

    annualBtn.addEventListener('click', () => {
        annualBtn.classList.add('active');
        monthlyBtn.classList.remove('active');

        animatePrice("pro-price", "9.99 € / year");
        animatePrice("enterprise-price", "199.99 € / year");
    });
}

document.addEventListener("DOMContentLoaded", initPricingToggle);
