// Theme Engine & Persistence
function applySavedTheme() {
  const saved = localStorage.getItem('niveshghar_theme') || 'royal';
  document.body.className = 'theme-' + saved;
  const selector = document.getElementById('themeSelect');
  if (selector) selector.value = saved;
}

function switchTheme(themeName) {
  document.body.className = 'theme-' + themeName;
  localStorage.setItem('niveshghar_theme', themeName);
  const selector = document.getElementById('themeSelect');
  if (selector) selector.value = themeName;
}

document.addEventListener('DOMContentLoaded', () => {
  applySavedTheme();

  // If a theme switcher doesn't exist in nav-cta, inject it
  const navCta = document.querySelector('.nav-cta');
  if (navCta && !document.getElementById('themeSelect')) {
    const select = document.createElement('select');
    select.className = 'theme-selector';
    select.id = 'themeSelect';
    select.innerHTML = `
      <option value="royal">💎 Royal Dark</option>
      <option value="light">☀️ Clean Light</option>
      <option value="forest">🌲 Forest Growth</option>
      <option value="cyan">⚡ Titanium Cyan</option>
    `;
    select.value = localStorage.getItem('niveshghar_theme') || 'royal';
    select.onchange = (e) => switchTheme(e.target.value);
    navCta.insertBefore(select, navCta.firstChild);
  }
});

function openWhatsApp(customMsg) {
  const phone = "919876543210";
  const text = encodeURIComponent(customMsg || "Hello Dveep Sir, I was exploring your NiveshGhar wealth calculators and would like to schedule a 1-on-1 portfolio consultation.");
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}

function printReport() {
  window.print();
}
