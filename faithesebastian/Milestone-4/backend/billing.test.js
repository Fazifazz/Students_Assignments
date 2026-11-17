import test from "node:test";
import assert from "node:assert/strict";
import { createOrder } from "./billing.js";

const menu = [
  { id: "chai", name: "Masala Chai", price: 70 },
  { id: "naan", name: "Butter Naan", price: 60 }
];

test("creates a bill using menu prices and rounds tax to paise", () => {
  const order = createOrder({
    taxRate: 5,
    serviceType: "dine-in",
    tableNumber: "A4",
    customerMobile: "+91 98765 43210",
    items: [{ productId: "chai", quantity: 2 }, { productId: "naan", quantity: 1 }]
  }, menu);

  assert.equal(order.serviceType, "dine-in");
  assert.equal(order.tableNumber, "A4");
  assert.equal(order.customerMobile, "+91 98765 43210");
  assert.equal(order.subtotal, 200);
  assert.equal(order.tax, 10);
  assert.equal(order.total, 210);
  assert.equal(order.items[0].lineTotal, 140);
});

test("validates service type and customer mobile number", () => {
  const items = [{ productId: "chai", quantity: 1 }];
  assert.throws(
    () => createOrder({ serviceType: "delivery", items }, menu),
    /Choose dine-in or takeout/
  );
  assert.throws(
    () => createOrder({ customerMobile: "12345", items }, menu),
    /10 to 15 digits/
  );
});

test("does not keep a table number for takeout orders", () => {
  const order = createOrder({
    serviceType: "takeout",
    tableNumber: "A4",
    items: [{ productId: "chai", quantity: 1 }]
  }, menu);

  assert.equal(order.serviceType, "takeout");
  assert.equal(order.tableNumber, null);
  assert.equal(order.customerMobile, null);
});

test("rejects empty orders and invalid tax rates", () => {
  assert.throws(() => createOrder({ items: [] }, menu), /at least one menu item/);
  assert.throws(
    () => createOrder({ taxRate: 101, items: [{ productId: "chai", quantity: 1 }] }, menu),
    /between 0 and 100/
  );
});
