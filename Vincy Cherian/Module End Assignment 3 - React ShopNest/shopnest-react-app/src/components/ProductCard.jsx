import { useState, useEffect } from "react"
import useProducts from "../hooks/useProducts"

import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({id,title, category, price, rating,image,fList,onRemove})
{
 
   const {cartItems, addToCart, removeFromCart} = useCart();
    const navigate = useNavigate();
    const isAdded = cartItems.some(l=>l.id === id)
    
    //console.log(isAdded)

    return(
        <div className="col-12 col-sm-6 col-lg-3">
            <article className="card h-100" key={id}>
                
                <img src={image} className="card-img-top mx-auto feat-pdt-img" alt={title} onClick={()=> navigate(`/products/${id}`)} />
                
                <div className="card-body" >
                    {/* <h5 className="card-title">{name.substring(0,14)+"..."}</h5> */}
                     <h5 className="card-title">{title.substring(0,18)+"..."} &nbsp; </h5>
                                       {/* </h5>  //{ fList===0? */}
                     <div className="card-text">Rating : {rating.rate}/5</div>
                    <div className="card-text"> Category: {category} </div>
                    <div className="card-text">Original Price : <span className="text-decoration-line-through text-muted">$ {price+500}</span></div>
                    <div className="card-text"> Price : {price}</div>
                    <br/>
                    
                    { isAdded?
                      <button className="btn btn-primary disabled">ADDED</button> :
                      <button onClick={()=>addToCart({id,title, category, price, rating,image})} className="btn btn-primary">ADD TO CART</button> 
                    }      
                                
                 </div>
            </article>
        </div>
    )

}

export default ProductCard