// App.jsx
import React, { useState, useEffect } from "react";
import { getRecipes, toggleFavourite } from "./services/recipes";
import "./App.css";
import Ingredients from "./components/Ingredients";
import Recipes from "./components/Recipes";
import Menu from "./components/Menu";
import RecipeDetails from "./components/RecipeDetails";

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
      getRecipes(filters).then(setRecipes);
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
    setCurrentView(view);
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
      {selectedRecipe && (
        <RecipeDetails recipe={selectedRecipe} handleClose={handleCloseDetails} />
      )}
      {currentView === "ingredients" && (
        <Ingredients
          recipes={recipes}
          handleNavigate={handleNavigate}
        />
      )}
    </div>
  );
};

export default App;
