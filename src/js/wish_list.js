import { loadHeaderFooter, toggleMenu } from './utils.mjs';

async function init() {
    await loadHeaderFooter();
    toggleMenu();
}

document.addEventListener('DOMContentLoaded', async () => {
    renderWishlistPage();
    await init();
});

function renderWishlistPage() {
  const wishlistItems = JSON.parse(localStorage.getItem('wish_list')) || [];
  const container = document.getElementById('wishlist-content'); 

  if (wishlistItems.length === 0) {
    container.innerHTML = `
      <div class="empty-wishlist">
        <h2>Your Wish List is empty</h2>
        <p>Explore our products and add your favorites!</p>
        <button class="btn-action" onclick="window.location.href='/index.html'">Go Shopping</button>
      </div>
    `;
    return;
  }

  container.innerHTML = '';

  wishlistItems.forEach((data, index) => {
    const product = data.product_results;
    if (!product) return;

    const imageUrl = product.thumbnails?.[0] || '';
    const brand = product.brand || 'Unknown Brand';
    const title = product.title || 'Untitled Product';

    const storesHtml = product.stores?.map(store => {
      const hasDiscount = store.extracted_original_price && (store.extracted_total < store.extracted_original_price);
      
      let discountBadge = '';
      let priceHtml = `<span class="store-price-unique">${store.total || store.price}</span>`;

      if (hasDiscount) {
        const discountPercent = Math.round(((store.extracted_original_price - store.extracted_total) / store.extracted_original_price) * 100);
        
        discountBadge = `<span class="discount-badge">-${discountPercent}%</span>`;
        
        priceHtml = `
          <div class="price-container ${hasDiscount ? 'highlighted-deal' : ''}">
            <span class="original-price ${hasDiscount ? 'highlighted-deal' : ''}">${store.original_price}</span>
            <span class="discounted-price ${hasDiscount ? 'highlighted-deal' : ''}">${store.total || store.price}</span>
          </div>
        `;
      }

      return `
        <a href="${store.link}" target="_blank" class="wishlist-store-card ${hasDiscount ? 'highlighted-deal' : ''}">
          <div class="store-meta ${hasDiscount ? 'highlighted-deal' : ''}">
            <img src="${store.logo}" alt="${store.name} logo" class="store-mini-logo ${hasDiscount ? 'highlighted-deal' : ''}">
            <span class="store-name">${store.name}</span>
          </div>
          <div class="store-pricing-block ${hasDiscount ? 'highlighted-deal' : ''}">
            ${discountBadge}
            ${priceHtml}
            <span class="buy-button ${hasDiscount ? 'highlighted-deal' : ''}">Buy Now</span>
          </div>
        </a>
      `;
    }).join('') || '<p class="no-stores">No offers available.</p>';

    const itemRow = document.createElement('article');
    itemRow.classList.add('wishlist-row');
    
    itemRow.innerHTML = `
      <div class="wishlist-left">
        <a href="../product_details/index.html?fromStorage=wish_list&id=${index}" class="wishlist-preview-link">
          <img src="${imageUrl}" alt="${title}" class="wishlist-image" loading="lazy">
        </a>
        <div class="wishlist-info">
          <span class="product-brand">${brand}</span>
          <a href="../product_details/index.html?fromStorage=wish_list&id=${index}" class="wishlist-preview-link">
            <h2 class="product-title">${title}</h2>
          </a>
          <button class="btn-remove-wishlist" data-index="${index}">Remove Item 🗑️</button>
        </div>
      </div>
      
      <div class="wishlist-right">
        <div class="wishlist-stores-list">
          ${storesHtml}
        </div>
      </div>
    `;

    itemRow.querySelector('.btn-remove-wishlist').addEventListener('click', () => {
      removeFromWishlist(index);
    });

    container.appendChild(itemRow);
  });
}

function removeFromWishlist(index) {
  let wishlistItems = JSON.parse(localStorage.getItem('wish_list')) || [];
  wishlistItems.splice(index, 1);
  localStorage.setItem('wish_list', JSON.stringify(wishlistItems));
  renderWishlistPage(); 
}