import { createContext, useContext, useEffect, useReducer } from "react";
import { CART_ACTIONS, cartInitialState, cartReducer } from "../reducers/CartReducers";

//Create the context
const cartContext = createContext(null);

// Create the Provider
export function CartProvider({children}){

    const [state, dispatch] = useReducer(cartReducer, cartInitialState, 
        ()=> {
            const savedCart = localStorage.getItem('savedCart')

           return savedCart? {items : JSON.parse(savedCart)}: cartInitialState
        }
    );

    const cartCount = state.items.reduce((sum,item) => sum + item.quantity,0)
    const cartTaxTotal = state.items.reduce((sum,item) => sum + item.tax * item.quantity,0)
    const cartTotal = state.items.reduce((sum,item) => sum + item.price * item.quantity, 0) + cartTaxTotal

    useEffect(()=>{

        localStorage.setItem('savedCart', JSON.stringify(state.items))

    }, [state.items])



    function addToCart(product)
    {
        dispatch({
            type: CART_ACTIONS.ADD_ITEM,
            payload : product
        })

    }

    function removeFromCart(product)
    {
        dispatch({
            type: CART_ACTIONS.REMOVE_ITEM,
            payload : product
        })
    }

    function decrQuantity(product)
    {
        dispatch({
            type: CART_ACTIONS.DECREASE_QUANTITY,
            payload : product
        })
    }

    function clearCart()
    {
        dispatch({
            type: CART_ACTIONS.CLEAR_CART
        })
    }


    return(
        <cartContext.Provider
                value={{
                    cartItems : state.items,
                    cartCount,
                    cartTotal,
                    cartTaxTotal,
                    addToCart,
                    removeFromCart,
                    decrQuantity,
                    clearCart
                }} >
                    {children}
                </cartContext.Provider>

    );
}

// custom hook for accessing the context

export function useCart(){
    const context = useContext(cartContext)

    if(context===null){
        throw new Error("useCart must be used inside CartProvider")
    }

    return context;
}

