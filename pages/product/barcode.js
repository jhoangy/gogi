// pages/product/barcode.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ProductPage = () => {
  const router = useRouter();
  const { code } = router.query; // Get the 'code' query parameter
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showDebug, setShowDebug] = useState(false); // State to toggle debug view

  useEffect(() => {
    if (code) {
      fetchProduct(code);
    }
  }, [code]);

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

  const handleBackToSearch = () => {
    router.push('/product/search'); // Navigate back to the search page
  };

  const handleAddToMeal = () => {
    // Logic for adding to meal goes here
    console.log('Added to meal:', product);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !product) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>Product not found.</p>
        <button onClick={handleBackToSearch} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Back to Search
        </button>
      </div>
    );
  }

  // Destructure the product nutriments per 100g
  const {
    'energy-kcal_100g': energyKcal100g, // Energy in kJ per 100g
    fat_100g,                           // Total fat per 100g
    'saturated-fat_100g': saturated_fat_100g, // Saturated fat per 100g
    carbohydrates_100g,                 // Total carbohydrates per 100g
    sugars_100g,                        // Sugars per 100g
    fiber_100g,                         // Dietary fiber per 100g
    proteins_100g,                      // Proteins per 100g
    sodium_100g                         // Sodium per 100g
  } = product.nutriments || {};

  // Function to round to 2 significant digits
  const formatValue = (value) => value ? Number(value).toFixed(2) : null;

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>{product.product_name}</h1>
      <img src={product.image_url} alt={product.product_name} width="200" />
      {/* Display Nutrition Information */}
      <h2>Nutrition Information (per 100g)</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {energyKcal100g && <li><strong>Calories:</strong> {formatValue(energyKcal100g)} kcal</li>}
        {fat_100g && <li><strong>Fat:</strong> {formatValue(fat_100g)} g</li>}
        {saturated_fat_100g && <li><strong>Saturated Fat:</strong> {formatValue(saturated_fat_100g)} g</li>}
        {fiber_100g && <li><strong>Fiber:</strong> {formatValue(fiber_100g)} g</li>}
        {carbohydrates_100g && <li><strong>Carbohydrates:</strong> {formatValue(carbohydrates_100g)} g</li>}
        {proteins_100g && <li><strong>Proteins:</strong> {formatValue(proteins_100g)} g</li>}
        {sodium_100g && <li><strong>Sodium:</strong> {formatValue(sodium_100g)} g</li>}
        {sugars_100g && <li><strong>Sugars:</strong> {formatValue(sugars_100g)} g</li>}
      </ul>

      {/* Buttons for navigation */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleBackToSearch} style={{ padding: '10px 20px', marginRight: '10px' }}>
          Back to Search
        </button>
        <button onClick={handleAddToMeal} style={{ padding: '10px 20px' }}>
          Add to Meal
        </button>
      </div>

      {/* Debugging Toggle */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setShowDebug(!showDebug)} style={{ padding: '10px 20px' }}>
          {showDebug ? 'Hide API Info' : 'Show API Info'}
        </button>

        {showDebug && (
          <div style={{ marginTop: '10px', border: '1px solid #ccc', padding: '10px' }}>
            <h3>API Information</h3>
            <pre>{JSON.stringify(product, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
