import { useState, useEffect } from "react"
import RecipeCard from "./RecipeCard"


function Favourites(){
    const [list, setList] = useState(JSON.parse(localStorage.getItem('favList')) || [])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        try{
            setList(JSON.parse(localStorage.getItem('favList')) || [])
            //const currentWatchList = JSON.parse(localStorage.getItem('watchList')) || []
            //setList(currentWatchList.filter(m => m.genre === genre))
        }
        catch(err) {
           setError(<p>Error Status : {err.response.status} <br></br> Error Message : {err.response.message}</p>)
        }
        finally{
            setLoading(false)
        }
    },[])

    if(loading){
       return (
       <div className="text-center mt-5">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading recipes...</p>
        </div>)
    }

    function handleRecipeRemoved(updList){
        setList(updList)
    }

    return(
            <>
                <h2 id="featured_pdts">Favourite Recipe List</h2>
                <div className="container">
                    <div className="row g-4 featured-pdt-row">
                        { list.length?
                             list.map(w => (<RecipeCard key={w.id} {...w} wList={1} onRemove={handleRecipeRemoved}/>)) : 
                                <p>No recipes in Favourite List</p>
                                }
                        
                    </div>
                </div> 
                 <br />  <br />  <br />  <br />  <br />
            </>   
        )
}


export default Favourites