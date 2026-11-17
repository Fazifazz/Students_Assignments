import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { createOrder } from "./billing.js";
import { createCategory } from "./categories.js";
import { menu } from "./menu.js";
import { createOrderStore } from "./orderStore.js";
import { createOpenTableOrder } from "./openTables.js";
import { createProduct } from "./products.js";

const app = express();
const port = Number(process.env.PORT) || 4001;
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const orderStore = createOrderStore(path.join(currentDir, "data", "orders.json"));
const productStore = createOrderStore(path.join(currentDir, "data", "products.json"));
const categoryStore = createOrderStore(path.join(currentDir, "data", "categories.json"));
const openTableStore = createOrderStore(path.join(currentDir, "data", "openTables.json"));

const savedProducts = await productStore.list();
for (const product of menu) {
  if (!savedProducts.some((savedProduct) => savedProduct.id === product.id)) {
    await productStore.add({ ...product, active: true });
  }
}
const savedCategories = await categoryStore.list();
const knownCategoryNames = new Set(savedCategories.map((category) => category.name.toLowerCase()));
for (const name of new Set([...menu, ...savedProducts].map((product) => product.category))) {
  if (!knownCategoryNames.has(name.toLowerCase())) {
    await categoryStore.add({
      id: `C-${randomUUID().slice(0, 8).toUpperCase()}`,
      name
    });
  }
}

async function getMenu(includeInactive = false) {
  const products = await productStore.list();
  return includeInactive ? products : products.filter((product) => product.active !== false);
}

app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("/api/menu", async (_request, response) => {
  try {
    response.json(await getMenu());
  } catch (error) {
    console.error("Could not read saved products:", error);
    response.status(500).json({ error: "Could not load menu." });
  }
});

app.get("/api/categories", async (_request, response) => {
  try {
    const [categories, products] = await Promise.all([categoryStore.list(), getMenu()]);
    response.json(categories.map((category) => ({
      ...category,
      productCount: products.filter((product) => product.category === category.name).length
    })));
  } catch (error) {
    console.error("Could not read product categories:", error);
    response.status(500).json({ error: "Could not load product categories." });
  }
});

app.post("/api/categories", async (request, response) => {
  let category;
  try {
    category = createCategory(request.body, `C-${randomUUID().slice(0, 8).toUpperCase()}`);
  } catch (error) {
    response.status(400).json({ error: error.message });
    return;
  }

  try {
    const categories = await categoryStore.list();
    if (categories.some((savedCategory) => savedCategory.name.toLowerCase() === category.name.toLowerCase())) {
      response.status(409).json({ error: "A category with this name already exists." });
      return;
    }
    response.status(201).json(await categoryStore.add(category));
  } catch (error) {
    console.error("Could not save product category:", error);
    response.status(500).json({ error: "Could not save product category." });
  }
});

app.put("/api/categories/:id", async (request, response) => {
  let updatedCategory;
  try {
    updatedCategory = createCategory(request.body, request.params.id);
  } catch (error) {
    response.status(400).json({ error: error.message });
    return;
  }

  try {
    const categories = await categoryStore.list();
    const previousCategory = categories.find((category) => category.id === request.params.id);
    if (!previousCategory) {
      response.status(404).json({ error: "Category not found." });
      return;
    }
    if (categories.some((category) => (
      category.id !== request.params.id
      && category.name.toLowerCase() === updatedCategory.name.toLowerCase()
    ))) {
      response.status(409).json({ error: "A category with this name already exists." });
      return;
    }

    const products = await getMenu(true);
    for (const product of products.filter((item) => item.category === previousCategory.name)) {
      const savedProduct = await productStore.update(
        product.id,
        { ...product, category: updatedCategory.name }
      );
      if (!savedProduct) throw new Error(`Could not update product ${product.id} while renaming category.`);
    }

    const savedCategory = await categoryStore.update(request.params.id, updatedCategory);
    if (!savedCategory) {
      response.status(404).json({ error: "Category not found." });
      return;
    }
    response.json({
      ...savedCategory,
      productCount: products.filter((product) => product.category === previousCategory.name).length
    });
  } catch (error) {
    console.error("Could not update product category:", error);
    response.status(500).json({ error: "Could not update product category." });
  }
});

