import { loadHeaderFooter, toggleMenu, saveToStorage, triggerSuccessAnimation , purgeProductJson} from "./utils.mjs";
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
    return feature ? feature.value : null;
  };

  const processor = getFeature('Processor') || 'Not specified';
  const battery = getFeature('Battery Capacity') || 'Not specified';
  const screen = getFeature('Display Size') || getFeature('Screen Size') || 'Not specified';
  const camera = getFeature('Camera Resolution') || 'Not specified';

  
  const storage = getFeature('Storage') || 'Not specified';
  const ram = getFeature('RAM') || 'Not specified';

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

    <div class="actions-panel">
        <button id="add-to-wishlist-btn" class="btn-action">Add to Wish List</button>
        <button id="add-to-vs-btn" class="btn-action">Add to Compare (VS)</button>
    </div>

    <div class="product-stores">
      <h2>Where to Buy</h2>
      <div class="stores-list">
        ${storesHtml}
      </div>
    </div>
  `;
    //This part is responsible for adding the product to the wish list or the compare list when the corresponding button is clicked. It uses the saveToStorage function from utils.mjs to save the product data in local storage and then triggers a success animation to give feedback to the user.
    const wishListBtn = document.getElementById('add-to-wishlist-btn');
    const vsBtn = document.getElementById('add-to-vs-btn');

    // 3. Attach the event listeners directly
    wishListBtn.addEventListener('click', async () => {
        const productData = purgeProductJson(data);
        const success = saveToStorage('wish_list', productData);
        if (success) {
            triggerSuccessAnimation(wishListBtn, "Added to Wish List! ❤️");
        } else {
            triggerSuccessAnimation(wishListBtn, "Already in Wish List!", true);
        }
    });

    vsBtn.addEventListener('click', () => {
        const productData = purgeProductJson(data);
        saveToStorage('vs', productData, 2);
        triggerSuccessAnimation(vsBtn, "Added to Compare! ⚔️");
    });
}
