import { useCart } from '../context/CartContext';
import useProducts from '../hooks/useProducts'
import { useParams } from "react-router-dom";

function ProductDetails(){
   
    const { id } = useParams();  
    const {cartItems, addToCart} = useCart();   

    const isAdded = cartItems.some(i=>i.id === Number(id));

    const { data, loading, error } = useProducts(`/products/${id}`);
    if (loading) return <p>Loading Products...</p>;
    if (error) return <p>{error}</p>;
    // console.log(data.recipes)
    // console.log(loading)
    // console.log(error)

    if(!data) 
        return(<><p textAlign='center'>Product details not found</p></>) 
    else
        return (
                <>
                    <h2 id="featured_pdts">{data.title}</h2>
                   
                    <div className="productDetails">
                        <img src={data.image} className="imgInDetail" alt={data.title} /> <br/><br/><br/>
                        <div className="card-text"> <b>Product Name:</b> {data.title} </div>
                        <div className="card-text"> <b>Rating:</b> {data.rating.rate}/5 </div>
                        <div className="card-text"> <b>Category :</b> {data.category}</div>
                        <div className="card-text"><b>Original Price :</b> <span class="text-decoration-line-through text-muted">$ {data.price+500}</span></div>
                        <div className="card-text"> <b>Price :</b> ${data.price}</div> <br/>
                        <div className="card-text"> <b>Tax :</b> ${data.price * 3/100}</div> <br/>
                        <div className="card-text" stle={{"text-align":"justify"}}><b>Description :</b> {data.description} <br/>
                            {/* <ul>
                                {data.instructions.length? data.instructions.map(line => <li>{line}</li>) : <li>Not Found</li>}
                            </ul> */}
                        </div>
                        <br/><br/>
                        {
                            isAdded ? 
                            <button className="btn btn-primary disabled">ADDED</button> :
                            <button onClick={()=>addToCart({...data,tax: data.price*3/100, id:Number(id)})} className="btn btn-primary">ADD TO CART</button> 
                        }
                         
                        <br/><br/>
                        <h5><b>Happy Shopping!</b> </h5>
                    </div> 
                </>   
        );  
}


export default ProductDetails