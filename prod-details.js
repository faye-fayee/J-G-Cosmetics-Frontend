let thumbnails = document.getElementsByClassName("thumbnail");
let activeImages = document.getElementsByClassName("active");

// =============================
// 🖼️ Handle Image Thumbnails
// =============================
for (var i = 0; i < thumbnails.length; i++) {
    thumbnails[i].addEventListener("mouseover", function () {
        if (activeImages.length > 0) {
            activeImages[0].classList.remove("active");
        }
        this.classList.add("active");
        document.getElementById("featured").src = this.src;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    updateCartCounter(document.querySelector(".cart-counter"));
    renderCartItems(); // ✅ Show cart items on page load
});


document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    try {
        const response = await fetch("products.json");
        const products = await response.json();
        const product = products.find((p) => p.id == productId);

        if (product) {
            document.querySelector(".product-title").innerText = product.name;
            document.querySelector(".product-price").innerText = `₱${product.price}`;
            document.querySelector(".product-tagline").innerText = product.tagline;
            document.querySelector(".product-description").innerText = product.description;

            const featuredImg = document.getElementById("featured");
            featuredImg.src = product.images[0];

            const slider = document.getElementById("slider");
            slider.innerHTML = "";
            product.images.forEach((imgSrc, index) => {
                const img = document.createElement("img");
                img.src = imgSrc;
                img.classList.add("thumbnail");
                if (index === 0) img.classList.add("active");
                img.addEventListener("mouseover", function () {
                    featuredImg.src = imgSrc;
                    document.querySelector(".thumbnail.active")?.classList.remove("active");
                    img.classList.add("active");
                });
                slider.appendChild(img);
            });

            // =============================
            // 🎨 Shades Section
            // =============================
            const shadeContainer = document.querySelector(".shades-container");
            if (product.shades && product.shades.length > 0) {
                shadeContainer.innerHTML = "<h4>Shades</h4>";
                product.shades.forEach((shade) => {
                    const button = document.createElement("button");
                    button.innerText = shade;
                    button.classList.add("shade-btn");

                    // Shade button click event
                    button.addEventListener("click", (event) => {
                        document.querySelectorAll(".shade-btn").forEach((btn) => btn.classList.remove("selected"));
                        event.target.classList.add("selected");
                    });

                    shadeContainer.appendChild(button);
                });
                shadeContainer.style.display = "block";
            } else {
                shadeContainer.innerHTML = "";
                shadeContainer.style.display = "none";
            }

            // =============================
            // 🛒 Add to Cart Button - Fixed
            // =============================
            const addToCartBtn = document.querySelector(".add-to-cart-btn");
            addToCartBtn.replaceWith(addToCartBtn.cloneNode(true));

            document.querySelector(".add-to-cart-btn").addEventListener("click", function () {
                const selectedShade = document.querySelector(".shade-btn.selected")?.innerText;

                if (!selectedShade) {
                    alert("Please select a shade before adding to cart! 🎨");
                    return;
                }

                const quantity = parseInt(document.querySelector(".add-to-cart input").value);
                addToCart(product, selectedShade, quantity);
            });
        } else {
            document.querySelector(".product-details-container").innerHTML = "<h2>Product not found.</h2>";
        }
    } catch (error) {
        console.error("Error loading product data:", error);
    }

    // Load Cart Data on Page Load
    updateCartCounter(document.querySelector(".cart-counter"));
    renderCartItems(); // Show items when the cart is loaded
});

// =============================
// ✅ Add to Cart Functionality
// =============================
function addToCart(product, selectedShade, quantity) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the item already exists in the cart (same product + same shade)
    const existingItemIndex = cart.findIndex(
        (item) => item.id === product.id && item.shade === selectedShade
    );

    if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item if it doesn’t exist
        cart.push({
            id: product.id,
            name: product.name,
            shade: selectedShade,
            price: product.price,
            quantity: quantity,
            image: product.images[0],
        });
    }

    // ✅ Save cart to LocalStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // ✅ Update Cart Counter and Render Items
    updateCartCounter(document.querySelector(".cart-counter"));
    renderCartItems(); // Update cart immediately
}

// =============================
// 🎯 Update Cart Counter
// =============================
function updateCartCounter(counter) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    counter.innerText = totalItems;
}

// =============================
// 🛒 Render Cart Items
// =============================
function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartList = document.querySelector(".cart-list");

    // Clear cart before rendering
    cartList.innerHTML = "";

    if (cart.length === 0) {
        cartList.innerHTML = `
            <p class="empty-cart-message">Your cart is empty 🛒</p>
        `;
        return;
    }

    cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-name">
                ${item.name} (${item.shade})
            </div>
            <div class="total-price">
                ₱${(item.price * item.quantity).toLocaleString()}
            </div>
            <div class="quantity">
                <span class="minus" data-index="${index}">&lt;</span>
                <span>${item.quantity}</span>
                <span class="plus" data-index="${index}">&gt;</span>
            </div>
        `;
        cartList.appendChild(cartItem);
    });

    attachCartListeners(); // Attach listeners for + and - buttons
}

// =============================
// ➕➖ Handle Cart Quantity Updates
// =============================
function attachCartListeners() {
    document.querySelectorAll(".minus").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            updateQuantity(index, -1);
        });
    });

    document.querySelectorAll(".plus").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            updateQuantity(index, 1);
        });
    });
}

// =============================
// 🔄 Update Quantity in Cart
// =============================
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1); // Remove item if quantity is 0
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter(document.querySelector(".cart-counter"));
    renderCartItems(); // Refresh cart items
}

// =============================
// 🎭 Open/Close Cart Tab
// =============================
document.querySelector(".cart-icon").addEventListener("click", () => {
    document.body.classList.add("show-cart");
    renderCartItems();
});

document.querySelector(".close-cart-btn").addEventListener("click", () => {
    document.body.classList.remove("show-cart");
});
