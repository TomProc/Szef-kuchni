import React from 'react';

const RecipeDetails = ({ recipe }) => {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-2xl font-bold">{recipe.name}</h2>
      <p><strong>Czas przygotowania:</strong> {recipe.time} minut</p>
      <p><strong>Poziom trudności:</strong> {["Easy", "Medium", "Hard"][recipe.difficulty - 1]}</p>
      <p><strong>Składniki:</strong> {recipe.ingredients}</p>
      <p><strong>Sposób przygotowania:</strong> {recipe.preparation}</p>
    </div>
  );
};

export default RecipeDetails;
