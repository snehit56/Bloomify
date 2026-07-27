import { supabase } from "./supabase.js";

// ==========================
// GLOBAL VARIABLES
// ==========================

let allProducts = [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// ==========================
// LOAD PRODUCTS
// ==========================

async function loadProducts() {

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error("Supabase Error:", error);
        return;
    }

    allProducts = data || [];

    displayProducts(allProducts);

    updateCounts();
}

// ==========================
// DISPLAY PRODUCTS
// ==========================

function displayProducts(products) {

    const container = document.getElementById("productContainer");

    if (!container) return;

    container.innerHTML = "";

    if (products.length === 0) {

        container.innerHTML = `
            <div class="col-12 text-center">
                <h4>No Products Found</h4>
            </div>
        `;

        return;
    }

    products.forEach(product => {

        container.innerHTML += `

        <div class="col-lg-3 col-md-6">

            <div class="card shadow h-100">

                <img src="${product.image}"
                     class="card-img-top"
                     style="height:220px;object-fit:cover;">

                <div class="card-body">

                    <h5>${product.name}</h5>

                    <p class="text-success fw-bold">
                        ₹${product.price}
                    </p>

                    <p>${product.description ?? ""}</p>

                    <span class="badge bg-success mb-3">
                        ${product.category}
                    </span>

                    <button
                        class="btn btn-success w-100 mb-2"
                        onclick="addToCart(${product.id})">

                        🛒 Add To Cart

                    </button>

                    <button
                        class="btn btn-outline-danger w-100"
                        onclick="addToWishlist(${product.id})">

                        ❤️ Wishlist

                    </button>

                </div>

            </div>

        </div>

        `;
    });

}

// ==========================
// START
// ==========================

loadProducts();
// ==========================
// SEARCH PRODUCTS
// ==========================

function searchProducts() {

    const keyword = document
        .getElementById("searchInput")
        ?.value
        .toLowerCase() || "";

    const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(keyword)
    );

    displayProducts(filtered);
}

// ==========================
// CATEGORY FILTER
// ==========================

function filterProducts() {

    const category = document
        .getElementById("categoryFilter")
        ?.value;

    if (!category || category === "All Categories") {
        displayProducts(allProducts);
        return;
    }

    const filtered = allProducts.filter(product =>
        product.category === category
    );

    displayProducts(filtered);
}

// ==========================
// ADD TO CART
// ==========================

function addToCart(id) {

    const product = allProducts.find(p => p.id === id);

    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {

        existing.qty++;

    } else {

        cart.push({
            ...product,
            qty: 1
        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCounts();

    alert("🛒 Product added to cart!");
}

// ==========================
// ADD TO WISHLIST
// ==========================

function addToWishlist(id) {

    const product = allProducts.find(p => p.id === id);

    if (!product) return;

    const exists = wishlist.find(item => item.id === id);

    if (exists) {

        alert("❤️ Already in wishlist");
        return;

    }

    wishlist.push(product);

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    updateCounts();

    alert("❤️ Added to wishlist!");
}

// ==========================
// EVENTS
// ==========================

document
    .getElementById("searchInput")
    ?.addEventListener("keyup", searchProducts);

document
    .getElementById("categoryFilter")
    ?.addEventListener("change", filterProducts);

// HTML onclick support
window.addToCart = addToCart;
window.addToWishlist = addToWishlist;
window.searchProducts = searchProducts;
window.filterProducts = filterProducts;
// ==========================
// LOAD CART PAGE
// ==========================

function loadCart() {

    const container = document.getElementById("cartContainer");

    if (!container) return;

    container.innerHTML = "";

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="alert alert-warning">
                Your cart is empty.
            </div>
        `;
        return;
    }

    let total = 0;

    cart.forEach(item => {

        total += item.price * item.qty;

        container.innerHTML += `
        <div class="card mb-3">

            <div class="card-body">

                <div class="row align-items-center">

                    <div class="col-md-2">
                        <img src="${item.image}"
                             class="img-fluid rounded">
                    </div>

                    <div class="col-md-4">
                        <h5>${item.name}</h5>
                        <p>${item.category}</p>
                    </div>

                    <div class="col-md-2">
                        Qty : ${item.qty}
                    </div>

                    <div class="col-md-2">
                        ₹${item.price}
                    </div>

                    <div class="col-md-2">

                        <button
                            class="btn btn-danger btn-sm"
                            onclick="removeFromCart(${item.id})">

                            Remove

                        </button>

                    </div>

                </div>

            </div>

        </div>
        `;
    });

    container.innerHTML += `

        <div class="text-end mt-4">

            <h3>Total : ₹${total}</h3>

        </div>

    `;
}

// ==========================
// REMOVE FROM CART
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

    const container = document.getElementById("wishlistContainer");

    if (!container) return;

    container.innerHTML = "";

    if (wishlist.length === 0) {

        container.innerHTML = `
            <div class="alert alert-warning">
                Wishlist is empty.
            </div>
        `;

        return;
    }

    wishlist.forEach(item => {

        container.innerHTML += `

        <div class="card mb-3">

            <div class="card-body">

                <div class="row align-items-center">

                    <div class="col-md-2">

                        <img src="${item.image}"
                             class="img-fluid rounded">

                    </div>

                    <div class="col-md-4">

                        <h5>${item.name}</h5>

                    </div>

                    <div class="col-md-2">

                        ₹${item.price}

                    </div>

                    <div class="col-md-4">

                        <button
                            class="btn btn-danger btn-sm"
                            onclick="removeWishlist(${item.id})">

                            Remove

                        </button>

                    </div>

                </div>

            </div>

        </div>

        `;
    });
}

// ==========================
// REMOVE FROM WISHLIST
// ==========================

function removeWishlist(id) {

    wishlist = wishlist.filter(item => item.id !== id);

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    updateCounts();

    loadWishlist();
}

window.removeFromCart = removeFromCart;
window.removeWishlist = removeWishlist;

// Load pages automatically
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

    if (!confirm("Clear all items from cart?")) {
        return;
    }

    cart = [];

    localStorage.setItem("cart", JSON.stringify(cart));

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

    let total = cart.reduce(
        (sum, item) => sum + (item.price * item.qty),
        0
    );

    alert(
        `🎉 Order placed successfully!\n\nTotal Amount: ₹${total}`
    );

    cart = [];

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCounts();

    loadCart();
}

// ==========================
// GLOBAL FUNCTIONS
// ==========================

window.clearCart = clearCart;
window.checkout = checkout;

// ==========================
// INITIALIZE
// ==========================

updateCounts();
loadCart();
loadWishlist();
