// Load cart when clicked
document.addEventListener("DOMContentLoaded", () => {
    let cartIcon = document.querySelector(".shopping-cart-container");
    let closeCartBtn = document.querySelector(".close-cart-btn");
    let body = document.body;
    let listProductsHTML = document.querySelector(".cart-list");

    let listProducts = [];

    cartIcon.addEventListener("click", (event) => {
        event.preventDefault();
        body.classList.toggle("show-cart");
    });


    closeCartBtn.addEventListener("click", () => {
          event.preventDefault();
          body.classList.toggle("show-cart");

    });
});

// Update Cart Counter
function updateCartCounter(counter) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    counter.innerText = totalItems;
}

// Render Cart Items
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
                <span class="minus" data-index="${index}">&minus;</span>
                <span>${item.quantity}</span>
                <span class="plus" data-index="${index}">&plus;</span>
            </div>
        `;
        cartList.appendChild(cartItem);
    });

    attachCartListeners(); // Attach listeners for + and - buttons
}


// Handle Cart Quantity Updates
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

// Update Quantity in Cart
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

// Open/Close Cart Tab
document.querySelector(".cart-icon").addEventListener("click", () => {
    document.body.classList.add("show-cart");
    renderCartItems();
});

document.querySelector(".close-cart-btn").addEventListener("click", () => {
    document.body.classList.remove("show-cart");
});

// Add to Cart Functionality
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