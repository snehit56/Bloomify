import { supabase } from "./supabase.js";

// ==========================
// GLOBAL VARIABLES
// ==========================

let products = [];

let filteredProducts = [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// ==========================
// LOAD PRODUCTS
// ==========================

async function loadProducts() {

    const loading = document.getElementById("loading");

    if (loading) {
        loading.style.display = "block";
    }

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (loading) {
        loading.style.display = "none";
    }

    if (error) {
        console.error(error);
        return;
    }

    products = data || [];
    filteredProducts = [...products];

    displayProducts(filteredProducts);

    updateCounts();
}

// ==========================
// DISPLAY PRODUCTS
// ==========================

function displayProducts(list) {

    const container =
        document.getElementById("productList");

    if (!container) return;

    container.innerHTML = "";

    const noProducts =
        document.getElementById("noProducts");

    if (list.length === 0) {

        if (noProducts) {
            noProducts.style.display = "block";
        }

        return;
    }

    if (noProducts) {
        noProducts.style.display = "none";
    }

    list.forEach(product => {

        container.innerHTML += `

<div class="col-md-4">

<div class="card product-card h-100">

<img
src="${product.image}"
class="card-img-top"
alt="${product.name}">

<div class="card-body">

<h5>${product.name}</h5>

<p>${product.description ?? ""}</p>

<h4 class="price">

₹${product.price}

</h4>

<div class="d-flex gap-2 mt-3">

<button
class="btn btn-success w-100"
onclick="addToCart(${product.id})">

🛒 Cart

</button>

<button
class="btn btn-outline-danger"
onclick="addToWishlist(${product.id})">

❤

</button>

</div>

</div>

</div>

</div>

`;

    });

}

loadProducts();
// ==========================
// SEARCH PRODUCTS
// ==========================

function searchProducts() {

    const input =
        document.getElementById("searchInput");

    if (!input) return;

    const keyword =
        input.value.toLowerCase();

    filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(keyword)
    );

    filterProducts();
}

// ==========================
// FILTER PRODUCTS
// ==========================

function filterProducts() {

    const select =
        document.getElementById("categoryFilter");

    let list = [...filteredProducts];

    if (select && select.value !== "All") {

        list = list.filter(product =>
            product.category === select.value
        );

    }

    displayProducts(list);

}

// ==========================
// ADD TO CART
// ==========================

function addToCart(id) {

    const product =
        products.find(p => p.id === id);

    if (!product) return;

    const existing =
        cart.find(item => item.id === id);

    if (existing) {

        existing.qty++;

    } else {

        cart.push({
            ...product,
            qty: 1
        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCounts();

    alert("🛒 Added to Cart!");

}

// ==========================
// ADD TO WISHLIST
// ==========================

function addToWishlist(id) {

    const product =
        products.find(p => p.id === id);

    if (!product) return;

    const exists =
        wishlist.find(item => item.id === id);

    if (exists) {

        alert("Already in Wishlist");

        return;

    }

    wishlist.push(product);

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    updateCounts();

    alert("❤️ Added to Wishlist");

}

// ==========================
// EVENTS
// ==========================

document
.getElementById("searchInput")
?.addEventListener("keyup",
searchProducts);

document
.getElementById("categoryFilter")
?.addEventListener("change",
filterProducts);

// ==========================
// EXPORT
// ==========================

window.addToCart = addToCart;
window.addToWishlist = addToWishlist;
// ==========================
// LOAD CART
// ==========================

function loadCart() {

    const cartContainer = document.getElementById("cartItems");
    const totalElement = document.getElementById("cartTotal");

    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="alert alert-info">
                Your cart is empty.
            </div>
        `;

        if (totalElement) totalElement.textContent = "₹0";

        return;
    }

    cart.forEach(item => {

        total += item.price * item.qty;

        cartContainer.innerHTML += `

<div class="cart-item">

<h5>${item.name}</h5>

<p>Price : ₹${item.price}</p>

<p>Quantity : ${item.qty}</p>

<button
class="btn btn-danger btn-sm"
onclick="removeFromCart(${item.id})">

Remove

</button>

</div>

`;

    });

    if (totalElement) {
        totalElement.textContent = `₹${total}`;
    }

}

// ==========================
// REMOVE CART ITEM
// ==========================

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCounts();

    loadCart();

}

// ==========================
// LOAD WISHLIST
// ==========================

function loadWishlist() {

    const wishlistContainer =
        document.getElementById("wishlistItems");

    if (!wishlistContainer) return;

    wishlistContainer.innerHTML = "";

    if (wishlist.length === 0) {

        wishlistContainer.innerHTML = `
            <div class="alert alert-warning">
                Wishlist is empty.
            </div>
        `;

        return;
    }

    wishlist.forEach(item => {

        wishlistContainer.innerHTML += `

<div class="cart-item">

<h5>${item.name}</h5>

<p>Price : ₹${item.price}</p>

<button
class="btn btn-danger btn-sm"
onclick="removeWishlist(${item.id})">

Remove

</button>

</div>

`;

    });

}

// ==========================
// REMOVE WISHLIST ITEM
// ==========================

function removeWishlist(id) {

    wishlist = wishlist.filter(
        item => item.id !== id
    );

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    updateCounts();

    loadWishlist();

}

// ==========================
// EXPORT
// ==========================

window.removeFromCart = removeFromCart;
window.removeWishlist = removeWishlist;

// ==========================
// INITIAL LOAD
// ==========================

loadCart();
loadWishlist();
// ==========================
// UPDATE COUNTS
// ==========================

function updateCounts() {

    const cartCount = document.getElementById("cartCount");
    const wishlistCount = document.getElementById("wishlistCount");

    if (cartCount) {
        cartCount.textContent = cart.reduce(
            (total, item) => total + item.qty,
            0
        );
    }

    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }

}

// ==========================
// CLEAR CART
// ==========================

function clearCart() {

    if (!confirm("Are you sure you want to clear the cart?")) {
        return;
    }

    cart = [];

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCounts();

    loadCart();

    alert("🗑️ Cart cleared successfully!");

}

// ==========================
// CHECKOUT
// ==========================

function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;

    }

    const total = cart.reduce(
        (sum, item) => sum + (item.price * item.qty),
        0
    );

    alert(
        `🎉 Order placed successfully!\n\nTotal Amount: ₹${total}`
    );

    cart = [];

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCounts();

    loadCart();

}

// ==========================
// EXPORT
// ==========================

window.clearCart = clearCart;
window.checkout = checkout;

// ==========================
// INITIALIZE
// ==========================

updateCounts();

loadCart();

loadWishlist();