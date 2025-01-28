// src/components/Ingredients.jsx
// Komponent wyświetlający formularz do wprowadzania składników
import React, { useState } from "react";

// Komponent do wprowadzania składników przez użytkownika i filtrowania przepisów
const Ingredients = ({ recipes, handleNavigate }) => {
  const [ingredients, setIngredients] = useState("");
  const [matchingRecipes, setMatchingRecipes] = useState([]);

  const handleInputChange = (e) => {
    setIngredients(e.target.value);
  };

  const handleFindRecipes = () => {
    const userIngredients = ingredients
      .split(",")
      .map((ingredient) => ingredient.trim().toLowerCase());

    const filteredRecipes = recipes.filter((recipe) =>
      recipe.ingredients
        .split(",")
        .map((ingredient) => ingredient.trim().toLowerCase())
        .some((ingredient) => userIngredients.includes(ingredient))
    );

    setMatchingRecipes(filteredRecipes);
  };

  return (
    <div>
      <button onClick={() => handleNavigate("menu")} className="back-button">Menu</button>
      <h1>Podaj dostępne składniki</h1>
      <input
        type="text"
        value={ingredients}
        onChange={handleInputChange}
        placeholder="Wpisz składniki (np. chleb, ser, szynka)"
      />
      <button onClick={handleFindRecipes}>Znajdź przepisy</button>

      <h2>Pasujące przepisy:</h2>
      <ul>
        {matchingRecipes.length > 0 ? (
          matchingRecipes.map((recipe) => (
            <li key={recipe.id}>
              <h3>{recipe.name}</h3>
              <p>{recipe.ingredients}</p>
            </li>
          ))
        ) : (
          <p>Brak przepisów pasujących do tych składników.</p>
        )}
      </ul>
    </div>
  );
};

export default Ingredients;
