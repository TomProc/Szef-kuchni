import React from 'react';
import FavouriteToggle from "./FavouriteToggle";

const RecipeList = ({ recipes, fetchRecipes, setSelectedRecipe }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="p-4 border rounded shadow">
          <h2 
            className="text-xl font-bold cursor-pointer" 
            onClick={() => setSelectedRecipe(recipe)} // Ustawienie przepisu w stanie
          >
            {recipe.name}
          </h2>
          <p>Ingredients: {recipe.ingredients}</p>
          <p>Time: {recipe.time} minutes</p>
          <p>Difficulty: {["Easy", "Medium", "Hard","Very hard"][recipe.difficulty - 1]}</p>
          <FavouriteToggle
            id={recipe.id}
            favourite={recipe.favourite}
            fetchRecipes={fetchRecipes}
          />
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
