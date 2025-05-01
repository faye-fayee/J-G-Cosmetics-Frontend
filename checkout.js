document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem("userId");
    let formIsDirty = false;
    let formWasUpdated = false;

    // Fetch user info from the backend
    fetch(`http://localhost:8080/api/users/${userId}/info`)
        .then(res => res.json())
        .then(data => {

            if (data.addresses.length === 0) {
                alert("No addresses found. Please add an address first.");
                window.location.href = "add-address.html";
                return; 
            }

            // Populate user info
            document.getElementById("user-name").textContent = data.name;
            document.getElementById("user-username").textContent = data.username;

            // Populate the address dropdown
            const addressSelect = document.getElementById("address-select");
            addressSelect.innerHTML = ""; // Clear existing options

            data.addresses.forEach(address => {
                const option = document.createElement("option");
                option.value = address.id;
                option.textContent = address.label + " - " + address.city;
                addressSelect.appendChild(option);
            });

            // If there are addresses, fill in the first address fields by default
            if (data.addresses.length > 0) {
                populateAddressFields(data.addresses[0]);
            }

            // Handle address select change
            document.getElementById("address-select").addEventListener("change", (e) => {
                const selectedAddressId = e.target.value;
                const selectedAddress = data.addresses.find(address => address.id == selectedAddressId);
                populateAddressFields(selectedAddress);
            });
        })
        .catch(error => console.error("Error fetching user info:", error));

    // Mark form as dirty on any input change
    const inputs = document.querySelectorAll("#checkout-address-form input");
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            formIsDirty = true;
            formWasUpdated = false; 
        });
    });
    
    // Function to populate address fields in the form
    function populateAddressFields(address) {
        document.getElementById("checkout-label").value = address.label;
        document.getElementById("checkout-full-name").value = address.fullName;
        document.getElementById("checkout-number").value = address.phone;
        document.getElementById("checkout-address-line").value = address.addressLine;
        document.getElementById("checkout-city").value = address.city;
        document.getElementById("checkout-postal-code").value = address.postalCode;
        document.getElementById("checkout-country").value = address.country;
    }

    // Handle Add New Address button
    document.getElementById("add-new-address").addEventListener("click", () => {
        // Clear the form to add a new address
        document.getElementById("checkout-address-form").reset();
        window.location.href = "add-address.html"; 
    });

    // Handle Update Address button
    document.getElementById("checkout-address-form").addEventListener("submit", (e) => {
        e.preventDefault();
        
        const selectedAddressId = document.getElementById("address-select").value; // Get the selected address ID

        const updatedAddress = {
            label: document.getElementById("checkout-label").value,
            fullName: document.getElementById("checkout-full-name").value,
            phone: document.getElementById("checkout-number").value, // ✅ correct key
            addressLine: document.getElementById("checkout-address-line").value,
            city: document.getElementById("checkout-city").value,
            postalCode: document.getElementById("checkout-postal-code").value,
            country: document.getElementById("checkout-country").value
        };
        

        fetch(`http://localhost:8080/api/account/addresses/${selectedAddressId}`, { // Use selectedAddressId here
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedAddress)
        })
        .then(response => response.json())  
        .then(data => {
            if (data.success) {
                alert(data.message);
                console.log("Updated address:", data.address);

                // Find the corresponding dropdown option and update its text content
                const option = document.querySelector(`#address-select option[value="${selectedAddressId}"]`);
                if (option) {
                    option.textContent = data.address.label + " - " + data.address.city;
                    // After successful update
                    formIsDirty = false;
                    formWasUpdated = true;
                }
                } else {
                    alert("Update failed: " + data.message);
                }

        })
        .catch(error => {
            console.error("Error updating address:", error);
        });   
        
    });

    
    // Handle Next button to move to Cart Summary step
    document.getElementById("next-to-cart-summary-btn").addEventListener("click", (e) => {
        e.preventDefault(); 

        // Check if the form is dirty and prompt the user
        const requiredInputs = Array.from(document.querySelectorAll("#checkout-address-form input[required]"));
        const emptyField = requiredInputs.find(input => !input.value.trim());

        if (emptyField) {
            alert("Please fill out all required address fields.");
            e.preventDefault();
            return;
        }
    
        if (formIsDirty && !formWasUpdated) {
            alert("You’ve changed address fields. Please click 'Update Address' before continuing.");
            e.preventDefault();
            return;
        }

        // Move to the Cart Summary step
        document.getElementById("user-info-step-content").style.display = "none";
        document.getElementById("cart-summary-step-content").style.display = "block";
        renderCheckoutCartSummary();
        
        // Update progress bar or any other UI components if needed
        document.getElementById("user-info-step").classList.remove("active");
        document.getElementById("cart-summary-step").classList.add("active");

    });

    // Handle Back button to move back to User Info step
    document.getElementById("back-to-user-info-btn").addEventListener("click", (e) => {
        e.preventDefault();
    
        document.getElementById("cart-summary-step-content").style.display = "none";
        document.getElementById("user-info-step-content").style.display = "grid";
    
        document.getElementById("cart-summary-step").classList.remove("active");
        document.getElementById("user-info-step").classList.add("active");
    });

    //Cart Summary Logic
    function renderCheckoutCartSummary() {
        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        const container = document.querySelector(".cart-summary-items");
        const totalDisplay = document.getElementById("checkout-cart-total");
    
        container.innerHTML = ""; // Clear existing
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

    document.getElementById("place-order-btn").addEventListener("click", () => {
        const userId = localStorage.getItem("userId");
        const addressId = document.getElementById("address-select").value;
    
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
        if (!userId || !addressId || cart.length === 0) {
            alert("Missing user info, address, or cart items.");
            return;
        }
    
        const requestData = {
            userId: userId,
            addressId: addressId,
            cartItems: cart 
        };
    
        fetch("http://localhost:8080/api/checkout/placeOrder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to place order");
            return res.json();
        })
        .then(data => {
            alert("Order placed successfully!");
    
            // Clear cart after successful checkout
            localStorage.removeItem("cart");
    
            // Redirect or update UI
            window.location.href = "acc-details.html";
        })
        .catch(error => {
            console.error("Error placing order:", error);
            alert("There was an error placing your order.");
        });
        const placeOrderBtn = document.getElementById("place-order-btn");
        placeOrderBtn.disabled = true;
        // then re-enable it only if needed (in error handling)
    });

    window.addEventListener('beforeunload', function (e) {
        // Prompt message for when the user tries to leave
        const message = "Are you sure you want to leave? Any unsaved changes will be lost.";
        
        e.returnValue = message;
        return message;
    });
    
    
    
});
