import React, { useState } from "react";
import CookingSteps from "./CookingSteps";

const RecipeDetails = ({ recipe, handleClose }) => {
  const [showCookingSteps, setShowCookingSteps] = useState(false);

  if (!recipe) return null;

  const steps = recipe.preparation.split(",");

  // Funkcja do eksportu PDF
  const handleExportPDF = async (recipeId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/export_recipe/${recipeId}`);

      if (!response.ok) {
        throw new Error("Błąd podczas pobierania pliku PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Tworzenie i kliknięcie w ukryty element <a> w celu pobrania pliku
      const a = document.createElement("a");
      a.href = url;
      a.download = `przepis_${recipe.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Błąd pobierania PDF:", error);
    }
  };

  return (
    <div className="recipe-details-overlay">
      <div className="recipe-details">
        {/* Przycisk zamykania okna */}
        <button className="close-button" onClick={handleClose}>X</button>
        <h2>{recipe.name}</h2>
        <p><strong>Czas przygotowania:</strong> {recipe.time} minut</p>
        <p><strong>Poziom trudności:</strong> {recipe.difficulty}</p>
        <p><strong>Składniki:</strong> {recipe.ingredients}</p>
        <p><strong>Sposób przygotowania:</strong> {recipe.preparation}</p>

        {/* Przyciski: gotowanie i eksport PDF */}
        <div className="button-container">
          <button className="start-cooking-button" onClick={() => setShowCookingSteps(true)}>
            Zacznij gotowanie
          </button>

          <button className="export-pdf-button" onClick={() => handleExportPDF(recipe.id)}>
            Pobierz PDF
          </button>
        </div>
      </div>

      {showCookingSteps && <CookingSteps steps={steps} onClose={() => setShowCookingSteps(false)} />}
    </div>
  );
};

export default RecipeDetails;