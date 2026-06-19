export async function getMainData(query) {
    try { 
        
        const apiKey = import.meta.env.VITE_SERPAPI_KEY; 
        const engine = "google_shopping_light";
        const searchQuery = query || "better smartphones";
        
        const url = `/api-serp/search.json?engine=${engine}&q=${encodeURIComponent(searchQuery)}&api_key=${apiKey}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const json = await response.json();
        
        console.log("Resultados de productos:", json["shopping_results"]);
        
        return json; 
        
    } catch (error) {
        console.error('Error fetching data desde SerpAPI:', error);
        return null;
    }
}

//This function will load the product details based on the endpoint passed in the URL parameters. It will fetch the data and then call the render function to display the details on the page.
export async function loadProductDetails() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const fromStorage = urlParams.get('fromStorage'); 
    const storageId = urlParams.get('id');            

    if (fromStorage && storageId !== null) {
      console.log(`Loading product from localStorage (${fromStorage})...`);
      const storedItems = JSON.parse(localStorage.getItem(fromStorage)) || [];
      const productData = storedItems[storageId];
      
      if (!productData) {
        throw new Error(`Product not found in localStorage at index ${storageId}`);
      }
      
      return productData; 
    }

    const encodedEndpoint = urlParams.get('endpoint');

    if (!encodedEndpoint) {
      console.error("No endpoint found in URL parameters");
      return;
    }

    const cleanEndpoint = decodeURIComponent(encodedEndpoint);
    const apiKey = import.meta.env.VITE_SERPAPI_KEY;
    const finalUrl = `${cleanEndpoint}&api_key=${apiKey}`;

    const response = await fetch(finalUrl);

    if (!response.ok) {
      throw new Error(`Error in the request: ${response.status}`);
    }

    const productData = await response.json();
    return productData; 

  } catch (error) {
    console.error("Error while loading the product data", error);
  }
}