document.addEventListener('DOMContentLoaded', function() {
    const nameSpan = document.getElementById("user-name");
    const usernameSpan = document.getElementById("user-username");
    const logoutLink = document.getElementById("logout-link");
    const addressList = document.getElementById("address-list");
    const addAddressButton = document.getElementById("add-address-btn");
    const deleteAddressButton = document.getElementById("delete-address-btn");

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
    deleteAddressButton.addEventListener("click", function() {

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
                    <button class="edit-btn" data-label="${address.label}">Edit</button>
                    <button class="delete-btn" data-label="${address.label}">Delete</button>
                `;

                addressList.appendChild(div);
            });
            document.querySelectorAll(".edit-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const label = button.getAttribute("data-label");
                    window.location.href = `edit-address.html?label=${encodeURIComponent(label)}`;
                });
            });
            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const label = button.getAttribute("data-label");
                    // TODO: confirm delete and call DELETE endpoint
                });
            });
            
        })
        .catch(error => {
            console.error("Error fetching addresses:", error);
            addressList.innerHTML = `<p>Error loading addresses.</p>`;
        })
});