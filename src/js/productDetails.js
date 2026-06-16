import { loadHeaderFooter, toggleMenu } from "./utils.mjs";
import { loadProductDetails } from "./data.mjs";

async function init() {
    await loadHeaderFooter();
    toggleMenu();
}


document.addEventListener('DOMContentLoaded', async () => {
    init();
    const productData = await loadProductDetails();
    renderPhoneDetails(productData);
});

function renderPhoneDetails(data) {
  const container = document.getElementById('main-details');
  if (!container || !data || !data.product_results) {
    console.error("Data or container not found");
    return;
  }

  const product = data.product_results;
  
  const imageUrl = product.thumbnails?.[0] || '';
  const brand = product.brand || 'Unknown Brand';
  const title = product.title || 'Untitled Product';
  const rating = product.rating || 'N/A';

  const getFeature = (keyword) => {
    if (!product.about_the_product || !product.about_the_product.features) return 'Not specified';
    const feature = product.about_the_product.features.find(f => 
      f.title.toLowerCase().includes(keyword.toLowerCase())
    );
    return feature ? feature.value : 'Not specified';
  };

  const processor = getFeature('Processor');
  const battery = getFeature('Battery Capacity');
  const screen = `${getFeature('Display Size')} - ${getFeature('Display Type')}`;
  const camera = getFeature('Camera Resolution');
  
  const storageMatch = title.match(/(\d+(?:GB|TB))/i);
  const storage = storageMatch ? storageMatch[0] : 'Not specified'; 
  const ram = getFeature('RAM'); 

  const storesHtml = product.stores?.map(store => `
    <a href="${store.link}" target="_blank" class="store-card">
      <div class="store-info">
        <img src="${store.logo}" alt="${store.name} logo" class="store-logo">
        <span class="store-name">${store.name}</span>
      </div>
      <div class="store-checkout">
        <span class="store-price">${store.total || store.price}</span>
        <span class="store-button">Buy Now</span>
      </div>
    </a>
  `).join('') || '<p class="no-stores">No stores available.</p>';

  container.innerHTML = `
    <div class="product-header">
      <span class="product-brand">${brand}</span>
      <h1 class="product-details-title">${title}</h1>
      <div class="product-rating">⭐ ${rating} / 5.0</div>
    </div>

    <div class="product-image-container">
      <img src="${imageUrl}" alt="${title}" class="product-image-details" loading="lazy">
    </div>

    <div class="product-specs">
      <h2>Technical Specifications</h2>
      <ul class="specs-grid">
        <li><strong>Processor:</strong> <span>${processor}</span></li>
        <li><strong>RAM:</strong> <span>${ram}</span></li>
        <li><strong>Storage:</strong> <span>${storage}</span></li>
        <li><strong>Camera:</strong> <span>${camera}</span></li>
        <li><strong>Display:</strong> <span>${screen}</span></li>
        <li><strong>Battery:</strong> <span>${battery}</span></li>
      </ul>
    </div>

    <div class="product-stores">
      <h2>Where to Buy</h2>
      <div class="stores-list">
        ${storesHtml}
      </div>
    </div>
  `;
}
