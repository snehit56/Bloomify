/* ===================================
   BLOOMIFY PREMIUM SCRIPT.JS
=================================== */

// Local Storage

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

/* ===================================
   CART FUNCTIONS
=================================== */

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartBadge() {

    const badge = document.getElementById("cartCount");

    if (!badge) return;

    let total = 0;

    cart.forEach(item => total += item.qty);

    badge.innerHTML = total;
}

function addToCart(name, price) {

    let item = cart.find(p => p.name === name);

    if (item) {

        item.qty++;

    } else {

        cart.push({
            name: name,
            price: price,
            qty: 1
        });

    }

    saveCart();

    updateCartBadge();

    alert(name + " added to cart.");
}

function removeFromCart(index) {

    cart.splice(index,1);

    saveCart();

    location.reload();

}

function increaseQty(index){

    cart[index].qty++;

    saveCart();

    location.reload();

}

function decreaseQty(index){

    if(cart[index].qty>1){

        cart[index].qty--;

    }else{

        cart.splice(index,1);

    }

    saveCart();

    location.reload();

}

/* ===================================
   WISHLIST
=================================== */

function saveWishlist(){

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

}

function addWishlist(name,price){

    let found =
    wishlist.find(item=>item.name===name);

    if(found){

        alert("Already in Wishlist");

        return;

    }

    wishlist.push({

        name:name,
        price:price

    });

    saveWishlist();

    alert(name+" added to wishlist");

}

function removeWishlist(index){

    wishlist.splice(index,1);

    saveWishlist();

    location.reload();

}

/* ===================================
   SEARCH
=================================== */

function searchProducts(){

    let input =
    document.getElementById("searchInput");

    if(!input) return;

    let filter =
    input.value.toUpperCase();

    let products =
    document.querySelectorAll(".product");

    products.forEach(product=>{

        let text =
        product.innerText.toUpperCase();

        if(text.indexOf(filter)>-1){

            product.style.display="block";

        }else{

            product.style.display="none";

        }

    });

}

document.addEventListener("DOMContentLoaded",function(){

    updateCartBadge();

});
/* ===================================
   COUPON CODE
=================================== */

let discount = 0;

function applyCoupon() {

    const coupon = document.getElementById("coupon");

    if (!coupon) return;

    const code = coupon.value.trim().toUpperCase();

    if (code === "BLOOM10") {

        discount = 10;
        alert("🎉 10% Discount Applied");

    } else if (code === "PLANT20") {

        discount = 20;
        alert("🎉 20% Discount Applied");

    } else {

        discount = 0;
        alert("❌ Invalid Coupon Code");

    }

    if (typeof renderCart === "function") {

        renderCart();

    }

}

/* ===================================
   PAYMENT
=================================== */

function placeOrder() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;

    }

    const name = document.getElementById("name")?.value || "";
    const mobile = document.getElementById("mobile")?.value || "";
    const address = document.getElementById("address")?.value || "";

    if (name === "" || mobile === "" || address === "") {

        alert("Please fill customer details.");

        return;

    }

    let total = 0;

    cart.forEach(item => {

        total += item.price * item.qty;

    });

    let gst = total * 0.05;
    let delivery = 50;

    let finalTotal = total + gst + delivery;

    if (discount > 0) {

        finalTotal -= (finalTotal * discount / 100);

    }

    const paymentMethod =
    document.querySelector(
    'input[name="payment"]:checked'
    )?.value || "COD";

    let orders =
    JSON.parse(localStorage.getItem("orders")) || [];

    const order = {

        id: "BLM" + Date.now(),

        name,

        mobile,

        address,

        payment: paymentMethod,

        items: cart,

        total: finalTotal,

        date: new Date().toLocaleString()

    };

    orders.push(order);

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    localStorage.setItem(
        "orderId",
        order.id
    );

    localStorage.removeItem("cart");

    alert("🎉 Order Placed Successfully!");

    window.location.href = "success.html";

}

