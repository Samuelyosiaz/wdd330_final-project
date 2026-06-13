export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerTag = document.querySelector("#main-header");
  const footerTag = document.querySelector("#main-footer");

  headerTag.innerHTML = headerTemplate;
  footerTag.innerHTML = footerTemplate;
};

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
};

export function toggleMenu() {
  const menuBtn = document.getElementById('menu');
  const navLinks = document.querySelector('.nav-links');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    if (navLinks.classList.contains('active')) {
      menuBtn.textContent = '✕';
      menuBtn.setAttribute('aria-label', 'Cerrar menú');
    } else {
      menuBtn.textContent = '☰';
      menuBtn.setAttribute('aria-label', 'Abrir menú');
    }
  });
}

