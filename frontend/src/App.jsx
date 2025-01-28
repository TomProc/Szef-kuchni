import React, { useState, useEffect } from "react";
import { getRecipes, toggleFavourite } from "./services/recipes";
import Menu from "./components/Menu";
import Recipes from "./components/Recipes";
import RecipeDetails from "./components/RecipeDetails";
import Ingredients from "./components/Ingredients"; // Używamy poprawnej nazwy komponentu
import "./App.css";

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filters, setFilters] = useState({
    timeMax: null,
    difficulty: null,
    favourite: null,
    sortBy: "name",
    order: "asc",
    search: "",
  });
  const [currentView, setCurrentView] = useState("menu");

  // Funkcja pobierania przepisów
  const fetchRecipes = () => {
    getRecipes(filters).then(setRecipes);
  };

  useEffect(() => {
    if (currentView === "recipes") {
      fetchRecipes(); // Pobieramy przepisy tylko w widoku "recipes"
    }
  }, [filters, currentView]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
    }));
  };

  const handleToggleFavourite = async (id, currentFavourite) => {
    const newFavouriteStatus = !currentFavourite;
    await toggleFavourite(id, newFavouriteStatus);
    fetchRecipes(); // Pobieramy przepisy po zmianie statusu
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe); // Wyświetlenie szczegółów przepisu
  };

  const handleCloseDetails = () => {
    setSelectedRecipe(null);
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
    if (view === "ingredients") {
      // Jeśli wchodzimy na Ingredients, to pobieramy przepisy tylko raz
      fetchRecipes();
    }
  };

  return (
    <div>
      {currentView === "menu" && <Menu onNavigate={handleNavigate} />}
      {currentView === "recipes" && (
        <Recipes
          filters={filters}
          setFilters={setFilters}
          recipes={recipes}
          handleFilterChange={handleFilterChange}
          handleSearchChange={handleSearchChange}
          handleToggleFavourite={handleToggleFavourite}
          handleRecipeClick={handleRecipeClick}
          handleNavigate={handleNavigate}
        />
      )}
      {selectedRecipe && <RecipeDetails recipe={selectedRecipe} handleClose={handleCloseDetails} />}
      {currentView === "ingredients" && (
        <Ingredients
          handleNavigate={handleNavigate}
          recipes={recipes}
          handleRecipeClick={handleRecipeClick}
          fetchRecipes={fetchRecipes} // Przekazujemy fetchRecipes do Ingredients
        />
      )}
    </div>
  );
};

export default App;
