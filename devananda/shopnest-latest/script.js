let products =[];

async function loadProducts() {
    const response = await
    fetch("products.json");
    products = await response.json();

    renderProducts(products);
}

loadProducts();

let cart =
JSON.parse(localStorage.getItem("cart")) || [];
  
let cartCount =  
cart.reduce(function(total, item) {
    return total + item.quantity;}, 0);

    document.querySelector("#cartCount").textContent = cartCount;

const productContainer = document.querySelector("#products .row");


function renderProducts(productsList) {

    productContainer.innerHTML ="";
    if (productsList.length === 0) {
        productContainer.innerHTML = `
               <div class="col-12
               text-center">
               <h4>No products found</h4>
            </div>
            `;
            return;
    }

    productsList.forEach(function(product){

    const productCard = document.createElement("div");

    productCard.className = "col-md-4";

    productCard.innerHTML = `
        <div class="card h-100">
            <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">

            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>

                <p class="card-text">
                    <s>₹${product.originalPrice}</s>
                    <strong> ₹${product.price}</strong>
                </p>

                <p>⭐ ${product.rating}</p>

                <button class="btn btn-primary"
                    onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;

    productContainer.appendChild(productCard);
});
}


const searchInput =
document.querySelector("#searchInput");

const cartButton =
document.querySelector("#cartButton");

const cartItems =
document.querySelector("#cartItems");
const categoryLinks =
document.querySelectorAll("[data-category]");

let selectedCategory ="";
function filterProducts() {
    const searchText =
    searchInput.value.toLowerCase();

    const filteredProducts =
products.filter(function(product) {
    const matchesSearch =

product.name.toLowerCase().includes(
    searchText);

    const matchesCategory =
       selectedCategory === ""
||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    renderProducts(filteredProducts);
}

categoryLinks.forEach(function(categoryLink) {

    categoryLink.addEventListener("click",function(event) {
event.preventDefault();

         selectedCategory =
        categoryLink.dataset.category;

         filterProducts()
        
    });
});

searchInput.addEventListener("input",filterProducts);



function addToCart(productsId) {
    const product = 
products.find(function(product)
 {
    return product.id ===
    productsId;
});

   const existingProduct =
   cart.find(function(item) {
    return item.id ===
    productsId;
   });

   if (existingProduct) {
    existingProduct.quantity++;
   }else {
    product.quantity = 1;
    cart.push(product);
   }
    
    cartCount++;
localStorage.setItem("cart",JSON.stringify(cart));
    document.querySelector("#cartCount")
    .textContent = cartCount;

}

cartButton.addEventListener("click",function() {
    renderCart();
});

function renderCart() {
    cartItems.innerHTML = "";
    let total =0;

    cart.forEach(function(item) {
        total += item.price * item.quantity;
        cartItems.innerHTML += `

            <div>
                <h5>${item.name}</h5>
                <p>₹${item.price} × ${item.quantity}</p>
        
        
        <button onclick="increaseQuantity(${item.id})">+</button>
        <button onclick="decreaseQuantity(${item.id})">-</button>
        <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
    });

    cartItems.innerHTML += `
    <h4>Total: ₹${total}</h4>
    `;
}
renderCart();

function increaseQuantity(productId) {
    const item = cart.find(function(product) {
        return product.id === productId;
    });

    item.quantity++;

    cartCount++;
    localStorage.setItem("cart",JSON.stringify(cart));

    document.querySelector("#cartCount").textContent = cartCount;

    renderCart();
}
function decreaseQuantity(productId) {
    const item = cart.find(function(product) {
        return product.id === productId;
    });

    if (item.quantity > 1) {
        item.quantity--;
        cartCount--;

        document.querySelector("#cartCount").textContent = cartCount;
        
        localStorage.setItem("cart",JSON.stringify(cart));
        renderCart();
    }
}
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(function(product) {
        return product.id === productId;
    });

    cartCount -= cart[itemIndex].quantity;

    cart.splice(itemIndex, 1);

    localStorage.setItem("cart",JSON.stringify(cart));

    document.querySelector("#cartCount").textContent = cartCount;

    renderCart();
}