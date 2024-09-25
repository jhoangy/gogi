// pages/index.js
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { MealsContext } from '../context/MealsContext'; // Importing context

const Home = () => {
  const router = useRouter();
  const { meals, dailyNutrition, addMealItem } = useContext(MealsContext); // Get meals and dailyNutrition from context
  const [storedRecipes, setStoredRecipes] = useState({ Breakfast: [], Lunch: [], Dinner: [], Snacks: [] });

  const handleAddFood = (mealType) => {
    router.push(`/product/search?mealType=${mealType}`); // Pass meal type to barcode scanner page
  };

  const handleRemoveFood = (mealType, item) => {
    // Logic for removing food item from meal
    addMealItem(mealType, item, false);
    updateDailyNutrition(); // Update daily nutrition when removing
  };

  const handleRemoveRecipe = (mealType, recipe) => {
    const updatedRecipes = storedRecipes[mealType].filter(r => r.name !== recipe.name);
    setStoredRecipes(prev => ({ ...prev, [mealType]: updatedRecipes }));
    updateDailyNutrition(); // Update daily nutrition when removing recipe
  };

  const updateDailyNutrition = () => {
    const newNutrition = {
      calories: 0,
      fat: 0,
      saturatedFat: 0,
      carbohydrates: 0,
      proteins: 0,
      sodium: 0,
      sugars: 0,
    };

    // Calculate nutrition from meals
    Object.values(meals).forEach(mealItems => {
      mealItems.forEach(item => {
        newNutrition.calories += item.calories || 0;
        newNutrition.fat += item.fat || 0;
        newNutrition.saturatedFat += item.saturatedFat || 0;
        newNutrition.carbohydrates += item.carbohydrates || 0;
        newNutrition.proteins += item.proteins || 0;
        newNutrition.sodium += item.sodium || 0;
        newNutrition.sugars += item.sugars || 0;
      });
    });

    // Calculate nutrition from recipes
    Object.keys(storedRecipes).forEach(mealType => {
      storedRecipes[mealType].forEach(recipe => {
        newNutrition.calories += recipe.nutrients.calories || 0;
        newNutrition.fat += recipe.nutrients.fat || 0;
        newNutrition.saturatedFat += recipe.nutrients.saturatedFat || 0;
        newNutrition.carbohydrates += recipe.nutrients.carbohydrates || 0;
        newNutrition.proteins += recipe.nutrients.proteins || 0;
        newNutrition.sodium += recipe.nutrients.sodium || 0;
        newNutrition.sugars += recipe.nutrients.sugars || 0;
      });
    });

    // Update daily nutrition state (assuming you have a function to do this)
    // This function needs to be implemented in the context or handled here
    // Example: updateDailyNutritionState(newNutrition);
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
                <td style={{ textAlign: 'right', padding: '8px' }}>{dailyNutrition.calories} kcal</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Fat</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{dailyNutrition.fat}g</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Saturated Fat</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{dailyNutrition.saturatedFat}g</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Carbohydrates</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{dailyNutrition.carbohydrates}g</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Protein</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{dailyNutrition.proteins}g</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Sodium</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{dailyNutrition.sodium}mg</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Sugar</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{dailyNutrition.sugars}g</td>
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
                    <button onClick={() => handleRemoveFood(mealType, item)} style={{ marginLeft: '10px', cursor: 'pointer' }}>
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
