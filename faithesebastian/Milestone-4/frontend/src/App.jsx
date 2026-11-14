import { useEffect, useMemo, useRef, useState } from "react";
import LoginPage from "./LoginPage.jsx";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2
});

const money = (amount) => currency.format(amount);
const localDateValue = (date) => (
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
);
const productEditRoute = /^\/products\/([^/]+)\/edit$/;

function pageForPath(path) {
  if (path === "/orders") return "orders";
  if (path === "/tables") return "tables";
  if (path === "/categories") return "categories";
  if (path === "/bill") return "billing";
  if (path === "/products") return "products";
  if (path === "/products/new") return "product";
  if (productEditRoute.test(path)) return "product-edit";
  return "dashboard";
}

async function request(path, options) {
  const response = await fetch(path, options);
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "The request could not be completed.");
  return result;
}

function App() {
  const [isSignedIn, setIsSignedIn] = useState(
    () => sessionStorage.getItem("bistro-pos-demo-signed-in") === "true"
  );
  const [staffName, setStaffName] = useState(
    () => sessionStorage.getItem("bistro-pos-demo-name") || "Staff"
  );
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({});
  const [storageReady, setStorageReady] = useState(false);
  const [orders, setOrders] = useState([]);
  const [openTables, setOpenTables] = useState([]);
  const [categoryRecords, setCategoryRecords] = useState([]);
  const [category, setCategory] = useState("All items");
  const [search, setSearch] = useState("");
  const [taxRate, setTaxRate] = useState("5");
  const [serviceType, setServiceType] = useState("dine-in");
  const [tableNumber, setTableNumber] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [productDraft, setProductDraft] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: ""
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingTable, setSavingTable] = useState(false);
  const [productSuccess, setProductSuccess] = useState("");
  const [tableSaveMessage, setTableSaveMessage] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryMessage, setCategoryMessage] = useState("");
  const [dateFrom, setDateFrom] = useState(() => localDateValue(new Date()));
  const [dateTo, setDateTo] = useState(() => localDateValue(new Date()));
  const [latestOrder, setLatestOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(() => pageForPath(window.location.pathname));
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editingProductId, setEditingProductId] = useState(
    () => productEditRoute.exec(window.location.pathname)?.[1] || null
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const draftBeforeEdit = useRef(null);

  useEffect(() => {
    function syncPage() {
      const path = window.location.pathname;
      const productMatch = productEditRoute.exec(path);
      setCurrentPage(pageForPath(path));
      setEditingProductId(productMatch?.[1] || null);
    }

    window.addEventListener("popstate", syncPage);
    return () => window.removeEventListener("popstate", syncPage);
  }, []);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("bistro-pos-cart");
      const savedTaxRate = localStorage.getItem("bistro-pos-tax-rate");
      const savedServiceType = localStorage.getItem("bistro-pos-service-type");
      const savedTableNumber = localStorage.getItem("bistro-pos-table-number");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (!parsedCart || typeof parsedCart !== "object" || Array.isArray(parsedCart)) {
          throw new Error("Saved cart data is invalid.");
        }
        setCart(parsedCart);
      }
      if (savedTaxRate !== null) setTaxRate(savedTaxRate);
      if (savedServiceType === "dine-in" || savedServiceType === "takeout") {
        setServiceType(savedServiceType);
      }
      if (savedTableNumber !== null) setTableNumber(savedTableNumber);
      setStorageReady(true);
    } catch (storageError) {
      setError(`Could not restore the saved draft: ${storageError.message}`);
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    request("/api/menu")
      .then(setMenu)
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    request("/api/orders")
      .then(setOrders)
      .catch((loadError) => setError(loadError.message));
  }, []);

  useEffect(() => {
    request("/api/tables")
      .then(setOpenTables)
      .catch((loadError) => setError(loadError.message));
  }, []);

  useEffect(() => {
    request("/api/categories")
      .then(setCategoryRecords)
      .catch((loadError) => setError(loadError.message));
  }, []);

  useEffect(() => {
    if (currentPage !== "product-edit" || !editingProductId || loading) return;
    const product = menu.find((item) => item.id === editingProductId);
    if (!product) {
      setError("Product not found in the active menu.");
      navigateTo("products");
      return;
    }
    setProductDraft({
      name: product.name,
      category: product.category,
      price: String(product.price),
      description: product.description || "",
      image: product.image || ""
    });
  }, [currentPage, editingProductId, loading, menu]);

  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem("bistro-pos-cart", JSON.stringify(cart));
      localStorage.setItem("bistro-pos-tax-rate", taxRate);
      localStorage.setItem("bistro-pos-service-type", serviceType);
      localStorage.setItem("bistro-pos-table-number", tableNumber);
    } catch (storageError) {
      setError(`Could not save the order draft: ${storageError.message}`);
    }
  }, [cart, serviceType, storageReady, tableNumber, taxRate]);

  async function refreshOrders() {
    setError("");
    try {
      setOrders(await request("/api/orders"));
    } catch (loadError) {
      setError(loadError.message);
    }
  }

  async function refreshTables() {
    setError("");
    try {
      setOpenTables(await request("/api/tables"));
    } catch (loadError) {
      setError(loadError.message);
    }
  }

  const categories = useMemo(
    () => ["All items", ...new Set(menu.map((item) => item.category))],
    [menu]
  );
  const visibleMenu = useMemo(() => {
    const query = search.trim().toLowerCase();
    return menu.filter((item) => (
      (category === "All items" || item.category === category)
      && (!query || `${item.name} ${item.description}`.toLowerCase().includes(query))
    ));
  }, [menu, category, search]);

  const cartItems = useMemo(
    () => Object.values(cart).filter((entry) => entry.quantity > 0),
    [cart]
  );
  const subtotal = cartItems.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  const safeTaxRate = Number.isFinite(Number(taxRate)) ? Math.min(100, Math.max(0, Number(taxRate))) : 0;
  const tax = Math.round((subtotal * safeTaxRate / 100 + Number.EPSILON) * 100) / 100;
  const total = Math.round((subtotal + tax + Number.EPSILON) * 100) / 100;
  const validDateRange = dateFrom <= dateTo;
  const rangeStart = new Date(`${dateFrom}T00:00:00`);
  const rangeEnd = new Date(`${dateTo}T23:59:59.999`);
  const filteredOrders = validDateRange ? orders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return Number.isFinite(createdAt.getTime()) && createdAt >= rangeStart && createdAt <= rangeEnd;
  }) : [];
  const filteredSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const dailySales = Array.from(filteredOrders.reduce((salesByDate, order) => {
    const date = localDateValue(new Date(order.createdAt));
    const sales = salesByDate.get(date) || { date, billCount: 0, total: 0 };
    sales.billCount += 1;
    sales.total += order.total;
    salesByDate.set(date, sales);
    return salesByDate;
  }, new Map()).values()).sort((first, second) => second.date.localeCompare(first.date));
  const highestDailySales = dailySales.reduce(
    (highest, sales) => Math.max(highest, sales.total),
    0
  );

  function navigateTo(page, productId) {
    const nextPath = page === "orders"
      ? "/orders"
      : page === "tables" ? "/tables"
        : page === "categories" ? "/categories"
        : page === "billing" ? "/bill"
        : page === "products" ? "/products"
          : page === "product" ? "/products/new"
            : page === "product-edit" ? `/products/${encodeURIComponent(productId)}/edit` : "/";
    if (window.location.pathname !== nextPath) window.history.pushState({}, "", nextPath);
    setCurrentPage(page);
    setEditingProductId(page === "product-edit" ? productId : null);
  }

  function signIn(email) {
    const name = email.split("@")[0] || "Staff";
    sessionStorage.setItem("bistro-pos-demo-signed-in", "true");
    sessionStorage.setItem("bistro-pos-demo-name", name);
    setStaffName(name);
    setIsSignedIn(true);
  }

  function signOut() {
    sessionStorage.removeItem("bistro-pos-demo-signed-in");
    sessionStorage.removeItem("bistro-pos-demo-name");
    setIsSignedIn(false);
  }

  function cancelEditing() {
    setEditingOrderId(null);
    if (draftBeforeEdit.current) {
      setCart(draftBeforeEdit.current.cart);
      setTaxRate(draftBeforeEdit.current.taxRate);
      setServiceType(draftBeforeEdit.current.serviceType);
      setTableNumber(draftBeforeEdit.current.tableNumber);
      setCustomerMobile(draftBeforeEdit.current.customerMobile);
      draftBeforeEdit.current = null;
    } else {
      setCart({});
      setCustomerMobile("");
    }
  }

  function editOrder(order) {
    if (!editingOrderId) {
      draftBeforeEdit.current = { cart, taxRate, serviceType, tableNumber, customerMobile };
    }
    const orderCart = Object.fromEntries(order.items.map((line) => {
      const item = menu.find((entry) => entry.id === line.productId) || {
        id: line.productId,
        name: line.name,
        price: line.unitPrice
      };
      return [line.productId, { item, quantity: line.quantity }];
    }));

    setCart(orderCart);
    setTaxRate(String(order.taxRate));
    setServiceType(order.serviceType || "dine-in");
    setTableNumber(order.tableNumber || "");
    setCustomerMobile(order.customerMobile || "");
    setEditingOrderId(order.id);
    setLatestOrder(null);
    setError("");
    navigateTo("billing");
  }

  async function deleteOrder(order) {
    if (!window.confirm(`Permanently delete bill ${order.id}?`)) return;
    setError("");
    try {
      await request(`/api/orders/${encodeURIComponent(order.id)}`, { method: "DELETE" });
      setOrders((current) => current.filter((savedOrder) => savedOrder.id !== order.id));
      setLatestOrder((current) => current?.id === order.id ? null : current);
      if (editingOrderId === order.id) cancelEditing();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  function addToCart(item) {
    setCart((current) => ({
      ...current,
      [item.id]: {
        item,
        quantity: Math.min(99, (current[item.id]?.quantity || 0) + 1)
      }
    }));
    setError("");
  }

  function changeQuantity(itemId, amount) {
    setCart((current) => {
      const quantity = (current[itemId]?.quantity || 0) + amount;
      if (quantity <= 0) {
        const next = { ...current };
        delete next[itemId];
        return next;
      }
      return { ...current, [itemId]: { ...current[itemId], quantity: Math.min(99, quantity) } };
    });
  }

  async function createBill() {
    const mobileDigits = customerMobile.trim().replace(/[\s()+-]/g, "");
    if (customerMobile.trim() && !/^\d{10,15}$/.test(mobileDigits)) {
      setError("Customer mobile number must contain 10 to 15 digits.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const isEditing = Boolean(editingOrderId);
      const path = isEditing
        ? `/api/orders/${encodeURIComponent(editingOrderId)}`
        : "/api/orders";
      const order = await request(path, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taxRate: safeTaxRate,
          serviceType,
          tableNumber: serviceType === "dine-in" ? tableNumber.trim() : "",
          customerMobile: customerMobile.trim(),
          items: cartItems.map(({ item, quantity }) => ({
            productId: item.id,
            quantity
          }))
        })
      });
      setLatestOrder(order);
      setOrders((current) => isEditing
        ? current.map((savedOrder) => savedOrder.id === order.id ? order : savedOrder)
        : [order, ...current]);
      if (!isEditing && serviceType === "dine-in" && openTables.some((table) => table.tableNumber === tableNumber.trim())) {
        try {
          await request(`/api/tables/${encodeURIComponent(tableNumber.trim())}`, { method: "DELETE" });
          setOpenTables((current) => current.filter((table) => table.tableNumber !== tableNumber.trim()));
        } catch (clearError) {
          setError(`Bill ${order.id} was created, but table ${tableNumber.trim()} could not be cleared: ${clearError.message}`);
        }
      }
      setCart({});
      setTableNumber("");
      setCustomerMobile("");
      setTableSaveMessage("");
      setEditingOrderId(null);
      draftBeforeEdit.current = null;
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function saveTableOrder() {
    const savedTableNumber = tableNumber.trim();
    if (!savedTableNumber) {
      setError("Enter a table number before saving an open table order.");
      return;
    }
    if (!cartItems.length) {
      setError("Add at least one menu item before saving an open table order.");
      return;
    }

    setSavingTable(true);
    setError("");
    setTableSaveMessage("");
    try {
      const savedTable = await request(`/api/tables/${encodeURIComponent(savedTableNumber)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taxRate: safeTaxRate,
          customerMobile: customerMobile.trim(),
          items: cartItems.map(({ item, quantity }) => ({
            productId: item.id,
            quantity
          }))
        })
      });
      setOpenTables((current) => [
        savedTable,
        ...current.filter((table) => table.tableNumber !== savedTable.tableNumber)
      ]);
      setTableSaveMessage(`Order saved for table ${savedTable.tableNumber}.`);
      setCart({});
      setTableNumber("");
      setCustomerMobile("");
      navigateTo("tables");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSavingTable(false);
    }
  }

  function resumeTableOrder(tableOrder) {
    const savedCart = Object.fromEntries(tableOrder.items.map((line) => {
      const item = menu.find((entry) => entry.id === line.productId) || {
        id: line.productId,
        name: line.name,
        price: line.unitPrice
      };
      return [line.productId, { item, quantity: line.quantity }];
    }));
    setCart(savedCart);
    setServiceType("dine-in");
    setTableNumber(tableOrder.tableNumber);
    setTaxRate(String(tableOrder.taxRate));
    setCustomerMobile(tableOrder.customerMobile || "");
    setLatestOrder(null);
    setEditingOrderId(null);
    draftBeforeEdit.current = null;
    setError("");
    navigateTo("billing");
  }

  function startNewTableOrder() {
    setCart({});
    setServiceType("dine-in");
    setTableNumber("");
    setCustomerMobile("");
    setLatestOrder(null);
    setEditingOrderId(null);
    draftBeforeEdit.current = null;
    setTableSaveMessage("");
    navigateTo("billing");
  }

  async function addProduct(event) {
    event.preventDefault();
    setSavingProduct(true);
    setError("");
    setProductSuccess("");
    try {
      const product = await request("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productDraft)
      });
      setMenu((current) => [...current, product]);
      setCategoryRecords((current) => current.map((category) => (
        category.name === product.category
          ? { ...category, productCount: category.productCount + 1 }
          : category
      )));
      setProductDraft({ name: "", category: "", price: "", description: "", image: "" });
      setProductSuccess(`${product.name} was added to the menu.`);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSavingProduct(false);
    }
  }

  function editProduct(product) {
    setProductDraft({
      name: product.name,
      category: product.category,
      price: String(product.price),
      description: product.description || "",
      image: product.image || ""
    });
    setProductSuccess("");
    setError("");
    navigateTo("product-edit", product.id);
  }

  async function updateProduct(event) {
    event.preventDefault();
    setSavingProduct(true);
    setError("");
    setProductSuccess("");
    try {
      const previousProduct = menu.find((item) => item.id === editingProductId);
      const product = await request(`/api/menu/${encodeURIComponent(editingProductId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productDraft)
      });
      setMenu((current) => current.map((item) => item.id === product.id ? product : item));
      if (previousProduct && previousProduct.category !== product.category) {
        setCategoryRecords((current) => current.map((category) => (
          category.name === previousProduct.category
            ? { ...category, productCount: Math.max(0, category.productCount - 1) }
            : category.name === product.category
              ? { ...category, productCount: category.productCount + 1 }
              : category
        )));
      }
      setCart((current) => current[product.id]
        ? { ...current, [product.id]: { ...current[product.id], item: product } }
        : current);
      setProductSuccess(`${product.name} was updated.`);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSavingProduct(false);
    }
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Remove ${product.name} from the active menu?`)) return;
    setError("");
    try {
      await request(`/api/menu/${encodeURIComponent(product.id)}`, { method: "DELETE" });
      setMenu((current) => current.filter((item) => item.id !== product.id));
      setCategoryRecords((current) => current.map((category) => (
        category.name === product.category
          ? { ...category, productCount: Math.max(0, category.productCount - 1) }
          : category
      )));
      setCart((current) => {
        if (!current[product.id]) return current;
        const next = { ...current };
        delete next[product.id];
        return next;
      });
      setProductSuccess(`${product.name} was removed from the active menu.`);
      if (editingProductId === product.id) navigateTo("products");
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  function startCategoryEdit(category) {
    setCategoryName(category.name);
    setEditingCategoryId(category.id);
    setCategoryMessage("");
    setError("");
  }

  function resetCategoryForm() {
    setCategoryName("");
    setEditingCategoryId(null);
  }

  async function saveCategory(event) {
    event.preventDefault();
    setSavingCategory(true);
    setError("");
    setCategoryMessage("");
    try {
      const previousCategory = categoryRecords.find((category) => category.id === editingCategoryId);
      const category = await request(
        editingCategoryId ? `/api/categories/${encodeURIComponent(editingCategoryId)}` : "/api/categories",
        {
          method: editingCategoryId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: categoryName })
        }
      );
      setCategoryRecords((current) => editingCategoryId
        ? current.map((savedCategory) => savedCategory.id === category.id ? category : savedCategory)
        : [...current, { ...category, productCount: 0 }]);
      if (previousCategory && previousCategory.name !== category.name) {
        setMenu((current) => current.map((product) => (
          product.category === previousCategory.name
            ? { ...product, category: category.name }
            : product
        )));
      }
      setCategoryMessage(previousCategory ? "Category updated." : "Category added.");
      resetCategoryForm();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSavingCategory(false);
    }
  }

  async function deleteCategory(category) {
    if (category.productCount > 0) {
      setError("Reassign this category's products before deleting it.");
      return;
    }
    if (!window.confirm(`Delete the ${category.name} category?`)) return;
    setError("");
    setCategoryMessage("");
    try {
      await request(`/api/categories/${encodeURIComponent(category.id)}`, { method: "DELETE" });
      setCategoryRecords((current) => current.filter((savedCategory) => savedCategory.id !== category.id));
      setCategoryMessage(`${category.name} category deleted.`);
      if (editingCategoryId === category.id) resetCategoryForm();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  if (!isSignedIn) return <LoginPage onLogin={signIn} />;

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Bistro POS home">
          <span className="brand-mark">B</span>
          <span><strong>Bistro POS</strong><small>Restaurant billing</small></span>
        </a>
        <nav className="main-navigation" aria-label="Main navigation">
          <button className={currentPage === "dashboard" ? "active" : ""} onClick={() => navigateTo("dashboard")}>
            Dashboard
          </button>
          <button className={currentPage === "billing" ? "active" : ""} onClick={() => navigateTo("billing")}>
            New bill
          </button>
          <button className={["products", "product", "product-edit"].includes(currentPage) ? "active" : ""} onClick={() => navigateTo("products")}>
            Products
          </button>
          <button className={currentPage === "categories" ? "active" : ""} onClick={() => navigateTo("categories")}>
            Categories
          </button>
          <button className={currentPage === "tables" ? "active" : ""} onClick={() => navigateTo("tables")}>
            Tables <span>{openTables.length}</span>
          </button>
          <button
            className={currentPage === "orders" ? "active" : ""}
            onClick={() => navigateTo("orders")}
          >
            Orders <span>{orders.length}</span>
          </button>
        </nav>
        <div className="topbar-right">
          <span className="service-status"><span /> Billing ready</span>
          <div className="avatar" aria-label={`Signed in as ${staffName}`}>
            {staffName.slice(0, 1).toUpperCase()}
          </div>
          <button className="sign-out-button" onClick={signOut}>Sign out</button>
        </div>
      </header>

      <div className="page-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">{currentPage === "orders" ? "BILLING HISTORY" : currentPage === "tables" ? "OPEN ORDERS" : currentPage === "dashboard" ? "RESTAURANT OVERVIEW" : ["products", "product", "product-edit", "categories"].includes(currentPage) ? "MENU MANAGEMENT" : "POINT OF SALE"}</p>
            <h1>{currentPage === "orders" ? "Recent orders" : currentPage === "tables" ? "Open tables" : currentPage === "dashboard" ? "Dashboard" : currentPage === "categories" ? "Categories" : currentPage === "products" ? "Products" : currentPage === "product-edit" ? "Edit product" : currentPage === "product" ? "Add product" : editingOrderId ? "Edit bill" : "New bill"}</h1>
            <p className="subheading">
              {currentPage === "orders"
                ? "Review, print, edit, or remove a saved restaurant bill."
                : currentPage === "tables"
                  ? "Save and resume dine-in orders by table, then create the final bill at checkout."
                : currentPage === "dashboard"
                  ? "Track daily sales and review your restaurant’s performance."
                  : currentPage === "categories"
                    ? "Add, rename, and manage menu categories."
                  : currentPage === "products"
                    ? "Manage the products available on your restaurant menu."
                    : currentPage === "product" || currentPage === "product-edit"
                    ? "Add a menu item for your team to include in new bills."
                    : editingOrderId
                  ? `Editing bill ${editingOrderId}. Changes will update the saved bill.`
                  : "Select menu items to create a restaurant bill."}
            </p>
          </div>
          <div className="date-chip">{new Date().toLocaleDateString("en-IN", {
            weekday: "short", day: "numeric", month: "short", year: "numeric"
          })}</div>
        </div>

        {error && <div className="error-banner" role="alert">{error}</div>}

        {currentPage === "dashboard" && (
          <section className="dashboard-stats" aria-label="Sales overview">
            <div className="dashboard-summary-heading">
              <div>
                <h2>Sales overview</h2>
                <span>Filter saved bills by date range</span>
              </div>
              <div className="dashboard-summary-actions">
                <div className="dashboard-date-filter" aria-label="Filter dashboard by date">
                  <label>From
                    <input
                      type="date"
                      value={dateFrom}
                      max={dateTo}
                      onChange={(event) => {
                        if (event.target.value) setDateFrom(event.target.value);
                      }}
                      aria-label="Start date"
                    />
                  </label>
                  <span aria-hidden="true">–</span>
                  <label>To
                    <input
                      type="date"
                      value={dateTo}
                      min={dateFrom}
                      onChange={(event) => {
                        if (event.target.value) setDateTo(event.target.value);
                      }}
                      aria-label="End date"
                    />
                  </label>
                </div>
                <button className="dashboard-new-bill" onClick={() => navigateTo("billing")}>
                  Create new bill <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
            <article className="stat-card stat-card-sales">
              <span className="stat-icon" aria-hidden="true">₹</span>
              <div><span className="stat-label">Sales in range</span><strong>{money(filteredSales)}</strong></div>
              <span className="stat-detail">From {filteredOrders.length} {filteredOrders.length === 1 ? "bill" : "bills"}</span>
            </article>
            <article className="stat-card">
              <span className="stat-icon stat-icon-orders" aria-hidden="true">↗</span>
              <div><span className="stat-label">Bills in range</span><strong>{filteredOrders.length}</strong></div>
              <span className="stat-detail">All orders: {orders.length}</span>
            </article>
            <article className="stat-card stat-card-menu">
              <span className="stat-icon stat-icon-menu" aria-hidden="true">✦</span>
              <div><span className="stat-label">Menu items</span><strong>{menu.length}</strong></div>
              <span className="stat-detail">Ready to serve</span>
            </article>
          </section>
        )}

        {currentPage === "dashboard" && (
          <section className="sales-report" aria-label="Date-wise sales report">
            <div className="sales-report-heading">
              <div>
                <h2>Date-wise sales report</h2>
                <span className="muted">Daily totals for the selected date range</span>
              </div>
              <span className="sales-report-total">{money(filteredSales)} <small>total sales</small></span>
            </div>
            {dailySales.length ? (
              <div className="sales-table-wrap">
                <table className="sales-table">
                  <thead>
                    <tr><th scope="col">Date</th><th scope="col">Bills</th><th scope="col">Sales</th><th scope="col"><span className="visually-hidden">Daily sales comparison</span></th></tr>
                  </thead>
                  <tbody>
                    {dailySales.map((sales) => (
                      <tr key={sales.date}>
                        <td>{new Date(`${sales.date}T00:00:00`).toLocaleDateString("en-IN", {
                          weekday: "short", day: "numeric", month: "short", year: "numeric"
                        })}</td>
                        <td>{sales.billCount}</td>
                        <td className="sales-table-amount">{money(sales.total)}</td>
                        <td>
                          <div className="sales-bar" aria-hidden="true">
                            <span style={{ width: `${highestDailySales ? sales.total / highestDailySales * 100 : 0}%` }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="sales-report-empty">No saved bills in this date range.</p>
            )}
          </section>
        )}

        {currentPage === "categories" ? (
          <section className="categories-page" aria-label="Manage categories">
            <div className="categories-page-heading">
              <div>
                <h2>Menu categories</h2>
                <span className="muted">{categoryRecords.length} categories</span>
              </div>
              <button className="product-submit" type="button" onClick={() => {
                resetCategoryForm();
                setCategoryMessage("");
                setError("");
              }}>
                + Add category
              </button>
            </div>
            {categoryMessage && <div className="category-success" role="status">{categoryMessage}</div>}
            <form className="category-form" onSubmit={saveCategory}>
              <label className="product-field">
                <span>{editingCategoryId ? "Edit category name" : "New category name"}</span>
                <input
                  type="text"
                  maxLength="40"
                  placeholder="e.g. Beverages"
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  required
                />
              </label>
              <div className="category-form-actions">
                {editingCategoryId && (
                  <button type="button" className="product-cancel" onClick={resetCategoryForm}>Cancel</button>
                )}
                <button type="submit" className="product-submit" disabled={savingCategory}>
                  {savingCategory ? "Saving…" : editingCategoryId ? "Save changes" : "Add category"}
                </button>
              </div>
            </form>
            {categoryRecords.length ? (
              <div className="categories-list">
                {categoryRecords.map((category) => (
                  <article className="category-card" key={category.id}>
                    <div className="category-card-info">
                      <strong>{category.name}</strong>
                      <span>{category.productCount} active {category.productCount === 1 ? "product" : "products"}</span>
                      {category.productCount > 0 && <span className="category-usage-note">Reassign products before deleting</span>}
                    </div>
                    <div className="category-card-actions">
                      <button className="edit-button" onClick={() => startCategoryEdit(category)}>Edit</button>
                      <button
                        className="delete-button"
                        disabled={category.productCount > 0}
                        title={category.productCount > 0 ? "Reassign products before deleting this category" : "Delete category"}
                        onClick={() => deleteCategory(category)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="products-empty">No categories yet. Add one to organize your menu.</p>
            )}
          </section>
        ) : currentPage === "tables" ? (
          <section className="tables-page" aria-label="Open table orders">
            <div className="tables-page-heading">
              <div>
                <h2>Open table orders</h2>
                <span className="muted">{openTables.length} tables with saved orders</span>
              </div>
              <div className="tables-page-actions">
                <button className="text-button" onClick={refreshTables}>Refresh</button>
                <button className="product-submit" onClick={startNewTableOrder}>New table order</button>
              </div>
            </div>
            {tableSaveMessage && <div className="table-save-notice table-save-notice-page" role="status">{tableSaveMessage}</div>}
            {openTables.length ? (
              <div className="tables-grid">
                {openTables.map((tableOrder) => (
                  <article className="open-table-card" key={tableOrder.tableNumber}>
                    <div className="open-table-card-heading">
                      <div>
                        <span className="open-table-label">DINE IN</span>
                        <h3>Table {tableOrder.tableNumber}</h3>
                      </div>
                      <strong>{money(tableOrder.total)}</strong>
                    </div>
                    <span className="open-table-updated">
                      Updated {new Date(tableOrder.updatedAt || tableOrder.createdAt).toLocaleString("en-IN")}
                    </span>
                    <div className="open-table-items">
                      {tableOrder.items.map((item) => (
                        <span key={item.productId}>{item.name} <strong>× {item.quantity}</strong></span>
                      ))}
                    </div>
                    {tableOrder.customerMobile && (
                      <span className="open-table-mobile">Customer {tableOrder.customerMobile}</span>
                    )}
                    <button className="table-resume-button" onClick={() => resumeTableOrder(tableOrder)}>
                      Resume order <span aria-hidden="true">→</span>
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="tables-empty">
                <span className="cart-empty-icon">＋</span>
                <strong>No open table orders</strong>
                <span>Start a dine-in order and save it to a table to continue later.</span>
                <button className="table-resume-button" onClick={startNewTableOrder}>Start table order</button>
              </div>
            )}
          </section>
        ) : currentPage === "products" ? (
          <section className="products-page" aria-label="Products">
            <div className="products-page-heading">
              <div>
                <h2>Menu products</h2>
                <span className="muted">{menu.length} active products</span>
              </div>
              <button className="product-submit" onClick={() => {
                setProductDraft({ name: "", category: "", price: "", description: "", image: "" });
                setProductSuccess("");
                navigateTo("product");
              }}>
                <span aria-hidden="true">+</span> Add product
              </button>
            </div>
            {productSuccess && <div className="product-success" role="status">{productSuccess}</div>}
            {menu.length ? (
              <div className="products-grid">
                {menu.map((product) => (
                  <article className="product-card" key={product.id}>
                    <img
                      src={product.image}
                      alt=""
                      loading="lazy"
                      onError={(event) => { event.currentTarget.hidden = true; }}
                    />
                    <div className="product-card-info">
                      <span className="product-category">{product.category}</span>
                      <strong>{product.name}</strong>
                      <span className="product-card-description">{product.description || "No description"}</span>
                      <span className="product-card-price">{money(product.price)}</span>
                    </div>
                    <div className="product-card-actions">
                      <button className="edit-button" onClick={() => editProduct(product)}>Edit</button>
                      <button className="delete-button" onClick={() => deleteProduct(product)}>Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="products-empty">No active products. Add a product to get started.</p>
            )}
          </section>
        ) : currentPage === "orders" ? (
          <section className="orders-page" aria-label="Recent orders">
            <div className="history-heading">
              <div><h2>Saved bills</h2><span className="muted">{orders.length} bills from the Express API</span></div>
              <button className="text-button" onClick={refreshOrders}>Refresh list</button>
            </div>
            {orders.length ? (
              <div className="orders-grid">
                {orders.map((order) => (
                  <article className="order-card" key={order.id}>
                    <div className="order-card-heading">
                      <div>
                        <strong>{order.id}</strong>
                        <span>{new Date(order.createdAt).toLocaleString("en-IN")}</span>
                      </div>
                      <strong className="order-card-total">{money(order.total)}</strong>
                    </div>
                    <div className="order-card-items">
                      {order.items.map((item) => (
                        <span key={item.productId}>{item.name} <strong>× {item.quantity}</strong></span>
                      ))}
                    </div>
                    <div className="order-card-meta">
                      <span>{order.serviceType === "dine-in" ? "Dine in" : order.serviceType === "takeout" ? "Takeout" : "Service not specified"}</span>
                      {order.tableNumber && <span>Table {order.tableNumber}</span>}
                      {order.customerMobile && <span>{order.customerMobile}</span>}
                    </div>
                    <div className="order-card-summary">
                      <span>Subtotal {money(order.subtotal)}</span>
                      <span>Tax ({order.taxRate}%) {money(order.tax)}</span>
                    </div>
                    <div className="order-card-actions">
                      <button className="print-button" onClick={() => {
                        setLatestOrder(order);
                        navigateTo("billing");
                      }}>
                        View / print
                      </button>
                      <button className="edit-button" onClick={() => editOrder(order)}>Edit bill</button>
                      <button className="delete-button" onClick={() => deleteOrder(order)}>Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="history-empty">No bills yet. Created bills will appear here.</p>
            )}
          </section>
        ) : currentPage === "billing" ? (
          <>
            {editingOrderId && (
              <div className="editing-notice">
                <span>Editing saved bill <strong>{editingOrderId}</strong></span>
                <button className="text-button" onClick={cancelEditing}>Cancel edit</button>
              </div>
            )}
        <div className="workspace">
          <section className="menu-panel" aria-label="Menu">
            <div className="section-heading">
              <div><h2>Menu</h2><span className="muted">{menu.length} items</span></div>
              <label className="search-box">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  placeholder="Search menu"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search menu"
                />
              </label>
            </div>

            <div className="category-list" role="group" aria-label="Menu categories">
              {categories.map((name) => (
                <button
                  className={`category-button${category === name ? " active" : ""}`}
                  key={name}
                  onClick={() => setCategory(name)}
                >
                  {name}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="empty-state">Loading menu…</div>
            ) : visibleMenu.length ? (
              <div className="menu-grid">
                {visibleMenu.map((item, index) => (
                  <button className="menu-card" key={item.id} onClick={() => addToCart(item)}>
                    <span className="menu-art">
                      <img src={item.image} alt="" loading="lazy" onError={(event) => {
                        event.currentTarget.hidden = true;
                        event.currentTarget.nextElementSibling.hidden = false;
                      }} />
                      <span className={`food-icon food-${index % 5}`} aria-hidden="true" hidden>
                        {item.category === "Drinks" ? "◉" : item.category === "Desserts" ? "✦" : "✳"}
                      </span>
                    </span>
                    <span className="menu-card-body">
                      <span className="menu-name">{item.name}</span>
                      <span className="menu-description">{item.description}</span>
                      <span className="menu-price">{money(item.price)}</span>
                    </span>
                    <span className="add-icon" aria-hidden="true">+</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-state">No items match your search.</div>
            )}
          </section>

          <aside className="bill-panel" aria-label="Current bill">
            <div className="bill-heading">
              <div><h2>{editingOrderId ? "Edit bill" : "Current bill"}</h2><span className="muted">{cartItems.length} different items</span></div>
              {editingOrderId ? (
                <button className="text-button" onClick={cancelEditing}>Cancel</button>
              ) : (
                <button className="text-button" onClick={() => setCart({})} disabled={!cartItems.length}>Clear</button>
              )}
            </div>

            <div className="cart-list">
              {cartItems.length ? cartItems.map(({ item, quantity }) => (
                <div className="cart-row" key={item.id}>
                  <div className="cart-item-info">
                    <strong>{item.name}</strong>
                    <span>{money(item.price)} each</span>
                  </div>
                  <div className="quantity-control">
                    <button onClick={() => changeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}>−</button>
                    <span>{quantity}</span>
                    <button onClick={() => changeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}>+</button>
                  </div>
                  <strong className="line-total">{money(item.price * quantity)}</strong>
                </div>
              )) : (
                <div className="cart-empty">
                  <span className="cart-empty-icon">＋</span>
                  <strong>Your bill is empty</strong>
                  <span>Add menu items to get started.</span>
                </div>
              )}
            </div>

            <section className="order-details" aria-label="Order details">
              <span className="order-details-title">Order details</span>
              <div className="service-type-options" role="group" aria-label="Order type">
                <button
                  type="button"
                  className={serviceType === "dine-in" ? "selected" : ""}
                  aria-pressed={serviceType === "dine-in"}
                  onClick={() => setServiceType("dine-in")}
                >
                  Dine in
                </button>
                <button
                  type="button"
                  className={serviceType === "takeout" ? "selected" : ""}
                  aria-pressed={serviceType === "takeout"}
                  onClick={() => setServiceType("takeout")}
                >
                  Takeout
                </button>
              </div>
              {serviceType === "dine-in" && (
                <label className="order-detail-field">
                  <span>Table number <small>Optional</small></span>
                  <input
                    type="text"
                    maxLength="20"
                    placeholder="e.g. 4 or A2"
                    value={tableNumber}
                    onChange={(event) => {
                      setTableNumber(event.target.value);
                      setTableSaveMessage("");
                    }}
                  />
                </label>
              )}
              <label className="order-detail-field">
                <span>Customer mobile <small>Optional</small></span>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  value={customerMobile}
                  onChange={(event) => setCustomerMobile(event.target.value)}
                />
              </label>
              {tableSaveMessage && <span className="table-save-notice" role="status">{tableSaveMessage}</span>}
            </section>

            <div className="bill-summary">
              <div className="summary-row">
                <span>Subtotal</span><strong>{money(subtotal)}</strong>
              </div>
              <div className="summary-row tax-row">
                <label htmlFor="tax-rate">Tax <span>(%)</span></label>
                <input
                  id="tax-rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={taxRate}
                  onChange={(event) => setTaxRate(event.target.value)}
                  aria-label="Tax rate percentage"
                />
                <strong>{money(tax)}</strong>
              </div>
              <div className="summary-total"><span>Total</span><strong>{money(total)}</strong></div>
              <button className="checkout-button" onClick={createBill} disabled={!cartItems.length || submitting}>
                {submitting ? (editingOrderId ? "Saving changes…" : "Creating bill…") : editingOrderId ? "Save changes" : "Create bill"} <span aria-hidden="true">→</span>
              </button>
              {serviceType === "dine-in" && (
                <button
                  className="table-save-button"
                  onClick={saveTableOrder}
                  disabled={!cartItems.length || !tableNumber.trim() || savingTable}
                >
                  {savingTable ? "Saving table order…" : "Save open table order"}
                </button>
              )}
              <p className="secure-note">Tax is adjustable for each bill.</p>
            </div>
          </aside>
        </div>
          </>
        ) : currentPage === "product" || currentPage === "product-edit" ? (
          <section className="product-page" aria-label="Add product">
        <div className="product-form-heading">
          <div>
            <h2>{editingProductId ? "Edit menu item" : "New menu item"}</h2>
            <p>Products you add here will be available when creating a bill.</p>
          </div>
          <span className="product-count">{menu.length} menu items</span>
        </div>
        {productSuccess && (
          <div className="product-success" role="status">
            <span>{productSuccess}</span>
            <button className="text-button" onClick={() => navigateTo("products")}>View products</button>
          </div>
        )}
        <form className="product-form" onSubmit={editingProductId ? updateProduct : addProduct}>
          <label className="product-field">
            <span>Product name <small>Required</small></span>
            <input
              name="name"
              type="text"
              maxLength="80"
              placeholder="e.g. Mango Lassi"
              value={productDraft.name}
              onChange={(event) => setProductDraft({ ...productDraft, name: event.target.value })}
              required
            />
          </label>
          <label className="product-field">
            <span>Category <small>Required</small></span>
            <select
              name="category"
              value={productDraft.category}
              onChange={(event) => setProductDraft({ ...productDraft, category: event.target.value })}
              required
            >
              <option value="">Choose a category</option>
              {categoryRecords.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </label>
          <label className="product-field">
            <span>Price <small>INR · Required</small></span>
            <input
              name="price"
              type="number"
              min="0.01"
              max="1000000"
              step="0.01"
              placeholder="0.00"
              value={productDraft.price}
              onChange={(event) => setProductDraft({ ...productDraft, price: event.target.value })}
              required
            />
          </label>
          <label className="product-field product-field-wide">
            <span>Description <small>Optional</small></span>
            <textarea
              name="description"
              maxLength="160"
              rows="3"
              placeholder="Add a short description for the menu"
              value={productDraft.description}
              onChange={(event) => setProductDraft({ ...productDraft, description: event.target.value })}
            />
          </label>
          <label className="product-field product-field-wide">
            <span>Image URL or menu image path <small>Optional</small></span>
            <input
              name="image"
              type="text"
              placeholder="https://… or /menu/…"
              value={productDraft.image}
              onChange={(event) => setProductDraft({ ...productDraft, image: event.target.value })}
            />
          </label>
          <div className="product-form-actions">
            <button type="button" className="product-cancel" onClick={() => navigateTo("products")}>Cancel</button>
            <button type="submit" className="product-submit" disabled={savingProduct}>
              {savingProduct ? "Saving product…" : editingProductId ? "Save changes" : "Save product"}
            </button>
          </div>
        </form>
          </section>
        ) : null}

        {latestOrder && currentPage === "billing" && (
          <section className="latest-bill" aria-live="polite">
            <div>
              <span className="success-dot" />
              <div><strong>Bill {latestOrder.id} saved</strong><span>{new Date(latestOrder.updatedAt || latestOrder.createdAt).toLocaleString("en-IN")}</span></div>
            </div>
            <strong>{money(latestOrder.total)}</strong>
            <button className="print-button" onClick={() => window.print()}>Print receipt</button>
          </section>
        )}

        {latestOrder && currentPage === "billing" && (
          <section className="receipt print-only" aria-label="Receipt">
            <h2>Bistro POS</h2>
            <p>Restaurant bill</p>
            <hr />
            <p>Bill: {latestOrder.id}</p>
            <p>{new Date(latestOrder.createdAt).toLocaleString("en-IN")}</p>
            <p>Order type: {latestOrder.serviceType === "dine-in" ? "Dine in" : "Takeout"}</p>
            {latestOrder.tableNumber && <p>Table: {latestOrder.tableNumber}</p>}
            {latestOrder.customerMobile && <p>Customer mobile: {latestOrder.customerMobile}</p>}
            <hr />
            {latestOrder.items.map((item) => (
              <div className="receipt-row" key={item.productId}>
                <span>{item.name} × {item.quantity}</span><span>{money(item.lineTotal)}</span>
              </div>
            ))}
            <hr />
            <div className="receipt-row"><span>Subtotal</span><span>{money(latestOrder.subtotal)}</span></div>
            <div className="receipt-row"><span>Tax ({latestOrder.taxRate}%)</span><span>{money(latestOrder.tax)}</span></div>
            <div className="receipt-row receipt-total"><span>Total</span><span>{money(latestOrder.total)}</span></div>
            <p className="receipt-thanks">Thank you. Please visit again!</p>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
