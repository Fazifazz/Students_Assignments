export const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_DAYS: 'UPDATE_DAYS',
  CLEAR_CART: 'CLEAR_CART',
};

export const cartInitialState = {
  items: [],
};

// Pure reducer function (Session 35)
export function rentalCartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, days: item.days + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, days: 1 }],
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    }

    case CART_ACTIONS.UPDATE_DAYS: {
      const { id, days } = action.payload;
      if (days <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id),
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, days } : item
        ),
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return cartInitialState;

    default:
      return state;
  }
}
