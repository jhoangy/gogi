// context/MealsContext.js
import { createContext, useState } from 'react';

export const MealsContext = createContext();

export const MealsProvider = ({ children }) => {
  const [meals, setMeals] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });

  const [recipes, setRecipes] = useState([]); // State to hold recipes

  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 0,
    fat: 0,
    saturatedFat: 0,
    carbohydrates: 0,
    proteins: 0,
    sodium: 0,
    sugars: 0,
  });

  const addFoodToMeal = (mealType, product) => {
    setMeals((prevMeals) => ({
      ...prevMeals,
      [mealType]: [...prevMeals[mealType], product],
    }));
    updateDailyNutrition(product);
  };

  const updateMeals = (mealType, curMeals) => {
    setMeals((prevMeals) => ({
        ...prevMeals,
        [mealType]: curMeals,
      }));
  };

  const addRecipeItem = (recipe) => {
    setRecipes((prevRecipes) => [...prevRecipes, recipe]);
  };

  const updateDailyNutrition = (product) => {
    const {
      'energy-kcal_100g': energyKcal100g,
      fat_100g,
      'saturated-fat_100g': saturatedFat100g,
      carbohydrates_100g,
      proteins_100g,
      sodium_100g,
      sugars_100g,
    } = product.nutriments || {};

    setDailyNutrition((prevNutrition) => ({
    calories: Math.max(0, prevNutrition.calories + (energyKcal100g ? Number(energyKcal100g) : 0)),
    fat: Math.max(0, prevNutrition.fat + (fat_100g ? Number(fat_100g) : 0)),
    saturatedFat: Math.max(0, prevNutrition.saturatedFat + (saturatedFat100g ? Number(saturatedFat100g) : 0)),
    carbohydrates: Math.max(0, prevNutrition.carbohydrates + (carbohydrates_100g ? Number(carbohydrates_100g) : 0)),
    proteins: Math.max(0, prevNutrition.proteins + (proteins_100g ? Number(proteins_100g) : 0)),
    sodium: Math.max(0, prevNutrition.sodium + (sodium_100g ? Number(sodium_100g) : 0)),
    sugars: Math.max(0, prevNutrition.sugars + (sugars_100g ? Number(sugars_100g) : 0)),
  }));
  };

  return (
    <MealsContext.Provider value={{ meals, recipes, dailyNutrition, addFoodToMeal, addRecipeItem, updateDailyNutrition, updateMeals }}>
      {children}
    </MealsContext.Provider>
  );
};
