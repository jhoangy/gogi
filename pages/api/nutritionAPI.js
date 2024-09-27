export default async function handler(req, res) {

   // Check if the request method is POST
   if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const nutritionKey = process.env.NUTRITION;
  const nutritionID = process.env.NUTRITION_ID;
  const { ingredients } = req.query;

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ error: 'No ingredients provided' });
  }

  try {
    console.log("Ingredients: api", ingredients);
    const response = await fetch(
        `https://api.edamam.com/api/nutrition-details?app_id=${nutritionID}&app_key=${nutritionKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ingr: ingredients }),
        }
      );
    
    const data = await response.json();

    if (!response.ok) {
        return res.status(response.status).json({ error: data });
      }

    res.status(200).json(data);
  } catch (error) {
    // Log error and return 500 status with error message
    console.error('Error fetching data from nutrition api:', error);
    res.status(500).json({ error: 'Error fetching data from nutrition api' });
  }
}
