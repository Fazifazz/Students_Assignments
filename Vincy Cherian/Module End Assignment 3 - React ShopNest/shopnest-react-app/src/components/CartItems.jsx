import { useCart } from "../context/CartContext";


function CartItems({id,title, category, price, rating,image, quantity, tax}){

    const {addToCart, removeFromCart,decrQuantity, clearCart} = useCart();
    return(
        <>  <table className="table table-hover align-middle text-center" style={{"textAlign": "center"}}>
                {/* <td style={{ width: "" }}> */}
                <tbody>
                    <tr>
                        <td className="col-md-4">
                            <img src={image} width="200px" height="250px" />
                        </td>
                        <td className="col-md-4">
                            <h5 className="fw-semibold mb-2">{title}</h5> <div>${price}</div>
                            <button onClick={()=>decrQuantity({id, quantity})} className="btn btn-primary">-</button>
                            &nbsp;<span className="fw-semibold">{quantity}</span>  &nbsp;
                            <button onClick={()=>addToCart({id,title, category, price, rating,image, quantity})} className="btn btn-primary">+</button> 
                            <br/><br/>
                        </td> 
                        <td className="col-md-4">
                            <div> SubTotal : {(price * quantity).toFixed(2)} <br/>
                                TaxTotal : {tax.toFixed(2)} <br/>
                                Total Payable: { ((price * quantity) + tax).toFixed(2)}
                            </div>
                        </td>
                    <td className="col-md-4" style={{"paddingRight" : "70px"}}>
                            {/* <button onClick={()=>removeFromCart({id})} className="btn btn-outline-danger btn-sm bi bi-trash">
                            </button> */}

                             <button type="button" onClick={() => removeFromCart({ id })} className="btn btn-outline-danger btn-sm" aria-label={`Remove ${title} from cart`}  title="Remove item" >
                                 <i className="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table> 
            <hr/>
        </>
    )
}

export default CartItems