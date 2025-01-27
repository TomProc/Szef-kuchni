import axios from "axios";

const FavouriteToggle = ({ id, favourite, fetchRecipes }) => {
  const toggleFavourite = async () => {
    try {
      await axios.patch(`http://127.0.0.1:5000/add_to_favourites/${id}`, {
        favourite: !favourite,
      });
      fetchRecipes();
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
  };

  return (
    <button
      onClick={toggleFavourite}
      className={`p-2 rounded ${favourite ? "bg-yellow-500" : "bg-gray-300"}`}
    >
      {favourite ? "Unfavourite" : "Favourite"}
    </button>
  );
};

export default FavouriteToggle;
