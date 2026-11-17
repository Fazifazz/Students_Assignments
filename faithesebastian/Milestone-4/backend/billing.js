const roundCurrency = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export function createOrder({
  items,
  taxRate = 5,
  serviceType = "dine-in",
  tableNumber = "",
  customerMobile = ""
}, menu) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Add at least one menu item before creating a bill.");
  }

  if (!["dine-in", "takeout"].includes(serviceType)) {
    throw new Error("Choose dine-in or takeout for the order.");
  }

  if (typeof tableNumber !== "string" || tableNumber.trim().length > 20) {
    throw new Error("Table number must be 20 characters or fewer.");
  }

  if (typeof customerMobile !== "string") {
    throw new Error("Customer mobile number must be text.");
  }
  const parsedMobile = customerMobile.trim();
  const mobileDigits = parsedMobile.replace(/[\s()+-]/g, "");
  if (parsedMobile && !/^\d{10,15}$/.test(mobileDigits)) {
    throw new Error("Customer mobile number must contain 10 to 15 digits.");
  }

  const parsedTaxRate = Number(taxRate);
  if (!Number.isFinite(parsedTaxRate) || parsedTaxRate < 0 || parsedTaxRate > 100) {
    throw new Error("Tax rate must be a number between 0 and 100.");
  }

  const menuById = new Map(menu.map((item) => [item.id, item]));
  const orderItems = items.map(({ productId, quantity }) => {
    const product = menuById.get(productId);
    const parsedQuantity = Number(quantity);

    if (!product) {
      throw new Error("One or more selected menu items are no longer available.");
    }
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 99) {
      throw new Error("Item quantities must be whole numbers between 1 and 99.");
    }

    return {
      productId: product.id,
      name: product.name,
      quantity: parsedQuantity,
      unitPrice: product.price,
      lineTotal: roundCurrency(product.price * parsedQuantity)
    };
  });

  const subtotal = roundCurrency(orderItems.reduce((sum, item) => sum + item.lineTotal, 0));
  const tax = roundCurrency(subtotal * parsedTaxRate / 100);

  return {
    serviceType,
    tableNumber: serviceType === "dine-in" ? tableNumber.trim() || null : null,
    customerMobile: parsedMobile || null,
    items: orderItems,
    subtotal,
    taxRate: parsedTaxRate,
    tax,
    total: roundCurrency(subtotal + tax)
  };
}
