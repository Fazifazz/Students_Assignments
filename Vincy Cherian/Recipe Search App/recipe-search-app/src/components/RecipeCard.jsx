import { useState, useEffect } from "react"
import useRecipes from "../hooks/useRecipes"
import RecipeDetails from "./RecipeDetails"
import { useNavigate } from "react-router-dom";

function RecipeCard({id,name, ingredients, prepTimeMinutes, cookTimeMinutes,difficulty,cuisine,image,fList,onRemove})
{
    const [wtList, setWtList] = useState(JSON.parse(localStorage.getItem('favList'))|| [])

    const isAdded = wtList.some(l=>l.id === id)
    const navigate = useNavigate();
    
    function handleAddToggleFavList({id,name, ingredients, prepTimeMinutes, cookTimeMinutes,difficulty,cuisine,image})
    {
        const currentFavList = JSON.parse(localStorage.getItem('favList')) || []   

        //  if (currentFavList.some(recipe => recipe.id === id)) {
        //     // Already in favourites → remove it
        //     updatedFavList = currentFavList.filter(recipe => recipe.id !== id);
        // } 
        // else {
        const updFavList = [ ...currentFavList,{id,name, ingredients, prepTimeMinutes, cookTimeMinutes,difficulty,cuisine,image}]
        localStorage.setItem('favList', JSON.stringify(updFavList))
        setWtList(updFavList)
    
    }

     function handleRemoveFavList(fid){
        const currentFavList = JSON.parse(localStorage.getItem('favList')) || []
        const updFavList = currentFavList.filter(fL => (fL.id !== id))
        setWtList(updFavList)
        localStorage.setItem('favList', JSON.stringify(updFavList))
        if (onRemove) {
            onRemove(updFavList)
        }
    }

    return(
        <div className="col-12 col-sm-6 col-lg-3">
            <article className="card h-100" key={id}>
                
                    <img src={image} className="card-img-top mx-auto feat-pdt-img" alt={name} />
                
                <div className="card-body">
                    {/* <h5 className="card-title">{name.substring(0,14)+"..."}</h5> */}
                     <h5 className="card-title">{name.substring(0,18)+"..."} &nbsp;
                                         { fList===0?
                    (
                       isAdded?
                       <button onClick={()=>handleRemoveFavList({id})} className="btn btn-primary"> <span id="watchList-icon" className="bi bi-heart-fill"></span> </button> : 
                        // <button onClick={()=>handleRemoveFavList({id,name, ingredients, prepTimeMinutes, cookTimeMinutes,difficulty,cuisine,image})} className="btn btn-primary"> <span id="watchList-icon" className="bi bi-heart-fill"></span> </button> : 
                        <button onClick={()=>handleAddToggleFavList({id,name, ingredients, prepTimeMinutes, cookTimeMinutes,difficulty,cuisine,image})} className="btn btn-primary"> <span id="watchList-icon" className="bi bi-heart"></span></button>
                    ): <button onClick={()=>handleRemoveFavList({id})} className="btn btn-primary"><span id="watchList-icon" className="bi bi-heart-fill"></span></button>} </h5>
                    <div className="card-text"> Cuisine: {cuisine} </div>
                    <div className="card-text">Difficulty : {difficulty}</div>
                    <div className="card-text">Preparation Time : {prepTimeMinutes}</div>
                    <div className="card-text">Cooking Time : {cookTimeMinutes}</div>
                    <br/>
                    {/* <div className="card-text"> Ingredients : {ingredients}</div><br></br> */}
                    {/* { fList===0?
                    (
                       isAdded?
                        <button onClick={()=>handleAddFavList({id,name, ingredients, prepTimeMinutes, cookTimeMinutes,difficulty,cuisine,image})} className="btn btn-primary" disabled> <span id="watchList-icon" class="bi bi-heart-fill"></span> </button> : 
                        <button onClick={()=>handleAddFavList({id,name, ingredients, prepTimeMinutes, cookTimeMinutes,difficulty,cuisine,image})} className="btn btn-primary"> <span id="watchList-icon" class="bi bi-heart"></span></button>
                    ): <button onClick={()=>handleRemoveFavList({id})} className="btn btn-primary">REMOVE</button>} */}

                    <button onClick={()=> navigate(`/recipes/${id}`)} className="btn btn-primary">VIEW DETAILS</button>
                </div>
            </article>
        </div>
    )

}

export default RecipeCard