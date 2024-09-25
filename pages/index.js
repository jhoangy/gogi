// pages/index.js
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { MealsContext } from '../context/MealsContext'; // Importing context

const Home = () => {
  const router = useRouter();
  const { meals, dailyNutrition, updateDailyNutrition, updateMeals } = useContext(MealsContext); // Get meals and dailyNutrition from context
  const [storedRecipes] = useState({ Breakfast: [], Lunch: [], Dinner: [], Snacks: [] });

  const handleAddFood = (mealType) => {
    router.push(`/product/search?mealType=${mealType}`); // Pass meal type to barcode scanner page
  };

  const handleRemoveFood = (mealType, index) => {
    // Remove the food item at the specific index in the meal array
    const updatedMealItems = meals[mealType]; // Copy the current meal items
    const removedMeal = updatedMealItems[index];
    updatedMealItems.splice(index, 1); // Remove the item at the given index
    console.log(updatedMealItems);
    // Update the meals context by removing the item from the specified meal type
    updateMeals(mealType, updatedMealItems);
    
      // Create a new object with negative nutritional values for the removed meal
    const negativeNutrition = {
      nutriments:{
      'energy-kcal_100g': -(removedMeal.nutriments['energy-kcal_100g'] || 0),
      fat_100g: -(removedMeal.nutriments.fat_100g || 0),
      'saturated-fat_100g': -(removedMeal.nutriments['saturated-fat_100g'] || 0),
      carbohydrates_100g: -(removedMeal.nutriments.carbohydrates_100g || 0),
      proteins_100g: -(removedMeal.nutriments.proteins_100g || 0),
      sodium_100g: -(removedMeal.nutriments.sodium_100g || 0),
      sugars_100g: -(removedMeal.nutriments.sugars_100g || 0),
      }
    };

    // Update daily nutrition after removing the food item
    updateDailyNutrition(negativeNutrition);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Product Lookup</h1>

      {/* Page layout divided into 3 sections: left, middle, and right */}
      <div className="content-container" style={styles.contentContainer}>
        
        {/* Left Section: Daily Nutrition */}
        <div style={styles.section}>
          <h2>Daily Nutrition</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>Nutrient</th>
                <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: '8px' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px' }}>Calories</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{(dailyNutrition.calories).toFixed(2)} kcal</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Fat</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{(dailyNutrition.fat).toFixed(2)}g</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Saturated Fat</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{(dailyNutrition.saturatedFat).toFixed(2)}g</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Carbohydrates</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{(dailyNutrition.carbohydrates).toFixed(2)}g</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Protein</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{(dailyNutrition.proteins).toFixed(2)}g</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Sodium</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{(dailyNutrition.sodium).toFixed(2)}mg</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Sugar</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{(dailyNutrition.sugars).toFixed(2)}g</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Middle Section: Breakfast, Lunch, Dinner, Snacks */}
        <div style={styles.section}>
          {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((mealType) => (
            <section key={mealType} style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px' }}>
              <h3>{mealType}</h3>
              <button style={{ padding: '10px 20px' }} onClick={() => handleAddFood(mealType)}>
                Add Food
              </button>
              <ul>
                {meals[mealType]?.map((item, index) => (
                  <li key={index}>
                    {item.product_name}
                    <button onClick={() => handleRemoveFood(mealType, index)} style={{ marginLeft: '10px', cursor: 'pointer' }}>
                      Remove
                    </button>
                  </li>
                ))}
                

                {/* Display added recipes for this meal type */}
                {storedRecipes[mealType]?.map((recipe, index) => (
                  <li key={index}>
                    {recipe.name} - {recipe.nutrients.calories} Calories
                    <button onClick={() => handleRemoveRecipe(mealType, recipe)} style={{ marginLeft: '10px', cursor: 'pointer' }}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Right Section: Daily Water Intake */}
        <div style={styles.section}>
          <h2>Daily Water Intake</h2>
          <div style={{ width: '100px', height: '100px', backgroundColor: 'red', margin: '0 auto' }}></div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .content-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  contentContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '40px',
    textAlign: 'left',
  },
  section: {
    flex: '1',
    padding: '20px',
  }
};

export default Home;
