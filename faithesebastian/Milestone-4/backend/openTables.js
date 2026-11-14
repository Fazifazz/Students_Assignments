import { createOrder } from "./billing.js";

export function createOpenTableOrder(input, tableNumber, menu) {
  const normalizedTableNumber = typeof tableNumber === "string" ? tableNumber.trim() : "";
  if (!normalizedTableNumber || normalizedTableNumber.length > 20) {
    throw new Error("Table number is required and must be 20 characters or fewer.");
  }

  const order = createOrder({
    ...input,
    serviceType: "dine-in",
    tableNumber: normalizedTableNumber
  }, menu);

  return {
    id: normalizedTableNumber,
    tableNumber: normalizedTableNumber,
    serviceType: "dine-in",
    customerMobile: order.customerMobile,
    taxRate: order.taxRate,
    items: order.items,
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total
  };
}
