// pages/product/search.js
import { useState, useRef, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Quagga from 'quagga';
import { MealsContext } from '../../context/MealsContext'; // Import MealsContext

const Search = () => {
  const [barcode, setBarcode] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [recipeQuery, setRecipeQuery] = useState('');
  const [userRecipe, setUserRecipe] = useState('');
  const [nutritionResults, setNutritionResults] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [nutritionPopupVisible, setNutritionPopupVisible] = useState(false);
  const [recipePopupVisible, setRecipePopupVisible] = useState(false);
  const videoRef = useRef(null);
  const router = useRouter();
  const streamRef = useRef(null);
  const [yieldValue, setYieldValue] = useState(1);
  const [selectedMeal, setSelectedMeal] = useState(router.query.mealType || 'Breakfast'); // Set default meal type from query
  const { addFoodToMeal } = useContext(MealsContext); // Use context to get addFoodToMeal
  const {mealType } = router.query; 

  const handleAddRecipe = (recipe, servings) => {
    if (recipe) {
      const recipeToAdd = {
        product_name: recipe.label ?? "My Recipe",
        nutriments:{
        'energy-kcal_100g': (recipe.calories/ servings).toFixed(2), 
        fat_100g: (recipe.totalNutrients?.FAT?.quantity/ servings).toFixed(2),
        'saturated-fat_100g': (recipe.totalNutrients?.FASAT?.quantity/ servings).toFixed(2),
        carbohydrates_100g: (recipe.totalNutrients?.CHOCDF?.quantity/ servings).toFixed(2),
        proteins_100g: (recipe.totalNutrients?.PROCNT?.quantity/ servings).toFixed(2),
        sodium_100g: (recipe.totalNutrients?.NA?.quantity/ servings).toFixed(2),
        sugars_100g: (recipe.totalNutrients?.SUGAR?.quantity/ servings).toFixed(2),
        mealType: selectedMeal, // Add meal type here
        }
      };
      console.log(recipe);
      // Save the recipe to local storage
      localStorage.setItem('addedRecipe', JSON.stringify(recipeToAdd));
      addFoodToMeal(selectedMeal,recipeToAdd); // Add recipe to context
      router.push('/'); // Redirect back to index.js
      console.log('Recipe added:', recipeToAdd); // For debugging
    } else {
      console.error('No recipe to add'); // Log if no recipe is available
    }
  };

  const handleBarcodeSubmit = () => {
    if (barcode) {
      router.push(`/product/barcode?code=${barcode}&mealType=${selectedMeal}`); // Pass meal type
    }
  };

  const handleRecipeSubmit = async () => {
    if (recipeQuery) {
      try {
        const response = await fetch(
          `https://api.edamam.com/search?q=${recipeQuery}&app_id=0114207c&app_key=00ebfc56e4c59d4a49311979e2122efc`
        );
        const data = await response.json();
        console.log(data);
        if (data.hits && data.hits.length > 0) {
          setRecipes(data.hits.map(hit => hit.recipe));
          setRecipePopupVisible(true);
        } else {
          console.log('No recipe found for the query.');
        }
      } catch (error) {
        console.error('Error fetching recipe data:', error);
      }
    }
  };

  const handleUserRecipeSubmit = async () => {
    if (userRecipe) {
      const ingredients = userRecipe.split('\n').map(ingredient => ingredient.trim()).filter(Boolean);
      if (ingredients.length === 0) {
        console.error('No valid ingredients provided');
        return;
      }

      try {
        const response = await fetch(
          `https://api.edamam.com/api/nutrition-details?app_id=09797d77&app_key=8c815a6c8a44e6929f8918b3794c1440`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingr: ingredients }),
          }
        );
        const data = await response.json();
        console.log(data);
        setNutritionResults(data);
        setNutritionPopupVisible(true);
      } catch (error) {
        console.error('Error fetching nutrition analysis:', error);
      }
    }
  };

  const handlePopupClose = () => {
    setNutritionPopupVisible(false);
    setRecipePopupVisible(false);
  };

  const startScanner = () => {
    setCameraActive(true);
  };

  useEffect(() => {
    if (cameraActive) {
      if (videoRef.current) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
          .then(stream => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              streamRef.current = stream;
              videoRef.current.setAttribute('playsinline', 'true');
              videoRef.current.play();
            }
          })
          .catch(err => {
            console.error("Error accessing camera:", err);
          });

        Quagga.init({
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: videoRef.current,
            constraints: {
              width: { min: 640 },
              height: { min: 480 },
              facingMode: 'environment',
            },
          },
          decoder: {
            readers: ['ean_reader'],
          },
          locate: true,
        }, (err) => {
          if (err) {
            console.error("Quagga initialization failed:", err);
            return;
          }
          Quagga.start();
        });

        Quagga.onDetected((result) => {
          if (result && result.codeResult && result.codeResult.code) {
            const scannedCode = result.codeResult.code;
            Quagga.stop();
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
            }
            setCameraActive(false);
            router.push(`/product/barcode?code=${scannedCode}&mealType=${selectedMeal}`); // Pass meal type
          }
        });
      }
    }
    if (mealType) {
      setSelectedMeal(mealType); // Set selected meal from query parameter
    }
    return () => {
      if (Quagga && Quagga.initialized) {
        try {
          Quagga.stop();
        } catch (error) {
          console.error("Error during Quagga stop cleanup:", error);
        }
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraActive, mealType]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Search Product</h1>

      <button onClick={startScanner} style={{ padding: '10px 20px', marginBottom: '20px' }}>
        {cameraActive ? 'Scanning...' : 'Scan Barcode with Camera'}
      </button>

      {cameraActive && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <video
            ref={videoRef}
            style={{
              width: '100%',
              maxWidth: '600px',
              height: 'auto',
              display: cameraActive ? 'block' : 'none',
            }}
          />
        </div>
      )}

      <input
        type="text"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        placeholder="Enter a barcode"
        style={{ padding: '10px', marginBottom: '20px', width: '80%' }}
      />
      <button onClick={handleBarcodeSubmit} style={{ padding: '10px 20px', marginBottom: '20px' }}>
        Search Product
      </button>

      <h2>Search for Recipe</h2>
      <input
        type="text"
        value={recipeQuery}
        onChange={(e) => setRecipeQuery(e.target.value)}
        placeholder="Enter a recipe name"
        style={{ padding: '10px', marginBottom: '20px', width: '80%' }}
      />
      <button onClick={handleRecipeSubmit} style={{ padding: '10px 20px', marginBottom: '20px' }}>
        Search Recipe
      </button>

      <h2>Submit Your Recipe</h2>

      <textarea
        value={userRecipe}
        onChange={(e) => setUserRecipe(e.target.value)}
        placeholder="Enter your recipe ingredients"
        rows={5}
        style={{ padding: '10px', marginBottom: '10px', width: '80%', resize: 'vertical' }}
      />

      <label style={{ display: 'block', marginBottom: '5px' }}>Yield</label>
      <input
        type="number"
        value={yieldValue}
        onChange={(e) => setYieldValue(e.target.value)}
        style={{ padding: '10px', marginBottom: '10px', width: '4ch' }}
        min="1"
        max="9999"
      />

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button onClick={handleUserRecipeSubmit} style={{ padding: '10px 20px' }}>
          Submit MyRecipe
        </button>
      </div>

      {nutritionPopupVisible && (
        <div className="popup" onClick={handlePopupClose} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }}>
          <div className="popup-content" onClick={e => e.stopPropagation()} style={{ background: '#fff', margin: 'auto', padding: '20px', borderRadius: '5px', width: '80%', maxWidth: '500px', height: 'auto', overflowY: 'auto', position: 'relative', top: '50%', transform: 'translateY(-50%)' }}>
            <h2>Nutritional Analysis</h2>
            <button onClick={handlePopupClose} style={{ position: 'absolute', top: '10px', right: '10px' }}>Close</button>
            <div>
              <p><strong>Calories:</strong> {(nutritionResults.calories / yieldValue).toFixed(2)}</p>
              <p><strong>Fat:</strong> {(nutritionResults.totalNutrients?.FAT?.quantity / yieldValue).toFixed(2)} {nutritionResults.totalNutrients?.FAT?.unit}</p>
              <p><strong>Saturated Fat:</strong> {(nutritionResults.totalNutrients?.FASAT?.quantity / yieldValue).toFixed(2)} {nutritionResults.totalNutrients?.FASAT?.unit}</p>
              <p><strong>Fiber:</strong> {(nutritionResults.totalNutrients?.FIBTG?.quantity / yieldValue).toFixed(2)} {nutritionResults.totalNutrients?.FIBTG?.unit}</p>
              <p><strong>Carbohydrates:</strong> {(nutritionResults.totalNutrients?.CHOCDF?.quantity / yieldValue).toFixed(2)} {nutritionResults.totalNutrients?.CHOCDF?.unit}</p>
              <p><strong>Protein:</strong> {(nutritionResults.totalNutrients?.PROCNT?.quantity / yieldValue).toFixed(2)} {nutritionResults.totalNutrients?.PROCNT?.unit}</p>
              <p><strong>Sodium:</strong> {(nutritionResults.totalNutrients?.NA?.quantity / yieldValue).toFixed(2)} {nutritionResults.totalNutrients?.NA?.unit}</p>
              <p><strong>Sugar:</strong> {(nutritionResults.totalNutrients?.SUGAR?.quantity / yieldValue).toFixed(2)} {nutritionResults.totalNutrients?.SUGAR?.unit}</p>
            </div>
            <button onClick={() => handleAddRecipe(nutritionResults,yieldValue)} style={{ padding: '10px 20px', marginTop: '10px' }}>
                    Add My Recipe
                  </button>
          </div>
        </div>
      )}

