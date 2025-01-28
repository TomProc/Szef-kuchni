// src/components/RecipeDetails.jsx
// Komponent odpowiedzialny za wyświetlanie szczegółów wybranego przepisu
import React from "react";

// Komponent, który pokazuje szczegóły wybranego przepisu: nazwę, czas, składniki, sposób przygotowania
const RecipeDetails = ({ recipe, handleClose }) => {
  return (
    <div className="recipe-details-overlay">
      <div className="recipe-details">
        {/* Przycisk do zamknięcia szczegółów przepisu */}
        <button className="close-button" onClick={handleClose}>X</button>
        {/* Wyświetlanie szczegółów przepisu */}
        <h2>{recipe.name}</h2>
        <p><strong>Czas przygotowania:</strong> {recipe.time} minut</p>
        <p><strong>Poziom trudności:</strong> {recipe.difficulty}</p>
        <p><strong>Składniki:</strong> {recipe.ingredients}</p>
        <p><strong>Sposób przygotowania:</strong> {recipe.preparation}</p>
      </div>
    </div>
  );
};

export default RecipeDetails;
