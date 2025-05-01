document.addEventListener("DOMContentLoaded", () => {
    // Check if user is a guest (not logged in, but session ID exists)
    if (!localStorage.getItem("userId") && localStorage.getItem("sessionId")) {
        // Hide elements meant only for logged-in users
        const elementsToHide = [
            "user-name-container",
            "user-username-container",
            "address-select-container",
            "update-address-msg",
            "update-address-btn",
            "add-new-address-msg",
            "add-new-address"
        ];

        elementsToHide.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        });

        // Load and display guest cart from localStorage
        loadGuestCart();

        // Handle "Next" button click to go to cart summary
        const nextBtn = document.getElementById("next-to-cart-summary-btn");
        nextBtn.addEventListener("click", (e) => {
            e.preventDefault();

            // Validate form inputs
            const requiredFields = [
                "checkout-full-name",
                "checkout-number",
                "checkout-address-line",
                "checkout-city",
                "checkout-postal-code",
                "checkout-country"
            ];

            for (const id of requiredFields) {
                const input = document.getElementById(id);
                if (!input || input.value.trim() === "") {
                    alert("Please fill out all required fields.");
                    return;
                }
            }

            document.getElementById("user-info-step-content").style.display = "none";
            document.getElementById("cart-summary-step-content").style.display = "block";
        });

        // Handle Place Order button for guests
        document.getElementById("place-order-btn").addEventListener("click", () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];

            if (cart.length === 0) {
                alert("Your cart is empty.");
                return;
            }

            const fullName = document.getElementById("checkout-full-name").value;
            const phoneNumber = document.getElementById("checkout-number").value;
            const addressLine = document.getElementById("checkout-address-line").value;
            const city = document.getElementById("checkout-city").value;
            const postalCode = document.getElementById("checkout-postal-code").value;
            const country = document.getElementById("checkout-country").value;

            if (!fullName || !phoneNumber || !addressLine || !city || !postalCode || !country) {
                alert("Please fill out all the address fields.");
                return;
            }

            const requestData = {
                sessionId: localStorage.getItem("sessionId"),
                guestFullName: fullName,
                guestPhone: phoneNumber,
                guestAddressLine: addressLine,
                guestCity: city,
                guestPostalCode: postalCode,
                guestCountry: country,
                cartItems: cart
            };

            // Log the request data to the console
            console.log("Request data:", requestData);

            fetch("http://localhost:8080/api/checkout/placeOrder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            })
            .then(res => {
                console.log("Response status:", res.status);
                if (!res.ok) throw new Error("Failed to place order");
                return res.json();
            })
            .then(data => {
                console.log("Order placed data:", data);  // Debugging
                alert("Order placed successfully!");
                localStorage.removeItem("cart");
                window.location.href = "index.html";
            })
            .catch(error => {
                console.error("Error placing order:", error);
                alert("There was an error placing your order.");
            });
            
            document.getElementById("place-order-btn").disabled = true;
        });
    }

    // Function to load the guest cart
    function loadGuestCart() {
        const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
        console.log("Fetched cart items:", cartItems);  // Debugging

        const container = document.querySelector(".cart-summary-items");
        const totalDisplay = document.getElementById("checkout-cart-total");

        container.innerHTML = "";  // Clear existing content
        let total = 0;

        cartItems.forEach(item => {
            const itemHTML = `
                <div class="cart-item">
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-name">
                        ${item.name} ${item.shade ? `(${item.shade})` : ""}
                    </div>
                    <div class="cart-item-qty-price">
                        Quantity: ${item.quantity}<br>
                        Price: ₱${(item.price * item.quantity).toLocaleString()}
                    </div>
                </div>
            `;
            container.innerHTML += itemHTML;
            total += item.price * item.quantity;
        });

        totalDisplay.textContent = total.toLocaleString(undefined, { minimumFractionDigits: 2 });
    }
});
