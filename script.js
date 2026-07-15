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

// Click sull'immagine hero → vai a Download
const heroImg = document.getElementById('heroImage');
if (heroImg) {
    heroImg.style.cursor = 'pointer';
    heroImg.addEventListener('click', () => {
        document.getElementById('download').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

