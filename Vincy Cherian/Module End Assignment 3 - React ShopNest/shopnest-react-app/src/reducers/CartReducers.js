
export const cartInitialState= {items : [] }

export const CART_ACTIONS = {
ADD_ITEM: 'ADD_ITEM',
REMOVE_ITEM: 'REMOVE_ITEM',
DECREASE_QUANTITY: 'DECREASE_QUANTITY',
CLEAR_CART: 'CLEAR_CART',
}

export function cartReducer(state, action)
{
    switch(action.type){

        case CART_ACTIONS.ADD_ITEM: {
           
           const existing = state.items.find(i => i.id === action.payload.id);
            
           if (existing) {
                return { ...state, items: state.items.map(i => i.id === action.payload.id? { ...i, quantity: i.quantity + 1 , tax : (i.quantity + 1)*i.price*3/100}: i)};
            }

            return { ...state, items: [...state.items, { ...action.payload, quantity: 1 , tax: action.payload.price*3/100}]};

        }

        case CART_ACTIONS.REMOVE_ITEM: {
           // return state.items.filter(i => i.id !== action.payload.id)  
           return {
                     ...state,
                    items: state.items.filter(i => i.id !== action.payload.id)
                 };         
        }

        case CART_ACTIONS.DECREASE_QUANTITY: {
            const { id, quantity } = action.payload;
            if (quantity <= 0) {
                return { ...state, items: state.items.filter(i => i.id !== id) };
            }
            return { ...state, items: state.items.map(i => i.id === id ? { ...i, quantity : i.quantity - 1, tax: (i.quantity - 1)*i.price*3/100} : i).filter(i=>i.quantity>0) }          
        }

        case CART_ACTIONS.CLEAR_CART:
            return cartInitialState;

        default:
            return state;
    }
}