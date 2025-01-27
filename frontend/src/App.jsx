import React, { useState, useEffect } from "react";
import { getRecipes, toggleFavourite } from "./services/recipes";

// Komponent Menu
const Menu = ({ onNavigate }) => {
    return (
        <div>
            <h1>Wybierz opcję</h1>
            <button onClick={() => onNavigate("recipes")}>Przepisy</button>
            <button onClick={() => onNavigate("ingredients")}>Podaj dostępne składniki</button>
        </div>
    );
};

// Komponent Przepisy
const Recipes = ({ filters, setFilters, recipes, handleFilterChange, handleSearchChange, handleToggleFavourite, handleRecipeClick, selectedRecipe, handleCloseDetails, handleNavigate }) => {
    return (
        <div>
            <button onClick={() => handleNavigate("menu")}>Menu</button> {/* Przycisk do menu */}
            <h1>Przepisy kuchni</h1>

            {/* Formularz filtrów */}
            <div>
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
                    <select
                        name="difficulty"
                        value={filters.difficulty || ""}
                        onChange={handleFilterChange}
                    >
                        <option value="">Wszystkie</option>
                        <option value="1">Łatwe</option>
                        <option value="2">Średnie</option>
                        <option value="3">Trudne</option>
                    </select>
                </label>
                <label>
                    Ulubione:
                    <select
                        name="favourite"
                        value={filters.favourite || ""}
                        onChange={handleFilterChange}
                    >
                        <option value="">Wszystkie</option>
                        <option value="true">Tylko ulubione</option>
                        <option value="false">Bez ulubionych</option>
                    </select>
                </label>
                <label>
                    Sortuj według:
                    <select
                        name="sortBy"
                        value={filters.sortBy}
                        onChange={handleFilterChange}
                    >
                        <option value="id">ID</option>
                        <option value="time">Czas przygotowania</option>
                        <option value="difficulty">Poziom trudności</option>
                    </select>
                </label>
                <label>
                    Kolejność:
                    <select
                        name="order"
                        value={filters.order}
                        onChange={handleFilterChange}
                    >
                        <option value="asc">Rosnąco</option>
                        <option value="desc">Malejąco</option>
                    </select>
                </label>
            </div>

            {/* Lista przepisów */}
            <ul>
                {recipes
                    .filter((recipe) =>
                        recipe.name.toLowerCase().includes(filters.search.toLowerCase())
                    ) // Filtrujemy przepisy po nazwie
                    .map((recipe) => (
                        <li key={recipe.id}>
                            <h2
                                onClick={() => handleRecipeClick(recipe)} // Kliknięcie w przepis
                                style={{ cursor: "pointer", color: "blue" }}
                            >
                                {recipe.name}
                            </h2>
                            <p>Czas przygotowania: {recipe.time} minut</p>
                            <p>Poziom trudności: {recipe.difficulty}</p>
                            <p>Ulubiony: {recipe.favourite ? "Tak" : "Nie"}</p>
                            <button
                                onClick={() =>
                                    handleToggleFavourite(recipe.id, recipe.favourite)
                                }
                            >
                                {recipe.favourite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                            </button>
                        </li>
                    ))}
            </ul>

            {/* Szczegóły przepisu */}
            {selectedRecipe && (
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        padding: "20px",
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        zIndex: 10,
                        width: "300px",
                    }}
                >
                    <h2>{selectedRecipe.name}</h2>
                    <p>Czas przygotowania: {selectedRecipe.time} minut</p>
                    <p>Poziom trudności: {selectedRecipe.difficulty}</p>
                    <p><strong>Składniki:</strong> {selectedRecipe.ingredients}</p>
                    <p><strong>Sposób przygotowania:</strong> {selectedRecipe.preparation}</p>
                    <button onClick={handleCloseDetails}>Zamknij</button>
                </div>
            )}
        </div>
    );
};

const App = () => {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null); // Stan do przechowywania szczegółów przepisu
    const [filters, setFilters] = useState({
        timeMax: null,
        difficulty: null,
        favourite: null,
        sortBy: "id",
        order: "asc",
        search: "", // Stan do przechowywania tekstu wyszukiwania
    });
    const [currentView, setCurrentView] = useState("menu"); // Stan do zarządzania aktualnym widokiem

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
            search: e.target.value, // Zmieniamy wartość wyszukiwania
        }));
    };

    const handleToggleFavourite = async (id, currentFavourite) => {
        const newFavouriteStatus = !currentFavourite;
        await toggleFavourite(id, newFavouriteStatus);
        getRecipes(filters).then(setRecipes);
    };

    const handleRecipeClick = (recipe) => {
        setSelectedRecipe(recipe); // Ustawiamy wybrany przepis
    };

    const handleCloseDetails = () => {
        setSelectedRecipe(null); // Zamknięcie szczegółów
    };

    const handleNavigate = (view) => {
        setCurrentView(view); // Przechodzimy do wybranej karty
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
                    selectedRecipe={selectedRecipe}
                    handleCloseDetails={handleCloseDetails}
                    handleNavigate={handleNavigate}
                />
            )}
            {currentView === "ingredients" && (
                <div>
                    <h1>Podaj dostępne składniki</h1>
                    {/* Tutaj można dodać funkcję do obsługi składników */}
                </div>
            )}
        </div>
    );
};

export default App;
