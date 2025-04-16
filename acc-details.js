document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("name");
    const userUsername = localStorage.getItem("username");

    console.log('userId from localStorage:', userId); // Debugging line

    const userNameElement = document.getElementById("user-name");
    const userUsernameElement = document.getElementById("user-username");

    if (userName && userUsername) {
        userNameElement.textContent = userName;
        userUsernameElement.textContent = userUsername;
    }

    console.log('Fetching addresses for userId:', userId);

    fetch(`http://localhost:8080/api/account/addresses/${userId}`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch addresses");
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetched addresses:", data);
            const addressListElement = document.getElementById("address-list");

            if (data && Array.isArray(data)) {
                if (data.length === 0) {
                    addressListElement.innerHTML = "<p>No saved addresses.</p>";
                    return;
                }

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