/* ===================================
   TRACK ORDER
=================================== */

function showOrderId() {

    const id = document.getElementById("orderId");

    if (!id) return;

    id.innerHTML =
    localStorage.getItem("orderId") || "-";

}

/* ===================================
   DARK MODE
=================================== */

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem(
            "theme",
            "dark"
        );

    } else {

        localStorage.setItem(
            "theme",
            "light"
        );

    }

}

window.addEventListener("load", () => {

    if (localStorage.getItem("theme") === "dark") {

        document.body.classList.add("dark-mode");

    }

});

/* ===================================
   NEWSLETTER
=================================== */

function subscribeNewsletter() {

    const email =
    document.getElementById("newsletterEmail");

    if (!email) return;

    if (email.value === "") {

        alert("Enter Email Address");

        return;

    }

    alert("✅ Thank You For Subscribing!");

    email.value = "";

}

/* ===================================
   SCROLL TO TOP
=================================== */

window.onscroll = function () {

    const btn =
    document.getElementById("scrollTop");

    if (!btn) return;

    if (window.scrollY > 300) {

        btn.style.display = "block";

    } else {

        btn.style.display = "none";

    }

};

function scrollToTop() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}
/* ===================================
   CART TOTAL
=================================== */

function getCartTotal() {

    let total = 0;

    cart.forEach(item => {

        total += item.price * item.qty;

    });

    return total;

}

/* ===================================
   PRODUCT RATING
=================================== */

function rateProduct(productName, stars) {

    let ratings =
        JSON.parse(localStorage.getItem("ratings")) || {};

    ratings[productName] = stars;

    localStorage.setItem(
        "ratings",
        JSON.stringify(ratings)
    );

    alert("⭐ Thank you for rating!");

}

/* ===================================
   LOGIN VALIDATION
=================================== */

function loginUser(email, password) {

    const user =
        JSON.parse(localStorage.getItem("user"));

    if (!user) {

        alert("Please Register First");

        return false;

    }

    if (
        email === user.email &&
        password === user.password
    ) {

        alert("✅ Login Successful");

        localStorage.setItem("loggedIn", "true");

        return true;

    }

    alert("❌ Invalid Email or Password");

    return false;

}

/* ===================================
   LOGOUT
=================================== */

function logoutUser() {

    localStorage.removeItem("loggedIn");

    alert("Logged Out Successfully");

    window.location.href = "login.html";

}

/* ===================================
   WHATSAPP ORDER
=================================== */

function orderOnWhatsApp() {

    if (cart.length === 0) {

        alert("Your Cart is Empty");

        return;

    }

    let message = "🌿 *Bloomify Order*%0A%0A";

    cart.forEach(item => {

        message +=
            "• " +
            item.name +
            " x " +
            item.qty +
            " = ₹" +
            (item.qty * item.price) +
            "%0A";

    });

    message +=
        "%0A💰 Total : ₹" +
        getCartTotal();

    window.open(

        "https://wa.me/919764446458?text=" +
        message,

        "_blank"

    );

}

/* ===================================
   LOADER
=================================== */

function showLoader() {

    const loader =
        document.getElementById("loader");

    if (loader) {

        loader.style.display = "block";

    }

}

function hideLoader() {

    const loader =
        document.getElementById("loader");

    if (loader) {

        loader.style.display = "none";

    }

}

/* ===================================
   TOAST MESSAGE
=================================== */

function showToast(message) {

    alert(message);

}

/* ===================================
   CURRENT YEAR
=================================== */

window.addEventListener("DOMContentLoaded", () => {

    const year =
        document.getElementById("currentYear");

    if (year) {

        year.innerHTML =
            new Date().getFullYear();

    }

});

/* ===================================
   PAGE LOADED
=================================== */

console.log("🌿 Bloomify Premium Website Loaded Successfully");