import { useState } from "react";
import axios from "axios";

const RecipeForm = ({ onRecipeAdded }) => {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [time, setTime] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRecipe = { name, ingredients, time, difficulty: parseInt(difficulty) };
    try {
      await axios.post("http://127.0.0.1:5000/create_recipe", newRecipe);
      onRecipeAdded();
      setName("");
      setIngredients("");
      setTime("");
      setDifficulty("");
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <textarea
        placeholder="Ingredients"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="number"
        placeholder="Time (minutes)"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="border p-2 w-full mb-2"
      >
        <option value="">Select Difficulty</option>
        <option value="1">Easy</option>
        <option value="2">Medium</option>
        <option value="3">Hard</option>
        <option value="4">Very hard</option>
      </select>
      <button className="bg-blue-500 text-white p-2 rounded">Add Recipe</button>
    </form>
  );
};

export default RecipeForm;
