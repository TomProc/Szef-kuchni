import React, { useState, useEffect } from "react";
import { getRecipes, toggleFavourite } from "./services/recipes";
import Menu from "./components/Menu";
import Recipes from "./components/Recipes";
import RecipeDetails from "./components/RecipeDetails";
import Ingredients from "./components/Ingredients";
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

  useEffect(() => {
    if (currentView === "recipes") {
      getRecipes(filters).then(setRecipes); // Pobieramy przepisy z filtrami
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
    getRecipes(filters).then(setRecipes);
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseDetails = () => {
    setSelectedRecipe(null);
  };

  const handleNavigate = (view) => {
    setCurrentView(view); // Zmieniamy widok w zależności od wyboru
  };

  return (
    <div>
      {/* Widok Menu */}
      {currentView === "menu" && <Menu onNavigate={handleNavigate} />}

      {/* Widok Przepisy */}
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

      {/* Szczegóły przepisu */}
      {selectedRecipe && <RecipeDetails recipe={selectedRecipe} handleClose={handleCloseDetails} />}

      {/* Widok Podaj dostępne składniki */}
      {currentView === "ingredients" && (
        <Ingredients recipes={recipes} handleNavigate={handleNavigate} />
      )}
    </div>
  );
};

export default App;
