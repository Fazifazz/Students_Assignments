import test from "node:test";
import assert from "node:assert/strict";
import { createProduct } from "./products.js";

test("creates a trimmed product with a fallback image", () => {
  const product = createProduct({
    name: "  Mango Lassi ",
    category: " Drinks ",
    price: "125",
    description: "  Fresh mango yogurt drink  "
  }, "P-TEST1234");

  assert.deepEqual(product, {
    id: "P-TEST1234",
    name: "Mango Lassi",
    category: "Drinks",
    price: 125,
    description: "Fresh mango yogurt drink",
    image: "/menu/hero-dish.svg"
  });
});

test("rejects invalid product details and unsafe image paths", () => {
  assert.throws(
    () => createProduct({ name: "", category: "Drinks", price: 10 }, "P-TEST"),
    /Product name is required/
  );
  assert.throws(
    () => createProduct({ name: "Tea", category: "Drinks", price: 0 }, "P-TEST"),
    /Price must be greater than 0/
  );
  assert.throws(
    () => createProduct({
      name: "Tea",
      category: "Drinks",
      price: 10,
      image: "javascript:alert(1)"
    }, "P-TEST"),
    /Image must be an HTTPS URL/
  );
});
