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
        window.location.href = "login.html";
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
                `;

                addressList.appendChild(div);
            });
        })
        .catch(error => {
            console.error("Error fetching addresses:", error);
            addressList.innerHTML = `<p>Error loading addresses.</p>`;
        })
});