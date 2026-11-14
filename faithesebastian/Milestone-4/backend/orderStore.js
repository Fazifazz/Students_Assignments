import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export function createOrderStore(filePath) {
  let pendingWrite = Promise.resolve();

  async function list() {
    try {
      const contents = await readFile(filePath, "utf8");
      const orders = JSON.parse(contents);
      if (!Array.isArray(orders)) {
        throw new Error("Order data must contain a JSON array.");
      }
      return orders;
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }

  async function persist(orders) {
    await mkdir(path.dirname(filePath), { recursive: true });

    const temporaryPath = `${filePath}.${randomUUID()}.tmp`;
    await writeFile(temporaryPath, `${JSON.stringify(orders, null, 2)}\n`, "utf8");
    await rename(temporaryPath, filePath);
  }

  function enqueueWrite(callback) {
    const operation = pendingWrite.then(callback);
    pendingWrite = operation.then(() => undefined, () => undefined);
    return operation;
  }

  function add(order) {
    return enqueueWrite(async () => {
      const orders = await list();
      orders.unshift(order);
      await persist(orders);
      return order;
    });
  }

  async function get(id) {
    const orders = await list();
    return orders.find((order) => order.id === id) || null;
  }

  function update(id, updatedOrder) {
    return enqueueWrite(async () => {
      const orders = await list();
      const index = orders.findIndex((order) => order.id === id);
      if (index === -1) return null;

      orders[index] = updatedOrder;
      await persist(orders);
      return updatedOrder;
    });
  }

  function remove(id) {
    return enqueueWrite(async () => {
      const orders = await list();
      const remainingOrders = orders.filter((order) => order.id !== id);
      if (remainingOrders.length === orders.length) return false;

      await persist(remainingOrders);
      return true;
    });
  }

  return { list, get, add, update, remove };
}
