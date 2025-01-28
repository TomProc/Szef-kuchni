import React, { useState, useEffect } from "react";
import { getRecipes, toggleFavourite } from "./services/recipes";
import "./App.css";

// Komponent Menu
const Menu = ({ onNavigate }) => {
  return (
    <div className="menu-container">
      <h1 className="main-title">Szef Kuchni</h1>
      <div className="menu-options">
        <button onClick={() => onNavigate("recipes")}>Przepisy</button>
        <button onClick={() => onNavigate("ingredients")}>Podaj dostępne składniki</button>
      </div>
      <div className="menu-image">
        <img
          src="https://images.immediate.co.uk/production/volatile/sites/49/2023/10/img8WKO9d-d28e9f6.jpg?quality=90&crop=0px,0px,1199px,799px&resize=980,654"
          alt="Grafika Szef Kuchni"
        />
      </div>
    </div>
  );
};

// Pełnoekranowy widok szczegółów przepisu
const RecipeDetails = ({ recipe, handleClose }) => {
  return (
    <div className="recipe-details-overlay">
      <div className="recipe-details">
        <button className="close-button" onClick={handleClose}>X</button>
        <h2>{recipe.name}</h2>
        <p><strong>Czas przygotowania:</strong> {recipe.time} minut</p>
        <p><strong>Poziom trudności:</strong> {recipe.difficulty}</p>
        <p><strong>Składniki:</strong> {recipe.ingredients}</p>
        <p><strong>Sposób przygotowania:</strong> {recipe.preparation}</p>
      </div>
    </div>
  );
};

// Komponent Przepisy
const Recipes = ({
  filters,
  setFilters,
  recipes,
  handleFilterChange,
  handleSearchChange,
  handleToggleFavourite,
  handleRecipeClick,
  handleNavigate
}) => {
  return (
    <div className="recipes-container">
      <button onClick={() => handleNavigate("menu")} className="back-button">Menu</button>
      <h1>Przepisy kuchni</h1>

      {/* Formularz filtrów */}
      <div className="filters">
        <label>
          Wyszukaj nazwę przepisu:
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Wpisz nazwę przepisu"
          />
        </label>
        <label>
          Maksymalny czas przygotowania:
          <input
            type="number"
            name="timeMax"
            value={filters.timeMax || ""}
            onChange={handleFilterChange}
            placeholder="np. 30 minut"
          />
        </label>
        <label>
          Poziom trudności:
          <select name="difficulty" value={filters.difficulty || ""} onChange={handleFilterChange}>
            <option value="">Wszystkie</option>
            <option value="1">Łatwe</option>
            <option value="2">Średnie</option>
            <option value="3">Trudne</option>
          </select>
        </label>
        <label>
          Ulubione:
          <select name="favourite" value={filters.favourite || ""} onChange={handleFilterChange}>
            <option value="">Wszystkie</option>
            <option value="true">Tylko ulubione</option>
            <option value="false">Bez ulubionych</option>
          </select>
        </label>
        <label>
          Sortuj według:
          <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
            <option value="id">ID</option>
            <option value="time">Czas przygotowania</option>
            <option value="difficulty">Poziom trudności</option>
          </select>
        </label>
        <label>
          Kolejność:
          <select name="order" value={filters.order} onChange={handleFilterChange}>
            <option value="asc">Rosnąco</option>
            <option value="desc">Malejąco</option>
          </select>
        </label>
      </div>

      {/* Lista przepisów */}
      <ul className="recipe-list">
        {recipes
          .filter((recipe) =>
            recipe.name.toLowerCase().includes(filters.search.toLowerCase())
          )
          .map((recipe) => (
            <li key={recipe.id} className="recipe-card">
              <h2 onClick={() => handleRecipeClick(recipe)} className="recipe-title">
                {recipe.name}
              </h2>
              <p>Czas przygotowania: {recipe.time} minut</p>
              <p>Poziom trudności: {recipe.difficulty}</p>
              <button onClick={() => handleToggleFavourite(recipe.id, recipe.favourite)}>
                {recipe.favourite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filters, setFilters] = useState({
    timeMax: null,
    difficulty: null,
    favourite: null,
    sortBy: "id",
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
      {selectedRecipe && <RecipeDetails recipe={selectedRecipe} handleClose={handleCloseDetails} />}
      {currentView === "ingredients" && (
        <div>
          <h1>Podaj dostępne składniki</h1>
        </div>
      )}
    </div>
  );
};

export default App;
