// Ingredients.jsx
import React, { useState } from "react";

const Ingredients = ({ recipes, handleNavigate }) => {
  const [userIngredients, setUserIngredients] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  // Funkcja obsługująca zmianę wprowadzenia składników przez użytkownika
  const handleIngredientsChange = (e) => {
    setUserIngredients(e.target.value);
  };

  // Funkcja wyszukiwania przepisów na podstawie dostępnych składników
  const handleSearchRecipes = () => {
    // Podziel składniki użytkownika na tablicę
    const ingredientsList = userIngredients
      .split(",") // Zakładamy, że składniki oddzielane są przecinkami
      .map((ingredient) => ingredient.trim().toLowerCase().split(" ")[0]); // Zignoruj ilość i jednostki, bierzemy tylko nazwę składnika

    // Przefiltruj i posortuj przepisy na podstawie liczby dopasowań składników
    const matchingRecipes = recipes
      .map((recipe) => {
        const recipeIngredients = recipe.ingredients
          .split(";") // Dzielimy składniki przepisu po średniku
          .map((ingredient) => ingredient.trim().toLowerCase().split(" ")[0]); // Bierzemy tylko pierwszy wyraz z każdego składnika

        // Liczymy liczbę dopasowań składników
        const matchCount = ingredientsList.reduce((count, ingredient) => {
          return recipeIngredients.includes(ingredient) ? count + 1 : count;
        }, 0);

        return { ...recipe, matchCount }; // Dodajemy liczbę dopasowań do każdego przepisu
      })
      .filter((recipe) => recipe.matchCount > 0) // Uwzględniamy tylko przepisy z przynajmniej jednym dopasowaniem
      .sort((a, b) => b.matchCount - a.matchCount); // Sortujemy malejąco według liczby dopasowań

    // Zapisujemy przefiltrowane i posortowane przepisy
    setFilteredRecipes(matchingRecipes);
  };

  return (
    <div>
      <h1>Podaj dostępne składniki</h1>
      <input
        type="text"
        value={userIngredients}
        onChange={handleIngredientsChange}
        placeholder="Wpisz składniki (np. chleb, ser, masło)"
      />
      <button onClick={handleSearchRecipes}>Szukaj przepisów</button>

      {/* Wyświetlanie przepisów, które pasują do składników */}
      <div>
        {filteredRecipes.length > 0 ? (
          <ul>
            {filteredRecipes.map((recipe) => (
              <li key={recipe.id}>
                <h2>{recipe.name}</h2>
                <p>{recipe.ingredients}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Brak przepisów pasujących do tych składników.</p>
        )}
      </div>

      <button onClick={() => handleNavigate("menu")}>Powrót do menu</button>
    </div>
  );
};

export default Ingredients;
