// Test utility for barcode lookup functionality
// This can be used to test the Open Food Facts API integration

export const testBarcodeLookup = async (barcode: string) => {
  try {
    console.log(`Testing barcode lookup for: ${barcode}`);
    
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await response.json();

    console.log('API Response:', data);

    if (data.status === 1 && data.product) {
      const product = data.product;
      const nutrition = product.nutriments || {};
      
      const productInfo = {
        name: product.product_name || product.product_name_en || 'Unknown Product',
        brand: product.brands || product.brand,
        calories: Math.round(nutrition['energy-kcal_100g'] || nutrition['energy_100g'] / 4.184 || 0),
        protein: Math.round((nutrition['proteins_100g'] || 0) * 10) / 10,
        carbs: Math.round((nutrition['carbohydrates_100g'] || 0) * 10) / 10,
        fat: Math.round((nutrition['fat_100g'] || 0) * 10) / 10,
        servingSize: product.serving_size || '100g',
        servingSizeGrams: parseFloat(product.serving_size?.replace(/[^\d.]/g, '')) || 100,
        fiber: Math.round((nutrition['fiber_100g'] || 0) * 10) / 10,
        sugar: Math.round((nutrition['sugars_100g'] || 0) * 10) / 10,
        sodium: Math.round((nutrition['sodium_100g'] || 0) * 10) / 10,
        image: product.image_url || product.image_front_url,
      };

      console.log('Processed Product Info:', productInfo);
      return productInfo;
    } else {
      console.log('Product not found in database');
      return null;
    }
  } catch (error) {
    console.error('Barcode lookup error:', error);
    return null;
  }
};

// Test with some common barcodes
export const testCommonBarcodes = async () => {
  const testBarcodes = [
    '3017620422003', // Nutella
    '7622210961234', // Oreo
    '8901030866349', // Maggi Noodles
    '8901030866348', // Another Maggi product
  ];

  console.log('Testing common barcodes...');
  
  for (const barcode of testBarcodes) {
    console.log(`\n--- Testing barcode: ${barcode} ---`);
    const result = await testBarcodeLookup(barcode);
    if (result) {
      console.log('✅ Success:', result.name);
    } else {
      console.log('❌ Not found');
    }
  }
};

