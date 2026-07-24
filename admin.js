import { supabase } from "./supabase.js";

// =====================================
// BLOOMIFY ADMIN PANEL
// =====================================

// ---------- Dashboard ----------
async function loadDashboard() {

    // Total Products
    const { count: totalProducts } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

    document.getElementById("totalProducts").textContent =
        totalProducts || 0;

    // Orders
    const { data: orders, count: totalOrders } = await supabase
        .from("orders")
        .select("*", { count: "exact" });

    document.getElementById("totalOrders").textContent =
        totalOrders || 0;

    // Pending Orders
    const pending =
        orders?.filter(order => order.status === "Pending").length || 0;

    document.getElementById("pendingOrders").textContent =
        pending;

    // Total Sales
    let totalSales = 0;

    orders?.forEach(order => {
        totalSales += Number(order.total || 0);
    });

    document.getElementById("totalSales").textContent =
        "₹" + totalSales.toFixed(2);
}

// =====================================
// Add Product
// =====================================
// Image Preview
document.getElementById("productImage").addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        const img = document.getElementById("previewImage");

        img.src = e.target.result;

        img.style.display = "block";

    };

    reader.readAsDataURL(file);

});
window.addProduct = async function () {

    const name =
        document.getElementById("productName").value.trim();

    const price =
        Number(document.getElementById("productPrice").value);

    const category =
        document.getElementById("productCategory").value;

    const imageFile =
    document.getElementById("productImage").files[0];

if (!imageFile) {

    alert("Please select an image.");

    return;

}

    const description =
        document.getElementById("productDescription").value.trim();
// Upload Image to Supabase Storage
const fileName = Date.now() + "_" + imageFile.name;

const { error: uploadError } = await supabase.storage
  .from("products")
  .upload(fileName, imageFile);

if (uploadError) {
  alert(uploadError.message);
  return;
}

const { data: imageData } = supabase.storage
  .from("products")
  .getPublicUrl(fileName);

const image = imageData.publicUrl;
    if (!name || !price) {
        alert("Please fill all required fields.");
        return;
    }

    const { error } = await supabase
        .from("products")
        .insert([
            {
                name,
                price,
                category,
                image,
                description
            }
        ]);

    if (error) {
        alert(error.message);
        return;
    }

    alert("✅ Product Added Successfully");

    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productImage").value = "";
    document.getElementById("productDescription").value = "";

    loadProducts();
    loadDashboard();
};
// =====================================
// Load Products
// =====================================

