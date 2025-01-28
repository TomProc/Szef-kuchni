import React, { useState } from "react";

const Ingredients = ({ handleNavigate, recipes, handleRecipeClick, fetchRecipes }) => {
  const [ingredients, setIngredients] = useState(""); // Pole do wpisania składników przez użytkownika
  const [filteredRecipes, setFilteredRecipes] = useState([]); // Przepisy, które można zrobić

  // Funkcja do wyszukiwania przepisów
  const handleSearchRecipes = () => {
    // Podziel składniki użytkownika i weź tylko pierwsze słowo każdego składnika
    const userIngredients = ingredients
      .split(",")
      .map((ingredient) => ingredient.trim().toLowerCase().split(" ")[0]); // Bierzemy tylko pierwsze słowo

    const matchingRecipes = recipes
      .map((recipe) => {
        // Podziel składniki przepisu i weź tylko pierwsze słowo każdego składnika
        const recipeIngredients = recipe.ingredients
          .split(";")
          .map((item) => item.trim().toLowerCase().split(" ")[0]);

        // Liczba dopasowań składników
        const matchCount = userIngredients.filter((ingredient) =>
          recipeIngredients.includes(ingredient)
        ).length;

        return { ...recipe, matchCount };
      })
      .filter((recipe) => recipe.matchCount > 0) // Filtrujemy tylko te przepisy, które mają dopasowania
      .sort((a, b) => b.matchCount - a.matchCount); // Sortujemy przepisy po liczbie dopasowań

    setFilteredRecipes(matchingRecipes); // Aktualizujemy listę przepisów
  };

  return (
    <div className="ingredients-container">
      <button className="back-button" onClick={() => handleNavigate("menu")}>
        Wróć do menu
      </button>
      <h1>Znajdź przepisy na podstawie składników</h1>
      <p>Wpisz składniki, oddzielając je przecinkami (np. "ryż, sól, woda"):</p>
      <input
        type="text"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="Wpisz składniki"
      />
      <button onClick={() => { fetchRecipes(); handleSearchRecipes(); }} className="search-button">
        Szukaj przepisów
      </button>

      <ul className="recipe-list">
        {filteredRecipes.map((recipe) => (
          <li key={recipe.id} className="recipe-card">
            <h2 onClick={() => handleRecipeClick(recipe)} className="recipe-title">
              {recipe.name}
            </h2>
            <p>Czas przygotowania: {recipe.time} minut</p>
            <p>Poziom trudności: {recipe.difficulty}</p>
            <p>Liczba dopasowanych składników: {recipe.matchCount}</p>
          </li>
        ))}
      </ul>

      {filteredRecipes.length === 0 && (
        <p>Nie znaleziono przepisów na podstawie podanych składników.</p>
      )}
    </div>
  );
};

export default Ingredients;
