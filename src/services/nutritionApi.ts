const BASE_URL = 'https://world.openfoodfacts.org/api/v2';

export const nutritionApi = {
  async searchFood(query: string) {
    const response = await fetch(`${BASE_URL}/search?categories_tags_en=${query}&fields=product_name,nutriments,serving_size&page_size=10`);
    const data = await response.json();
    return data.products.map((product: any) => ({
      id: product._id,
      name: product.product_name || 'Unknown',
      servingSize: product.serving_size ? parseFloat(product.serving_size) : 100,
      calories: product.nutriments?.['energy-kcal_100g'] || 0,
      protein: product.nutriments?.proteins_100g || 0,
      carbs: product.nutriments?.carbohydrates_100g || 0,
      fats: product.nutriments?.fat_100g || 0,
    }));
  },

  async getFoodByBarcode(barcode: string) {
    const response = await fetch(`${BASE_URL}/product/${barcode}`);
    const data = await response.json();
    return data.product;
  },
};