{recipePopupVisible && (
        <div className="popup" onClick={handlePopupClose} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }}>
          <div className="popup-content" onClick={e => e.stopPropagation()} style={{ background: '#fff', margin: 'auto', padding: '20px', borderRadius: '5px', width: '80%', maxWidth: '500px', height: 'auto', overflowY: 'scroll', position: 'relative', top: '50%', transform: 'translateY(-50%)' }}>
            <h2>Recipes</h2>
            <button onClick={handlePopupClose} style={{ position: 'absolute', top: '10px', right: '10px' }}>Close</button>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {recipes.map((recipe, index) => {
                const servings = recipe.yield || 1; // Get yield from API

                return (
                  <div key={index} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                    <h3>{recipe.label}</h3>
                    <p><strong>Calories:</strong> {(recipe.calories / servings).toFixed(2)}</p>
                    <p><strong>Fat:</strong> {recipe.totalNutrients?.FAT?.quantity ? (recipe.totalNutrients.FAT.quantity / servings).toFixed(2) : 'N/A'} {recipe.totalNutrients?.FAT?.unit}</p>
                    <p><strong>Saturated Fat:</strong> {recipe.totalNutrients?.FASAT?.quantity ? (recipe.totalNutrients.FASAT.quantity / servings).toFixed(2) : 'N/A'} {recipe.totalNutrients?.FASAT?.unit}</p>
                    <p><strong>Fiber:</strong> {recipe.totalNutrients?.FIBTG?.quantity ? (recipe.totalNutrients.FIBTG.quantity / servings).toFixed(2) : 'N/A'} {recipe.totalNutrients?.FIBTG?.unit}</p>
                    <p><strong>Carbohydrates:</strong> {recipe.totalNutrients?.CHOCDF?.quantity ? (recipe.totalNutrients.CHOCDF.quantity / servings).toFixed(2) : 'N/A'} {recipe.totalNutrients?.CHOCDF?.unit}</p>
                    <p><strong>Protein:</strong> {recipe.totalNutrients?.PROCNT?.quantity ? (recipe.totalNutrients.PROCNT.quantity / servings).toFixed(2) : 'N/A'} {recipe.totalNutrients?.PROCNT?.unit}</p>
                    <p><strong>Sodium:</strong> {recipe.totalNutrients?.NA?.quantity ? (recipe.totalNutrients.NA.quantity / servings).toFixed(2) : 'N/A'} {recipe.totalNutrients?.NA?.unit}</p>
                    <p><strong>Sugar:</strong> {recipe.totalNutrients?.SUGAR?.quantity ? (recipe.totalNutrients.SUGAR.quantity / servings).toFixed(2) : 'N/A'} {recipe.totalNutrients?.SUGAR?.unit}</p>
                    <button onClick={() => handleAddRecipe(recipe,servings)} style={{ padding: '10px 20px', marginTop: '10px' }}>
                    Add Recipe
                  </button>
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default Search;

