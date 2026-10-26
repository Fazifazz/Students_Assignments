import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "travel-planner:expenses";

const loadExpenses = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(saved || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const createExpenseId = () =>
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const budgetSlice = createSlice({
  name: "budget",
  initialState: {
    expensesByTrip: loadExpenses(),
  },
  reducers: {
    addExpense: (state, action) => {
      const { tripId, expense } = action.payload;
      const expenses = state.expensesByTrip[tripId] || [];
      state.expensesByTrip[tripId] = [
        ...expenses,
        { ...expense, id: expense.id || createExpenseId() },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.expensesByTrip));
    },
    updateExpense: (state, action) => {
      const { tripId, expenseId, updates } = action.payload;
      const expenses = state.expensesByTrip[tripId] || [];
      state.expensesByTrip[tripId] = expenses.map((expense) =>
        expense.id === expenseId ? { ...expense, ...updates } : expense,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.expensesByTrip));
    },
    deleteExpense: (state, action) => {
      const { tripId, expenseId } = action.payload;
      state.expensesByTrip[tripId] = (
        state.expensesByTrip[tripId] || []
      ).filter((expense) => expense.id !== expenseId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.expensesByTrip));
    },
    clearTripExpenses: (state, action) => {
      const tripId = action.payload;
      delete state.expensesByTrip[tripId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.expensesByTrip));
    },
  },
});

export const { addExpense, updateExpense, deleteExpense, clearTripExpenses } =
  budgetSlice.actions;
export default budgetSlice.reducer;
