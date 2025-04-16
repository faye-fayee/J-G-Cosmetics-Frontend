document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("name");
    const userUsername = localStorage.getItem("username");

    const userNameElement = document.getElementById("user-name");
    const userUsernameElement = document.getElementById("user-username");

    if (userName && userUsername) {
        userNameElement.textContent = userName;
        userUsernameElement.textContent = userUsername;
    }

    fetch (`http://localhost:8080/api/account/addresses/${userId}`)
        .then(response => response.json())
        .then(data => {
            const addressListElement = document.getElementById("address-list");

            if (data && Array.isArray(data)) {
                data.forEach(address => {
                    const addressDiv = document.createElement("div");
                    addressDiv.classList.add("address-item");
                    addressDiv.innerHTML = `
                        <h3>${address.label}</h3>
                            <p><strong>Name:</strong> ${address.fullName}</p>
                            <p><strong>Phone:</strong> ${address.phone}</p>
                            <p><strong>Address:</strong> ${address.addressLine}, ${address.city}, ${address.postalCode}, ${address.country}</p>
                    `;
                    addressListElement.appendChild(addressDiv);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching addresses:', error);
            alert('Failed to load addresses. Please try again later.');
        });

        const logoutLink = document.getElementById("logout-link");
        logoutLink.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.clear();
            window.location.href = "login.html"; // or index.html
        });

});