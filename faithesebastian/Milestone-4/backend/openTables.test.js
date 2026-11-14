import test from "node:test";
import assert from "node:assert/strict";
import { createOpenTableOrder } from "./openTables.js";

const menu = [
  { id: "chai", name: "Masala Chai", price: 70 }
];

test("creates a validated open order for a numbered table", () => {
  const order = createOpenTableOrder({
    taxRate: 5,
    customerMobile: "9876543210",
    items: [{ productId: "chai", quantity: 2 }]
  }, "  A4 ", menu);

  assert.equal(order.id, "A4");
  assert.equal(order.tableNumber, "A4");
  assert.equal(order.serviceType, "dine-in");
  assert.equal(order.customerMobile, "9876543210");
  assert.equal(order.total, 147);
});

test("requires a table number and at least one valid item", () => {
  assert.throws(
    () => createOpenTableOrder({ items: [{ productId: "chai", quantity: 1 }] }, "", menu),
    /Table number is required/
  );
  assert.throws(
    () => createOpenTableOrder({ items: [] }, "A4", menu),
    /at least one menu item/
  );
});