async function loadProducts() {

    const keyword = document
        .getElementById("productSearch")
        ?.value
        .trim()
        .toLowerCase() || "";

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    const table = document.getElementById("productTable");
    table.innerHTML = "";

    const products = data.filter(product =>
        product.name.toLowerCase().includes(keyword)
    );

    if (products.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    No Products Found
                </td>
            </tr>
        `;

        return;
    }

    products.forEach(product => {

        table.innerHTML += `

        <tr>

            <td>${product.id}</td>

            <td>
                <img
                    src="${product.image}"
                    width="70"
                    height="70"
                    style="object-fit:cover;border-radius:10px;">
            </td>

            <td>${product.name}</td>

            <td>${product.category}</td>

            <td>₹${product.price}</td>

            <td>${product.description || ""}</td>

            <td>

                <button
                    class="btn btn-warning btn-sm me-1"
                    onclick="editProduct(${product.id})">

                    Edit

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteProduct(${product.id})">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}

// =====================================
// Edit Product
// =====================================

window.editProduct = async function(id) {

    const { data, error } = await supabase

        .from("products")

        .select("*")

        .eq("id", id)

        .single();

    if (error) {

        alert(error.message);

        return;

    }

    const name = prompt("Plant Name", data.name);

    if (name === null) return;

    const price = prompt("Price", data.price);

    if (price === null) return;

    const category = prompt("Category", data.category);

    if (category === null) return;

    const image = prompt("Image URL", data.image);

    if (image === null) return;

    const description = prompt(
        "Description",
        data.description || ""
    );

    if (description === null) return;

    const { error: updateError } = await supabase

        .from("products")

        .update({

            name,

            price: Number(price),

            category,

            image,

            description

        })

        .eq("id", id);

    if (updateError) {

        alert(updateError.message);

        return;

    }

    alert("✅ Product Updated");

    loadProducts();

    loadDashboard();

};

// =====================================
// Delete Product
// =====================================

window.deleteProduct = async function(id) {

    if (!confirm("Delete this product?"))
        return;

    const { error } = await supabase

        .from("products")

        .delete()

        .eq("id", id);

    if (error) {

        alert(error.message);

        return;

    }

    alert("Product Deleted");

    loadProducts();

    loadDashboard();

};
// =====================================
// Load Orders
// =====================================

async function loadOrders() {

    const keyword = document
        .getElementById("searchInput")
        ?.value
        .trim()
        .toLowerCase() || "";

    const statusFilter = document
        .getElementById("statusFilter")
        ?.value || "";

    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const table = document.getElementById("ordersTable");
    table.innerHTML = "";

    const orders = data.filter(order => {

        const customer =
            (order.customerName || "").toLowerCase();

        const mobile =
            String(order.mobile || "");

        const searchMatch =
            customer.includes(keyword) ||
            mobile.includes(keyword);

        const statusMatch =
            statusFilter === "" ||
            order.status === statusFilter;

        return searchMatch && statusMatch;

    });

    if (orders.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="8" class="text-center">
                No Orders Found
            </td>
        </tr>
        `;

        return;
    }

    orders.forEach(order => {

        table.innerHTML += `

<tr>

<td>BLM-${order.id}</td>

<td>${order.customerName}</td>

<td>${order.mobile}</td>

<td>₹${order.total}</td>

<td>${order.paymentMethod}</td>

<td>

<select
class="form-select form-select-sm"
onchange="updateOrderStatus(${order.id}, this.value)">

<option value="Pending"
${order.status=="Pending"?"selected":""}>
Pending
</option>

<option value="Confirmed"
${order.status=="Confirmed"?"selected":""}>
Confirmed
</option>

<option value="Shipped"
${order.status=="Shipped"?"selected":""}>
Shipped
</option>

<option value="Delivered"
${order.status=="Delivered"?"selected":""}>
Delivered
</option>

<option value="Cancelled"
${order.status=="Cancelled"?"selected":""}>
Cancelled
</option>

</select>

</td>

<td>

${order.orderDate
? new Date(order.orderDate).toLocaleDateString()
: ""}

</td>

<td>

<button
class="btn btn-danger btn-sm"
onclick="deleteOrder(${order.id})">

Delete

</button>

</td>

</tr>

`;

    });

}

// =====================================
// Update Order Status
// =====================================

window.updateOrderStatus = async function(id, status) {

    const { error } = await supabase

        .from("orders")

        .update({

            status: status

        })

        .eq("id", id);

    if (error) {

        alert(error.message);

        return;

    }

    loadOrders();

    loadDashboard();

};

// =====================================
// Delete Order
// =====================================

window.deleteOrder = async function(id) {

    if (!confirm("Delete this order?"))
        return;

    const { error } = await supabase

        .from("orders")

        .delete()

        .eq("id", id);

    if (error) {

        alert(error.message);

        return;

    }

    alert("Order Deleted");

    loadOrders();

    loadDashboard();

};
// =====================================
// Utility Functions
// =====================================

// Refresh all dashboard data
async function refreshDashboard() {

    await loadDashboard();
    await loadProducts();
    await loadOrders();

}

// =====================================
// Auto Refresh Every 30 Seconds
// =====================================

setInterval(() => {

    refreshDashboard();

}, 30000);

// =====================================
// Initial Load
// =====================================

document.addEventListener("DOMContentLoaded", async () => {

    try {

        await loadDashboard();

        await loadProducts();

        await loadOrders();

        console.log("✅ Bloomify Admin Panel Loaded");

    } catch (error) {

        console.error(error);

        alert("Error loading dashboard.");

    }

});

// =====================================
// Make Functions Available in HTML
// =====================================

window.loadDashboard = loadDashboard;
window.loadProducts = loadProducts;
window.loadOrders = loadOrders;

// =====================================
// End of File
// =====================================