app.delete("/api/categories/:id", async (request, response) => {
  try {
    const categories = await categoryStore.list();
    const category = categories.find((savedCategory) => savedCategory.id === request.params.id);
    if (!category) {
      response.status(404).json({ error: "Category not found." });
      return;
    }

    const products = await getMenu();
    if (products.some((product) => product.category === category.name)) {
      response.status(409).json({ error: "Reassign or remove this category's products before deleting it." });
      return;
    }
    const removed = await categoryStore.remove(request.params.id);
    if (!removed) {
      response.status(404).json({ error: "Category not found." });
      return;
    }
    response.json({ id: request.params.id });
  } catch (error) {
    console.error("Could not delete product category:", error);
    response.status(500).json({ error: "Could not delete product category." });
  }
});

app.post("/api/menu", async (request, response) => {
  let product;
  try {
    product = {
      ...createProduct(request.body, `P-${randomUUID().slice(0, 8).toUpperCase()}`),
      active: true
    };
  } catch (error) {
    response.status(400).json({ error: error.message });
    return;
  }

  try {
    const currentMenu = await getMenu(true);
    const categories = await categoryStore.list();
    if (!categories.some((category) => category.name === product.category)) {
      response.status(400).json({ error: "Choose an existing product category." });
      return;
    }
    if (currentMenu.some((item) => item.name.toLowerCase() === product.name.toLowerCase())) {
      response.status(409).json({ error: "A product with this name already exists." });
      return;
    }
    await productStore.add(product);
    response.status(201).json(product);
  } catch (error) {
    console.error("Could not save product:", error);
    response.status(500).json({ error: "Could not save product." });
  }
});

app.put("/api/menu/:id", async (request, response) => {
  let product;
  try {
    product = {
      ...createProduct(request.body, request.params.id),
      active: true
    };
  } catch (error) {
    response.status(400).json({ error: error.message });
    return;
  }

  try {
    const currentMenu = await getMenu(true);
    const categories = await categoryStore.list();
    if (!categories.some((category) => category.name === product.category)) {
      response.status(400).json({ error: "Choose an existing product category." });
      return;
    }
    if (!currentMenu.some((item) => item.id === request.params.id)) {
      response.status(404).json({ error: "Product not found." });
      return;
    }
    if (currentMenu.some((item) => (
      item.id !== request.params.id && item.name.toLowerCase() === product.name.toLowerCase()
    ))) {
      response.status(409).json({ error: "A product with this name already exists." });
      return;
    }
    const savedProduct = await productStore.update(request.params.id, product);
    if (!savedProduct) {
      response.status(404).json({ error: "Product not found." });
      return;
    }
    response.json(savedProduct);
  } catch (error) {
    console.error("Could not update product:", error);
    response.status(500).json({ error: "Could not update product." });
  }
});

app.delete("/api/menu/:id", async (request, response) => {
  try {
    const product = (await getMenu(true)).find((item) => item.id === request.params.id);
    if (!product || product.active === false) {
      response.status(404).json({ error: "Product not found." });
      return;
    }
    const savedProduct = await productStore.update(request.params.id, { ...product, active: false });
    if (!savedProduct) {
      response.status(404).json({ error: "Product not found." });
      return;
    }
    response.json({ id: request.params.id });
  } catch (error) {
    console.error("Could not remove product:", error);
    response.status(500).json({ error: "Could not remove product." });
  }
});

app.get("/api/tables", async (_request, response) => {
  try {
    response.json(await openTableStore.list());
  } catch (error) {
    console.error("Could not read open table orders:", error);
    response.status(500).json({ error: "Could not load open table orders." });
  }
});

