// src/components/Recipes.jsx
// Komponent wyświetlający listę przepisów z filtrami i sortowaniem
const Recipes = ({
    filters,
    setFilters,
    recipes,
    handleFilterChange,
    handleSearchChange,
    handleToggleFavourite,
    handleRecipeClick,
    handleNavigate,
  }) => {
    const handleResetFilters = () => {
      setFilters({
        timeMax: null,
        difficulty: null,
        favourite: null,
        sortBy: "name",
        order: "asc",
        search: "",
      });
    };
  
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
              <option value="1">Bardzo Łatwe</option>
              <option value="2">Łatwe</option>
              <option value="3">Średnie</option>
              <option value="4">Trudne</option>
              <option value="5">Bardzo trudne</option>
            </select>
          </label>
          <label>
            Ulubione:
            <select name="favourite" value={filters.favourite || ""} onChange={handleFilterChange}>
              <option value="">Wszystkie</option>
              <option value="true">Tylko ulubione</option>
            </select>
          </label>
          <label>
            Sortuj według:
            <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
              <option value="name">Nazwa</option>
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
  
          <button onClick={handleResetFilters} className="reset-button">
            Resetuj filtry
          </button>
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
  
  export default Recipes;
  