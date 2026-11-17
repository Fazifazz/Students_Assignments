import test from "node:test";
import assert from "node:assert/strict";
import { createCategory } from "./categories.js";

test("creates a trimmed category", () => {
  assert.deepEqual(createCategory({ name: "  Beverages " }, "C-1"), {
    id: "C-1",
    name: "Beverages"
  });
});

test("requires a non-empty category name within the limit", () => {
  assert.throws(() => createCategory({ name: " " }, "C-1"), /Category name is required/);
  assert.throws(() => createCategory({ name: "a".repeat(41) }, "C-1"), /40 characters or fewer/);
});
