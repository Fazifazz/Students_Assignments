import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createOrderStore } from "./orderStore.js";

test("persists orders so a new store instance can list them", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "bistro-orders-"));
  const filePath = path.join(directory, "orders.json");

  try {
    const firstStore = createOrderStore(filePath);
    assert.deepEqual(await firstStore.list(), []);
    await Promise.all([
      firstStore.add({ id: "R-1", total: 210 }),
      firstStore.add({ id: "R-2", total: 100 })
    ]);

    const nextStore = createOrderStore(filePath);
    const orders = await nextStore.list();
    assert.deepEqual(orders.map((order) => order.id), ["R-2", "R-1"]);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("updates and removes saved orders without changing their identifiers", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "bistro-orders-"));
  const filePath = path.join(directory, "orders.json");

  try {
    const store = createOrderStore(filePath);
    await store.add({ id: "R-1", total: 210 });

    const updatedOrder = { id: "R-1", total: 315 };
    assert.deepEqual(await store.update("R-1", updatedOrder), updatedOrder);
    assert.deepEqual(await store.get("R-1"), updatedOrder);
    assert.equal(await store.update("missing", { id: "missing" }), null);

    const nextStore = createOrderStore(filePath);
    assert.deepEqual(await nextStore.list(), [updatedOrder]);
    assert.equal(await nextStore.remove("R-1"), true);
    assert.equal(await nextStore.remove("R-1"), false);
    assert.deepEqual(await createOrderStore(filePath).list(), []);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
