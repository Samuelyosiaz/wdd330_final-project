import { loadHeaderFooter, toggleMenu } from "./utils.mjs";
import { getMainData } from './data.mjs'; 
import { renderProductCards } from './lightning_deals.js'; 


let currentProducts = []; 

document.addEventListener('DOMContentLoaded', async () => {
    //This functions will load the header and footer, and also set up the menu toggle functionality. It's called on every page to ensure consistency across the site.
  await loadHeaderFooter();
  toggleMenu();

  const brandSelect = document.getElementById('filter-brand');
  const minPriceInput = document.getElementById('price-min');
  const maxPriceInput = document.getElementById('price-max');
  const filtersForm = document.getElementById('filters-form');

  //Initial load of products with a default search term (could be empty or a generic one)
  await updateBrandProducts(brandSelect.value);

  brandSelect.addEventListener('change', async (e) => {
    await updateBrandProducts(e.target.value);
  });

  // 5. Evento: El usuario escribe en los inputs de precio (Filtro en tiempo real)
  minPriceInput.addEventListener('input', applyClientFilters);
  maxPriceInput.addEventListener('input', applyClientFilters);

  // 6. Evento: Limpiar filtros con el botón Reset
  filtersForm.addEventListener('reset', () => {
    // Usamos setTimeout para esperar un instante a que el formulario limpie los campos nativamente
    setTimeout(async () => {
      await updateBrandProducts('');
    }, 10);
  });
});

// This function will fetch the products based on the selected brand and update the currentProducts array, then apply any active client-side filters to display the results.
async function updateBrandProducts(brandQuery) {
  const searchTerm = brandQuery || "smartphones"; 
  
  const jsonData = await getMainData(searchTerm);

  currentProducts = jsonData?.shopping_results || [];

  applyClientFilters();
}

// This function will filter the products in memory by price range (using extracted_price)
function applyClientFilters() {
  const minPrice = parseFloat(document.getElementById('price-min').value) || 0;
  const maxPrice = parseFloat(document.getElementById('price-max').value) || Infinity;

  const filtered = currentProducts.filter(product => {
    const cleanPrice = product.extracted_price;
    
    if (cleanPrice === undefined || cleanPrice === null) return false;
    
    return cleanPrice >= minPrice && cleanPrice <= maxPrice;
  });

  const mockJsonData = { shopping_results: filtered };

  renderProductCards(mockJsonData);
}