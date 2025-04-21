document.addEventListener('DOMContentLoaded', function() {
    const nameSpan = document.getElementById("user-name");
    const usernameSpan = document.getElementById("user-username");
    const logoutLink = document.getElementById("logout-link");
    const addressList = document.getElementById("address-list");
    const addAddressButton = document.getElementById("add-address-btn");

    const name = localStorage.getItem("name");
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");

    if (!name || !username || !userId) {
        alert("User not authenticated. Redirecting to login.");
        window.location.href = "log-in.html";
        return;
    }

    nameSpan.textContent = name;
    usernameSpan.textContent = username;

    logoutLink.addEventListener("click", function(e) {
        e.preventDefault();
        localStorage.clear();
        window.location.href = "log-in.html";
    });

    addAddressButton.addEventListener("click", function(e) {
        e.preventDefault();
        window.location.href = "add-address.html";
    });

    fetch (`http://localhost:8080/api/account/addresses/${userId}`)
        .then (response => response.json())
        .then (addresses => {
            if (addresses.length === 0) {
                addressList.innerHTML = `<p>No saved addresses yet.</p>`;
                return;
            }

            addresses.forEach(address => {
                const div = document.createElement("div");
                div.classList.add("address-item");

                div.innerHTML = `
                    <h4>${address.label}</h4>
                    <p>${address.fullName} ${address.phone}</p>
                    <p>${address.addressLine}</p>
                    <p>${address.city}, ${address.postalCode}, ${address.country}</p>
                    <div class="address-btn-actions">
                    <button class="edit-address-btn" data-label="${address.label}">Edit</button>
                    <button class="delete-address-btn" data-id="${address.id}">Delete</button>
                    </div>
                `;

                addressList.appendChild(div);
            });
            document.querySelectorAll(".edit-address-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const label = button.getAttribute("data-label");
                    window.location.href = `edit-address.html?label=${encodeURIComponent(label)}`;
                });
            });
            document.querySelectorAll(".delete-address-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const id = button.getAttribute("data-id");
                    
                    const confirmDelete = confirm("Are you sure you want to delete this address?");
                    if(confirmDelete) {
                        fetch(`http://localhost:8080/api/account/addresses/${id}`, {
                            method: 'DELETE'
                        })
                        .then(response => {
                            if (response.ok) {
                                button.closest(".address-item").remove();
                                alert("Address deleted successfully.");
                            } else {
                                return response.text().then(text => { throw new Error(text); });
                            }
                        })
                        .catch(error => {
                            console.error("Error deleting address:", error);
                            alert("Failed to delete address.");
                        });
                    }
                });
            });
            
        })
        .catch(error => {
            console.error("Error fetching addresses:", error);
            addressList.innerHTML = `<p>Error loading addresses.</p>`;
        })
});