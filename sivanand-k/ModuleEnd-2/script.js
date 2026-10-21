let products = [];
let cart = [];
let selectedCategory = "All";

const productList = document.getElementById("productList");
const categoryButtons = document.getElementById("categoryButtons");
const searchInput = document.getElementById("searchInput");
const noProducts = document.getElementById("noProducts");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

// Load products

async function loadProducts() {
  try {
    const response = await fetch("products.json");

    if (!response.ok) {
      throw new Error("Products file was not found");
    }

    products = await response.json();

    createCategoryButtons();

    displayProducts();

    updateCart();
  } catch (error) {
    console.log(error);

    productList.innerHTML = "<p>Unable to load products.</p>";
  }
}

// Create category buttons

function createCategoryButtons() {
  const categories = ["All", "Electronics", "Clothing", "Footwear", "Books"];

  categoryButtons.innerHTML = "";

  categories.forEach(function (category) {
    const button = document.createElement("button");

    button.textContent = category;

    button.className = "category-filter-button";

    if (category === selectedCategory) {
      button.classList.add("active");
    }

    button.addEventListener("click", function () {
      selectedCategory = category;

      createCategoryButtons();

      displayProducts();
    });

    categoryButtons.appendChild(button);
  });
}

// Display products

function displayProducts() {
  const searchValue = searchInput.value.toLowerCase().trim();

  const filteredProducts = products.filter(function (product) {
    const matchesSearch = product.name.toLowerCase().includes(searchValue);

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  productList.innerHTML = "";

  if (filteredProducts.length === 0) {
    noProducts.style.display = "block";

    return;
  }

  noProducts.style.display = "none";

  filteredProducts.forEach(function (product) {
    const column = document.createElement("div");

    column.className = "col-12 col-sm-6 col-lg-4";

    const card = document.createElement("div");

    card.className = "product-card";

    card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.imageUrl}"
                    alt="${product.name}"
                >

            </div>

            <div class="product-info">

                <h3>${product.name}</h3>

                <div class="rating">

                    ${getStars(product.rating)}

                    <span>
                        (${product.rating})
                    </span>

                </div>

                <div class="price">

                    <span class="original-price">
                        ₹${product.originalPrice.toLocaleString("en-IN")}
                    </span>

                    <span class="discount-price">
                        ₹${product.price.toLocaleString("en-IN")}
                    </span>

                </div>

                <button
                    class="add-cart"
                    data-id="${product.id}"
                >
                    Add to Cart
                </button>

            </div>

        `;

    column.appendChild(card);

    productList.appendChild(column);
  });

  const addButtons = document.querySelectorAll(".add-cart");

  addButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const productId = Number(button.dataset.id);

      addToCart(productId);
    });
  });
}

// Create rating stars

function getStars(rating) {
  let stars = "";

  const roundedRating = Math.round(rating);

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars += "★";
    } else {
      stars += "☆";
    }
  }

  return stars;
}

// Add product to cart

function addToCart(productId) {
  const existingItem = cart.find(function (item) {
    return item.id === productId;
  });

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: productId,
      quantity: 1,
    });
  }

  saveCart();

  updateCart();
}

// Increase quantity

function increaseQuantity(productId) {
  const item = cart.find(function (item) {
    return item.id === productId;
  });

  if (item) {
    item.quantity++;
  }

  saveCart();

  updateCart();
}

// Decrease quantity

function decreaseQuantity(productId) {
  const item = cart.find(function (item) {
    return item.id === productId;
  });

  if (!item) {
    return;
  }

  item.quantity--;

  if (item.quantity <= 0) {
    cart = cart.filter(function (item) {
      return item.id !== productId;
    });
  }

  saveCart();

  updateCart();
}

// Remove product from cart

function removeFromCart(productId) {
  cart = cart.filter(function (item) {
    return item.id !== productId;
  });

  saveCart();

  updateCart();
}

// Update cart

function updateCart() {
  displayCart();

  updateCartCount();
}

// Display cart

function displayCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';

    cartTotal.textContent = "Total: ₹0";

    return;
  }

  let total = 0;

  cart.forEach(function (item) {
    const product = products.find(function (product) {
      return product.id === item.id;
    });

    if (!product) {
      return;
    }

    const itemTotal = product.price * item.quantity;

    total += itemTotal;

    const cartProduct = document.createElement("div");

    cartProduct.className = "cart-product";

    cartProduct.innerHTML = `

            <img
                src="${product.imageUrl}"
                alt="${product.name}"
            >

            <div class="cart-product-info">

                <h4>${product.name}</h4>

                <p>
                    ₹${product.price.toLocaleString("en-IN")}
                </p>

            </div>

            <div class="quantity-buttons">

                <button
                    class="decrease-button"
                    data-id="${product.id}"
                >
                    -
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    class="increase-button"
                    data-id="${product.id}"
                >
                    +
                </button>

            </div>

            <button
                class="remove-button"
                data-id="${product.id}"
            >
                Remove
            </button>

        `;

    cartItems.appendChild(cartProduct);
  });

  cartTotal.textContent = "Total: ₹" + total.toLocaleString("en-IN");

  addCartEvents();
}

// Cart buttons

function addCartEvents() {
  const increaseButtons = document.querySelectorAll(".increase-button");

  increaseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const productId = Number(button.dataset.id);

      increaseQuantity(productId);
    });
  });

  const decreaseButtons = document.querySelectorAll(".decrease-button");

  decreaseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const productId = Number(button.dataset.id);

      decreaseQuantity(productId);
    });
  });

  const removeButtons = document.querySelectorAll(".remove-button");

  removeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const productId = Number(button.dataset.id);

      removeFromCart(productId);
    });
  });
}

// Update cart count

function updateCartCount() {
  let count = 0;

  cart.forEach(function (item) {
    count += item.quantity;
  });

  cartCount.textContent = count;
}

// Save cart to localStorage

function saveCart() {
  localStorage.setItem("shopnestCart", JSON.stringify(cart));
}

// Load cart from localStorage

function loadCart() {
  const savedCart = localStorage.getItem("shopnestCart");

  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (error) {
      cart = [];
    }
  }
}

// Live search

searchInput.addEventListener("input", function () {
  displayProducts();
});

// Category cards

const categoryLinks = document.querySelectorAll(".category-link");

categoryLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    selectedCategory = link.dataset.category;

    createCategoryButtons();

    displayProducts();
  });
});

// Newsletter

const newsletterForm = document.getElementById("newsletterForm");

newsletterForm.addEventListener("submit", function (event) {
  event.preventDefault();

  alert("Thank you for subscribing!");

  newsletterForm.reset();
});

// Start the application

loadCart();

loadProducts();
