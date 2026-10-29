import useRecipes from '../hooks/useRecipes'
import { useParams } from "react-router-dom";

function RecipeDetails(url){

    const { id } = useParams();       
//     const navigate = useNavigate();
//     const [recipe, setRecipe] = useState(null);

//     useEffect(() => {
//         async function fetchProduct() {
//                 try {
//                     const res = await api.get(`/products/${id}`);
//                     setProduct(res.data);
//                     } catch (err) {
//                 if (err.response?.status === 404) navigate('/not-found', { replace: true });
//                 }
//             }
//             fetchProduct();
//         }, [id]); // re-fetch when id changes -- user navigates between products
    
//    return <div><h2>{product?.title}</h2></div>

    const { data, loading, error } = useRecipes(`/recipes/${id}`);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    // console.log(data.recipes)
    // console.log(loading)
    // console.log(error)

    if(data.length===0) 
        return(<><p text-align='center'>Recipe details not found</p></>) 
    else
        return (
                <>
                    <h2 id="featured_pdts">Recipe of {data.name}</h2>
                    
                    <div className="recipeDetails">
                        <img src={data.image} className="imgInDetail" alt={data.name} /> <br/><br/><br/>
                        <div className="card-text"> <b>Name:</b> {data.name} </div>
                        <div className="card-text"> <b>Cuisine:</b> {data.cuisine} </div>
                        <div className="card-text"> <b>Difficulty :</b> {data.difficulty}</div>
                        <div className="card-text"><b>Preparation Time :</b> {data.prepTimeMinutes}</div>
                        <div className="card-text"> <b>Cooking Time :</b> {data.cookTimeMinutes}</div> <br/>
                        <div className="card-text"><b>Instructions :</b> <br/>
                            <ul>
                                {data.instructions.length? data.instructions.map(line => <li>{line}</li>) : <li>Not Found</li>}
                            </ul>
                        </div>
                        <br/>
                        <h5><b>Go Ahead! Prepare and Enjoy!</b> </h5>
                    </div> 
                </>   
        );  
}


export default RecipeDetails