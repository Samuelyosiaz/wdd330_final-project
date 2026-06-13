export async function getMainData() {
    try { 
        const response = await fetch('/json/prueba.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        return jsonData;
    }
    
    catch (error) {
        console.error('Error fetching data:', error);
        return null;
    };
};