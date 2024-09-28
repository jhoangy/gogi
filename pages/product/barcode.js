// pages/product/barcode.js
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { MealsContext } from '../../context/MealsContext'; // Import MealsContext

const ProductPage = () => {
  const router = useRouter();
  const { code, mealType } = router.query; // Get the 'code' and 'mealType' query parameters
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('Breakfast'); // Default meal type
  const [quantity, setQuantity] = useState(100); // Default quantity in grams

  const { addFoodToMeal } = useContext(MealsContext); // Use context to get addFoodToMeal

  const handleBackToSearch = (mealType) => {
    console.log(mealType)
    router.push(`/product/search?mealType=${selectedMeal}`); // Pass meal type to barcode scanner page
  };

  useEffect(() => {
    if (code) {
      fetchProduct(code);
    }

    if (mealType) {
      setSelectedMeal(mealType); // Set selected meal from query parameter
    }
  }, [code, mealType]);

  const fetchProduct = async (barcode) => {
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      if (data.status === 1) {
        setProduct(data.product);
        setError(false);
      } else {
        setError(true);
      }
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  const handleAddToMeal = () => {
    if (product) {
      // Prepare product with adjusted nutrition values
      const adjustedProduct = {
        ...product,
        nutriments: {
          'energy-kcal_100g': product.nutriments['energy-kcal_100g'] * (quantity / 100),
          fat_100g: product.nutriments.fat_100g * (quantity / 100),
          'saturated-fat_100g': product.nutriments['saturated-fat_100g'] * (quantity / 100),
          carbohydrates_100g: product.nutriments.carbohydrates_100g * (quantity / 100),
          proteins_100g: product.nutriments.proteins_100g * (quantity / 100),
          sodium_100g: product.nutriments.sodium_100g * (quantity / 100),
          sugars_100g: product.nutriments.sugars_100g * (quantity / 100),
        },
      };
      console.log(adjustedProduct)
      addFoodToMeal(selectedMeal, adjustedProduct); // Add the product to the selected meal
      router.push('/'); // Optionally, navigate back to the home page after adding
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !product) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>Product not found.</p>
        <button onClick={handleBackToSearch} >
          Back to Search
        </button>
      </div>
    );
  }

  // Destructure the product nutriments per 100g
  const {
    'energy-kcal_100g': energyKcal100g,
    fat_100g,
    'saturated-fat_100g': saturated_fat_100g,
    carbohydrates_100g,
    sugars_100g,
    fiber_100g,
    proteins_100g,
    sodium_100g,
  } = product.nutriments || {};

  // Function to round to 2 significant digits
  const formatValue = (value) => (value ? Number(value).toFixed(2) : null);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>{product.product_name}</h1>
      <img src={product.image_url} alt={product.product_name} width="200" />
      {/* Display Nutrition Information */}
      <h2>Nutrition Information (per 100g)</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li><strong>Calories:</strong> {energyKcal100g ? formatValue(energyKcal100g) : "0"} kcal</li>
        <li><strong>Fat:</strong> {fat_100g ? formatValue(fat_100g) : "0"} g</li>
        <li><strong>Saturated Fat:</strong> {saturated_fat_100g ? formatValue(saturated_fat_100g) : "0"} g</li>
        <li><strong>Fiber:</strong> {fiber_100g ? formatValue(fiber_100g) : "0"} g</li>
        <li><strong>Carbohydrates:</strong> {carbohydrates_100g ? formatValue(carbohydrates_100g) : "0"} g</li>
        <li><strong>Proteins:</strong> {proteins_100g ? formatValue(proteins_100g) : "0"} g</li>
        <li><strong>Sodium:</strong> {sodium_100g ? formatValue(sodium_100g) : "0"} g</li>
        <li><strong>Sugars:</strong> {sugars_100g ? formatValue(sugars_100g) : "0"} g</li>
      </ul>

      {/* Quantity Input */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="quantity" style={{ marginRight: '10px' }}>Quantity in grams:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ padding: '10px', marginBottom: '20px', width: '80px' }}
          min="1"
        />
      </div>

      {/* Buttons for navigation */}
      <div style={{ marginTop: '0px', marginBottom: "20px"}}>
      <button onClick={handleBackToSearch} style={{ padding: '10px 20px' }}>
          Back to Search
        </button>
        <button onClick={handleAddToMeal} style={{ padding: '10px 20px' }}>
          Add to Meal
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
