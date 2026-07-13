// Scroll with header fixed offset
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;

  // read header height from CSS variable
  const root = getComputedStyle(document.documentElement);
  const headerHeight = parseInt(root.getPropertyValue('--header-height')) || 88;

  const rect = el.getBoundingClientRect();
  const absoluteTop = window.scrollY + rect.top;

  // target so section top sits just below fixed header
  const target = Math.max(0, absoluteTop - headerHeight - 8);

  window.scrollTo({ top: target, behavior: 'smooth' });
}

document.getElementById("HomeButton").addEventListener("click", () => scrollToSection("hero"));
document.getElementById("PricingButton").addEventListener("click", () => scrollToSection("pricing"));
document.getElementById("ResourcesButton").addEventListener("click", () => scrollToSection("resources"));
document.getElementById("CommunityButton").addEventListener("click", () => scrollToSection("community"));
document.getElementById("DownloadButton").addEventListener("click", () => scrollToSection("download"));
document.getElementById("download-windows").onclick = () => window.open('https://drive.google.com/file/d/1UOHOwdWfPbdnHsjTdZpgAkBb3AwJPbHG/view?usp=sharing', '_blank');
document.getElementById("download-mac").onclick = () => alert('Mac version is coming soon!');






