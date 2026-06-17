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

//Thi function take the JSON data from the API and remove some of the properties that are not necessary for our application. This is done to reduce the amount of data that we need to work with and to make it easier to render the VS and wish list pages.
export function purgeProductJson(completeJson) {
  const cleanProduct = structuredClone(completeJson);

  const propertiesToRemove = [
    'more_options',
    'variants',
    'videos',
    'user_reviews',
  ];

  propertiesToRemove.forEach(property => {
    delete cleanProduct?.product_results?.[property];
    delete cleanProduct[property];
  });

  return cleanProduct;
};

export function saveToStorage(storageKey, completeJson, maxItems = null) {
  const optimizedData = purgeProductJson(completeJson);
  
  let currentItems = JSON.parse(localStorage.getItem(storageKey)) || [];
  
  if (storageKey === 'productos_vs') {
    if (maxItems && currentItems.length >= maxItems) currentItems.shift();
    currentItems.push(optimizedData);
  } else {
    const exists = currentItems.some(item => item.product_results?.title === optimizedData.product_results?.title);
    if (!exists) {
      currentItems.push(optimizedData);
    } else {
      return false;
    }
  }

  localStorage.setItem(storageKey, JSON.stringify(currentItems));
  return true;
};

export function triggerSuccessAnimation(buttonElement, successText, isWarning = false) {
  const originalText = buttonElement.innerText;
  
  // Disable button momentarily to prevent double clicks during animation
  buttonElement.disabled = true;
  buttonElement.innerText = successText;
  
  // Add styling classes
  buttonElement.classList.add('animation-active');
  if (isWarning) buttonElement.classList.add('animation-warning');

  // Revert back to original state after 1.5 seconds
  setTimeout(() => {
    buttonElement.classList.remove('animation-active', 'animation-warning');
    buttonElement.innerText = originalText;
    buttonElement.disabled = false;
  }, 1500);
};

