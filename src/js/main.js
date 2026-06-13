import { loadHeaderFooter, toggleMenu } from "./utils.mjs";
import { getMainData } from "./data.mjs";

async function init() {
    const jsonData = await getMainData();
    renderProductCards(jsonData);
    await loadHeaderFooter();
    toggleMenu();
}


function renderProductCards(jsonData) {
  const mainContent = document.getElementById('main-home');
  
  mainContent.innerHTML = '';

  if (!jsonData || !jsonData.shopping_results || jsonData.shopping_results.length === 0) {
    mainContent.innerHTML = '<p class="no-results">No se encontraron productos.</p>';
    return;
  }

  jsonData.shopping_results.forEach(product => {
    const { title, price, thumbnail, tag } = product;

    const card = document.createElement('article');
    card.classList.add('product-card');

    card.innerHTML = `
      <div class="card-image-container">
        <img src="${thumbnail}" alt="${title}" class="product-image" loading="lazy">
      </div>
      <div class="card-info">
        <h3 class="product-title">${title}</h3>
        <p class="product-price">${price}</p>
        ${tag ? `<span class="product-tag">${tag}</span>` : ''}
      </div>
    `;

    mainContent.appendChild(card);
  });
}

init();