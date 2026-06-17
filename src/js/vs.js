import { loadHeaderFooter, toggleMenu } from "./utils.mjs";

async function init() {
    await loadHeaderFooter();
    toggleMenu();
}
document.addEventListener('DOMContentLoaded', () => {
    renderVersusPage();
    init();
});

function renderVersusPage() {
  
  const comparedProducts = JSON.parse(localStorage.getItem('vs')) || [];

  const firstSlot = document.querySelector('#first-versus');
  const secondSlot = document.querySelector('#second-versus');

  setupSlot(firstSlot, comparedProducts[0], 0);

  setupSlot(secondSlot, comparedProducts[1], 1);
};

//This function populates a versus slot with product data or shows the "add to comparison" prompt if no product is present
function setupSlot(slotElement, data, index) {
  const addedContainer = slotElement.querySelector('.versus-added');
  const notAddedContainer = slotElement.querySelector('.not-versus-added');

  if (data && data.product_results) {
    notAddedContainer.style.display = 'none';
    addedContainer.style.display = 'block';

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

    let processor = getFeature('Processor') || 'Not specified';
    let battery = getFeature('Battery Capacity') || 'Not specified';
    let screen = getFeature('Display Size') || getFeature('Screen Size') || 'Not specified';
    let camera = getFeature('Camera Resolution') || 'Not specified';
    
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

    addedContainer.innerHTML = `
      <div class="product-header">
        <span class="product-brand">${brand}</span>
        <a href="../product_details/index.html?fromStorage=vs&id=${index}" class="wishlist-preview-link">
          <h2 class="product-details-title">${title}</h2>
        </a>
        <div class="product-rating">⭐ ${rating} / 5.0</div>
      </div>

      <div class="product-image-container">
        <a href="../product_details/index.html?fromStorage=vs&id=${index}" class="wishlist-preview-link">
            <img src="${imageUrl}" alt="${title}" class="product-image-details" loading="lazy">
        </a>
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
          <button class="btn-action btn-wishlist">Add to Wish List</button>
          <button class="btn-action btn-remove-vs" style="background-color: #e76f51;">Remove ❌</button>
      </div>

      <div class="product-stores">
        <h2>Where to Buy</h2>
        <div class="stores-list">
          ${storesHtml}
        </div>
      </div>
    `;

    addedContainer.querySelector('.btn-remove-vs').addEventListener('click', () => {
      removeFromVersus(index);
    });

    addedContainer.querySelector('.btn-wishlist').addEventListener('click', () => {
      addToWishListFromVs(data, addedContainer.querySelector('.btn-wishlist'));
    });

  } else {
    addedContainer.style.display = 'none';
    notAddedContainer.style.display = 'block';

    const goHomeBtn = notAddedContainer.querySelector('.add-vs');
    goHomeBtn.addEventListener('click', () => {
      window.location.href = '/index.html';
    });
  }
};

function removeFromVersus(index) {
  let comparedProducts = JSON.parse(localStorage.getItem('vs')) || [];

  comparedProducts.splice(index, 1);

  localStorage.setItem('vs', JSON.stringify(comparedProducts));

  renderVersusPage();
}


function addToWishListFromVs(product, buttonElement) {
  let wishList = JSON.parse(localStorage.getItem('wish_list')) || [];
  
  const exists = wishList.some(item => item.product_results?.title === product.product_results?.title);

  if (!exists) {
    wishList.push(product); 
    localStorage.setItem('wish_list', JSON.stringify(wishList));
    
    buttonElement.innerText = "Added! ❤️";
    buttonElement.disabled = true;
  } else {
    buttonElement.innerText = "Already added!";
    buttonElement.style.backgroundColor = "#e76f51";
  }
}

