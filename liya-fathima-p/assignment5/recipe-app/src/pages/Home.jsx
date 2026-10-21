import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Welcome to RecipeApp 🍽️</h1>
      <p>Search thousands of recipes and save your favourites.</p>
      <Link to="/recipes">Start searching →</Link>
    </div>
  );
}

export default Home;