app.put("/api/tables/:tableNumber", async (request, response) => {
  let currentMenu;
  try {
    currentMenu = await getMenu(true);
  } catch (error) {
    console.error("Could not load menu for table order:", error);
    response.status(500).json({ error: "Could not load menu." });
    return;
  }

  let openTableOrder;
  try {
    openTableOrder = createOpenTableOrder(request.body, request.params.tableNumber, currentMenu);
  } catch (error) {
    response.status(400).json({ error: error.message });
    return;
  }

  try {
    const previousOrder = await openTableStore.get(openTableOrder.id);
    const savedOrder = {
      ...openTableOrder,
      createdAt: previousOrder?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const result = previousOrder
      ? await openTableStore.update(savedOrder.id, savedOrder)
      : await openTableStore.add(savedOrder);
    if (!result) {
      response.status(404).json({ error: "Open table order not found." });
      return;
    }
    response.json(result);
  } catch (error) {
    console.error("Could not save open table order:", error);
    response.status(500).json({ error: "Could not save open table order." });
  }
});

app.delete("/api/tables/:tableNumber", async (request, response) => {
  try {
    const removed = await openTableStore.remove(request.params.tableNumber);
    if (!removed) {
      response.status(404).json({ error: "Open table order not found." });
      return;
    }
    response.json({ tableNumber: request.params.tableNumber });
  } catch (error) {
    console.error("Could not clear open table order:", error);
    response.status(500).json({ error: "Could not clear open table order." });
  }
});

app.get("/api/orders", async (_request, response) => {
  try {
    response.json(await orderStore.list());
  } catch (error) {
    console.error("Could not read saved orders:", error);
    response.status(500).json({ error: "Could not load saved orders." });
  }
});

app.get("/api/orders/:id", async (request, response) => {
  try {
    const order = await orderStore.get(request.params.id);
    if (!order) {
      response.status(404).json({ error: "Bill not found." });
      return;
    }
    response.json(order);
  } catch (error) {
    console.error("Could not read saved bill:", error);
    response.status(500).json({ error: "Could not load bill." });
  }
});

app.post("/api/orders", async (request, response) => {
  let currentMenu;
  try {
    currentMenu = await getMenu(true);
  } catch (error) {
    console.error("Could not load menu for bill:", error);
    response.status(500).json({ error: "Could not load menu." });
    return;
  }

  let totals;
  try {
    totals = createOrder(request.body, currentMenu);
  } catch (error) {
    response.status(400).json({ error: error.message });
    return;
  }

  const order = {
    id: `R-${randomUUID().slice(0, 8).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    ...totals
  };
  try {
    await orderStore.add(order);
    response.status(201).json(order);
  } catch (error) {
    console.error("Could not save order:", error);
    response.status(500).json({ error: "Could not save order." });
  }
});

app.put("/api/orders/:id", async (request, response) => {
  let currentMenu;
  try {
    currentMenu = await getMenu(true);
  } catch (error) {
    console.error("Could not load menu for bill update:", error);
    response.status(500).json({ error: "Could not load menu." });
    return;
  }

  let totals;
  try {
    totals = createOrder(request.body, currentMenu);
  } catch (error) {
    response.status(400).json({ error: error.message });
    return;
  }

  try {
    const previousOrder = await orderStore.get(request.params.id);
    if (!previousOrder) {
      response.status(404).json({ error: "Bill not found." });
      return;
    }

    const updatedOrder = {
      ...previousOrder,
      ...totals,
      updatedAt: new Date().toISOString()
    };
    const savedOrder = await orderStore.update(request.params.id, updatedOrder);
    if (!savedOrder) {
      response.status(404).json({ error: "Bill not found." });
      return;
    }
    response.json(savedOrder);
  } catch (error) {
    console.error("Could not update bill:", error);
    response.status(500).json({ error: "Could not update bill." });
  }
});

app.delete("/api/orders/:id", async (request, response) => {
  try {
    const removed = await orderStore.remove(request.params.id);
    if (!removed) {
      response.status(404).json({ error: "Bill not found." });
      return;
    }
    response.json({ id: request.params.id });
  } catch (error) {
    console.error("Could not delete bill:", error);
    response.status(500).json({ error: "Could not delete bill." });
  }
});

const frontendDist = path.resolve(currentDir, "../frontend/dist");
app.use(express.static(frontendDist));
app.get("/{*path}", (_request, response, next) => {
  response.sendFile(path.join(frontendDist, "index.html"), (error) => {
    if (error) next();
  });
});

app.listen(port, () => {
  console.log(`Restaurant billing API listening on http://localhost:${port}`);
});
