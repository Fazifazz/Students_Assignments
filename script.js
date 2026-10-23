const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".category-btn");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const noProducts = document.getElementById("noProducts");

let products = [];
let activeCategory = "All";
let searchText = "";

let cart = JSON.parse(localStorage.getItem("shopnestCart") || "[]");

async function loadProducts() {
  productContainer.innerHTML = "<p>Loading products...</p>";

  try {
    const response = await fetch("products.json");

    if (!response.ok) {
      throw new Error("Could not load products");
    }

    products = await response.json();

    renderProducts();
  } catch (error) {
    productContainer.innerHTML =
      "<p>Unable to load products. Please use Live Server.</p>";
    console.error(error);
  }
}

function renderProducts() {
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  productContainer.innerHTML = "";

  noProducts.hidden = filteredProducts.length !== 0;

  filteredProducts.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = document.createElement("img");
    image.src = product.imageUrl;
    image.alt = product.name;
    image.loading = "lazy";
    image.onerror = () => {
      image.alt = "Image unavailable";
    };

    const name = document.createElement("h3");
    name.textContent = product.name;

    const category = document.createElement("p");
    category.textContent = product.category;

    const rating = document.createElement("p");
    rating.textContent = `⭐ ${product.rating}`;

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = `₹${product.price}`;

    const originalPrice = document.createElement("span");
    originalPrice.className = "original-price";
    originalPrice.textContent = `₹${product.originalPrice}`;
    price.appendChild(originalPrice);

    const addButton = document.createElement("button");
    addButton.className = "add-btn";
    addButton.textContent = "Add to Cart";
    addButton.addEventListener("click", () => addToCart(product.id));

    card.append(image, name, category, rating, price, addButton);
    productContainer.appendChild(card);
  });
}

searchInput.addEventListener("input", event => {
  searchText = event.target.value.trim();
  renderProducts();
});

categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;

    categoryButtons.forEach(item => {
      item.classList.toggle("active", item === button);
    });

    renderProducts();
  });
});

function saveCart() {
  localStorage.setItem("shopnestCart", JSON.stringify(cart));
  renderCart();
}

function addToCart(productId) {
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = products.find(item => item.id === productId);

    if (!product) return;

    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
}

function changeQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== productId);
  }

  saveCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
}

function renderCart() {
  cartItems.innerHTML = "";

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity, 0
  );

  cartCount.textContent = totalItems;

  let totalPrice = 0;

  cart.forEach(item => {
    totalPrice += item.price * item.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";

    const name = document.createElement("span");
    name.textContent = `${item.name} — ₹${item.price}`;

    const controls = document.createElement("div");

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.addEventListener("click", () =>
      changeQuantity(item.id, -1)
    );

    const quantity = document.createElement("span");
    quantity.textContent = ` ${item.quantity} `;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.addEventListener("click", () =>
      changeQuantity(item.id, 1)
    );

    const remove = document.createElement("button");
    remove.className = "remove-btn";
    remove.textContent = "Remove";
    remove.addEventListener("click", () =>
      removeFromCart(item.id)
    );

    controls.append(minus, quantity, plus, remove);
    row.append(name, controls);
    cartItems.appendChild(row);
  });

  cartTotal.textContent = totalPrice.toFixed(2);
}

document.getElementById("cartButton").addEventListener("click", () => {
  document.getElementById("cartSection").scrollIntoView({
    behavior: "smooth"
  });
});

renderCart();
loadProducts();