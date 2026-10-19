Assignment: Build a multi-page recipe search application using React
Router, custom hooks, and Axios.

Requirements:

● Set up React Router DOM with four pages: Home, Recipes, Recipe Detail
(/recipes/:id), and Favourites — add a Navbar with Link-based navigation
and active link highlighting.
● Create a custom hook useRecipes(query) that fetches recipes from a
public API (such as TheMealDB) using Axios — return { data, loading,
error } from the hook.
● Build a search form on the Recipes page using controlled inputs
(useState) — on submit, call useRecipes with the query and display the
results as recipe cards.
● Show a loading spinner while the hook is fetching and an error message
if the API call fails.
● Navigate to Recipe Detail on card click — use useParams to read the
recipe ID and fetch and display the full recipe details on that page.
● Add a 'Save to Favourites' button on each recipe card — manage the
favourites list in state and display it on the Favourites page.
● Favourites page must be usable across navigation — persist the list
using useState lifted to App or a shared context.
