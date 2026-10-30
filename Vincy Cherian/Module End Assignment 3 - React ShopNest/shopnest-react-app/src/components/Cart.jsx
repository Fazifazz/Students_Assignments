import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItems from "./CartItems";

function Cart()
{
    const {cartItems, cartCount,cartTotal,cartTaxTotal,addToCart, removeFromCart,decrQuantity,clearCart} = useCart();
     const navigate = useNavigate();
    
    return (
        <>
        <div className="cartClass">
            <h4 id="featured_pdts">SHOPPING CART</h4><br/>
            <table>
                <tbody>
                    <tr>
                        <td className="col-md-4"></td>
                        <td className="col-md-4 col-sm-12">TOTAL ITEMS : {cartCount}<br/>
                        TOTAL TAX Incl.: $ {cartTaxTotal.toFixed(2)} <br/>
                        TOTAL AMOUNT(Incl. tax) : $ {cartTotal.toFixed(2)}</td>
                        <td className="col-md-4 col-sm-12">
                            <button onClick={()=>clearCart()} className="btn btn-primary">CLEAR CART</button>
                        </td>
                        <td className="col-md-4"></td>
                    </tr>
                </tbody>
            </table>
            <hr/>

            
            { cartItems.length>0? cartItems.map(i => <CartItems key={i.id} {...i} />) : <> <h5>Your cart is empty</h5><br/><br/> 
             </> }

            { cartItems.length>0? <> <br/><br/> <button className="btn btn-primary" >CheckOut</button> &nbsp; &nbsp;
            <button className="btn btn-primary" onClick={()=> navigate("/products")}>Continue Shopping</button></> :
            <button className="btn btn-primary" onClick={()=> navigate("/products")}>Start Shopping</button>
            }

       </div>
        </>
    )
}

export default Cart