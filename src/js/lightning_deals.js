import { loadHeaderFooter, toggleMenu } from "./utils.mjs";
import { getMainData } from "./data.mjs";

async function init() {
    const jsonData = await getMainData("smartphones with discounts");
    renderProductCards(jsonData);
    await loadHeaderFooter();
    toggleMenu();
}


export function renderProductCards(jsonData) {
  const mainContent = document.getElementById('main-home');
  
  mainContent.innerHTML = '';

  if (!jsonData || !jsonData.shopping_results || jsonData.shopping_results.length === 0) {
    mainContent.innerHTML = '<p class="no-results">Products not found.</p>';
    return;
  }

  jsonData.shopping_results.forEach(product => {
    const { title, price, thumbnail, tag, serpapi_immersive_product_api } = product;
      
    if (!serpapi_immersive_product_api) return;

    const proxyEndpoint = serpapi_immersive_product_api.replace('https://serpapi.com', '/api-serp');

    const secureEndpoint = encodeURIComponent(proxyEndpoint);
    const card = document.createElement('article');
    card.classList.add('product-card');

    card.innerHTML = `
      <div class="card-image-container">
        <img src="${thumbnail}" alt="${title}" class="product-image" loading="lazy">
        ${tag ? `<span class="product-tag">${tag}</span>` : ''}
      </div>
      <div class="card-info">
        <a href="../product_details/index.html?endpoint=${secureEndpoint}" class="product-link" rel="noopener noreferrer">
          <h3 class="product-title">${title}</h3>
          <p class="product-price">${price}</p>
        </a>
        
      </div>
    `;

    mainContent.appendChild(card);
  });
}

init();