document.addEventListener("DOMContentLoaded", () => {
    const cartIcon = document.querySelector(".shopping-cart-container");
    const closeCartBtn = document.querySelector(".close-cart-btn");
    cartIcon.addEventListener("click", toggleCart);
    closeCartBtn.addEventListener("click", toggleCart);

    syncCartFromLocalStorage();
    fetchCartFromBackend(); 
    calculateCartTotal();
    renderCartItems();
    updateCartCounter(document.querySelector(".cart-counter")); 
});


// Open and Close Cart
function toggleCart(event) {
    event.preventDefault();
    document.body.classList.toggle("show-cart");
}

// Sync Cart from LocalStorage
function syncCartFromLocalStorage() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length > 0 && !getLoggedInUserId()) {
        syncCartWithBackend(cart);
    }
}

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

    const totalHTML = `
        <div class="cart-total-container">
            <h2>Total: ₱<span id="cart-total">0.00</span></h2>
        </div>
    `;

    const itemsHTML = cart.length === 0 
        ? `<p class="empty-cart-message">Your cart is empty 🛒</p>`
        : cart.map((item, index) => createCartItemHTML(item, index)).join("");

    // Set the combined HTML (total + items)
    cartList.innerHTML = totalHTML + itemsHTML;

    attachCartListeners();
    calculateCartTotal(); // this will now find #cart-total and update it
    checkCartBeforeCheckout();
}

function checkCartBeforeCheckout() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const checkoutBtn = document.querySelector(".checkout-btn");

    if (checkoutBtn) {
        if (cart.length === 0) {
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add("disabled");
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.classList.remove("disabled");
        }
    }
}

// Generate Cart Item HTML
function createCartItemHTML(item, index) {
    return `
        <div class="cart-item">
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-name">
                ${item.name} ${item.shade ? ` (${item.shade})` : ""}
            </div>
            <div class="total-price">
                ₱${(item.price * item.quantity).toLocaleString()}
            </div>
            <div class="quantity">
                <span class="minus" data-index="${index}">&minus;</span>
                <span>${item.quantity}</span>
                <span class="plus" data-index="${index}">&plus;</span>
            </div>
        </div>
    `;
}

// Attach Listeners for Quantity Buttons
function attachCartListeners() {
    document.querySelectorAll(".minus").forEach((btn) => {
        btn.addEventListener("click", (e) => updateQuantity(parseInt(e.target.dataset.index), -1));
    });

    document.querySelectorAll(".plus").forEach((btn) => {
        btn.addEventListener("click", (e) => updateQuantity(parseInt(e.target.dataset.index), 1));
    });
}

// Debounced Sync Cart with Backend
let syncTimeout;
function debouncedSync(cart) {
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => syncCartWithBackend(cart), 300);
}

// Remove Item from Cart Backend
function removeItemFromCartBackend(item) {
    const payload = {
        userId: getLoggedInUserId(),
        sessionId: getSessionId(),
        productId: item.id
    };

    fetch('http://localhost:8080/api/cart/remove/cart-item', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(handleResponse)
    .catch(handleError);
}

// Handle Response from Backend
function handleResponse(response) {
    response.text().then(text => {
        try {
            const data = JSON.parse(text);
            console.log("Item synced from cart:", data);
        } catch (e) {
            console.log("Item synced from cart (non-JSON response):", text);
        }
    });
}

// Handle Error in Fetch
function handleError(error) {
    console.error("Error removing item from cart:", error);
}

// Update Quantity in Cart and Remove Item if Quantity is 0
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            const item = cart.splice(index, 1)[0];
            removeItemFromCartBackend(item);
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    debouncedSync(cart);
    updateCartCounter(document.querySelector(".cart-counter"));
    renderCartItems();
}

// Add to Cart Functionality
function addToCart(product, selectedShade, quantity) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const normalizedShade = selectedShade ?? null;
    const existingItemIndex = cart.findIndex((item) => item.id === product.id && item.shade === normalizedShade);


    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push(createCartItem(product, selectedShade, quantity));
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    syncCartWithBackend(cart);
    updateCartCounter(document.querySelector(".cart-counter"));
    renderCartItems();
}

// Create Cart Item Object
function createCartItem(product, selectedShade, quantity) {
    return {
        id: product.id,
        name: product.name,
        shade: selectedShade ?? null,
        price: product.price,
        quantity: quantity,
        image: product.images[0]
    };
}

// Sync Cart with Backend
function syncCartWithBackend(cart) {
    const userId = getLoggedInUserId();
    const sessionId = getSessionId();

    const transformedCart = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        sessionId: sessionId,
        userId: userId,
        shade: item.shade
    }));

    console.log("Transformed cart:", transformedCart);

    fetch('http://localhost:8080/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformedCart)
    })
    .then(handleResponse)
    .catch(handleError);
}

// Fetch Cart from Backend after Login
function fetchCartFromBackend() {
    const userId = getLoggedInUserId(); // null if guest
    const sessionId = getSessionId();   // always exists

    const url = userId 
        ? `http://localhost:8080/api/cart/user/${userId}`
        : `http://localhost:8080/api/cart/session/${sessionId}`;

    fetch(url)
        .then(response => response.json())
        .then(cartItems => {
            console.log("Fetched cart items:", cartItems);

            // Transform the backend data into frontend format
            const transformed = cartItems.map(item => {
                let images = [];

                try {
                    images = JSON.parse(item.product?.images || "[]");
                } catch (e) {
                    console.error("Error parsing product images:", e);
                }

                return {
                    id: item.product?.id || item.id, // fallback
                    name: item.product?.name || item.name || "Unknown Product",
                    image: images[0] || "img/default.png",
                    quantity: item.quantity || 1,
                    price: item.price || 0,
                    shade: item.shade || ""
                };
            });

            localStorage.setItem("cart", JSON.stringify(transformed));
            renderCartItems();
            updateCartCounter(document.querySelector(".cart-counter"));
            calculateCartTotal(); 
        })
        .catch(error => {
            console.error("Error fetching cart items:", error);
        });
}


// Get Logged-in User ID
function getLoggedInUserId() {
    const id = localStorage.getItem("userId");
    return id && !isNaN(id) ? parseInt(id) : null;
}

// Get Session ID (Generate if Not Exist)
function getSessionId() {
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
        sessionId = generateSessionId();
        localStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
}

// Generate Session ID for Guest Users
function generateSessionId() {
    return "guest_" + Math.random().toString(36).substr(2, 9);
}

// Calculate Cart Total
function calculateCartTotal() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
        totalElement.textContent = total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}

//Place an Order
function placeOrder() {
    fetch('/api/place-order', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: getCartItemsFromFrontend() // Get the items to send to the backend
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        clearCart();
        alert('Order placed successfully!');
        loadUserCart(); // Reload the cart (should be empty if order was placed)
      } else {
        alert('Order failed. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error placing order:', error);
    });
  }

// Clear Cart
  function clearCart() {
    // Clear localStorage for guest cart
    localStorage.removeItem('cart');
  
    // Optionally, clear the backend cart if needed for logged-in users
    fetch('/api/clear-cart', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }
  