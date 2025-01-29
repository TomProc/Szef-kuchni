import React, { useState } from "react";
import CookingSteps from "./CookingSteps";

const RecipeDetails = ({ recipe, handleClose }) => {
  const [showCookingSteps, setShowCookingSteps] = useState(false);

  const steps = recipe.preparation.split(",");

  return (
    <div className="recipe-details-overlay">
      <div className="recipe-details">
        <button className="close-button" onClick={handleClose}>X</button>
        <h2>{recipe.name}</h2>
        <p><strong>Czas przygotowania:</strong> {recipe.time} minut</p>
        <p><strong>Poziom trudności:</strong> {recipe.difficulty}</p>
        <p><strong>Składniki:</strong> {recipe.ingredients}</p>
        <p><strong>Sposób przygotowania:</strong> {recipe.preparation}</p>

        <button onClick={() => setShowCookingSteps(true)}>Zacznij gotowanie</button>
      </div>

      {showCookingSteps && <CookingSteps steps={steps} onClose={() => setShowCookingSteps(false)} />}
    </div>
  );
};

export default RecipeDetails;
