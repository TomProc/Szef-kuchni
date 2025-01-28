import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000"; // Adres Twojego backendu

// Pobierz przepisy z API
export const getRecipes = async (filters = {}) => {
    try {
        const params = {
            sort_by: filters.sortBy || "name",
            order: filters.order || "asc",
            time_max: filters.timeMax,
            difficulty: filters.difficulty,
            favourite: filters.favourite,
        };

        const response = await axios.get(`${BASE_URL}/get_recipes`, { params });
        return response.data.recipes;
    } catch (error) {
        console.error("Error fetching recipes:", error);
        return [];
    }
};

// Oznacz przepis jako ulubiony
export const toggleFavourite = async (id, favourite) => {
    try {
        await axios.patch(`${BASE_URL}/add_to_favourites/${id}`, {
            favourite,
        });
    } catch (error) {
        console.error("Error updating favourite status:", error);
    }
};
