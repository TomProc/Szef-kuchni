import { useState } from "react";
import axios from "axios";

const RecipeSearch = ({ setRecipes }) => {
  const [ingredients, setIngredients] = useState("");

  const searchRecipes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/search_recipes", {
        params: { ingredients: ingredients.split(",") },
      });
      setRecipes(response.data.recipes);
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Ingredients (comma-separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        className="border p-2 w-full"
      />
      <button
        onClick={searchRecipes}
        className="bg-green-500 text-white p-2 mt-2 rounded"
      >
        Search
      </button>
    </div>
  );
};

export default RecipeSearch;
