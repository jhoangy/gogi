export default async function handler(req, res) {
  const recipeKey = process.env.RECIPE;
  const recipeID = process.env.RECIPE;
  const {query} = req.query;
  if (!query) {
    return res.status(400).json({ error: "No recipe query provided" });
  }
  
  try {
    const apiUrl = await fetch(`https://api.edamam.com/search?q=${query}&app_id=${recipeID}&app_key=${recipeKey}`);
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch from Edamam API");
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    // Log error and return 500 status with error message
    console.error('Error fetching data from recipes api', error);
    res.status(500).json({ error: 'Error fetching data from recipes api' });
  }
}
