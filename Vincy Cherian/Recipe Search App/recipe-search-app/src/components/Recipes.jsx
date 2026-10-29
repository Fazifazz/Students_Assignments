import useRecipes from '../hooks/useRecipes'
import RecipeCard from './RecipeCard';
import RecipeSearch from './RecipeSearch';

function Recipes(){
    
    const { data, loading, error } = useRecipes('/recipes');
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    // console.log(data.recipes)
    // console.log(loading)
    // console.log(error)
    return (
            <>
                <h2 id="featured_pdts">Recipe Collection</h2>

                <RecipeSearch />
                
                {/* <div className="container">
                    <div className="row g-4 featured-pdt-row">
                        {data.recipes.length? data.recipes.map(m => (<RecipeCard key={m.id} {...m} fList={0} />)) : <p text-align='center'>No recipes found</p>}
                    </div>
                </div>  */}
            </>   
    );   
}

export default Recipes