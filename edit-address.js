document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const addressLabel = urlParams.get("label");
    const userId = localStorage.getItem("userId");

    if(!addressLabel || !userId) {
        alert("Invalid address label or user ID. Redirecting to account details.");
        window.location.href = "acc-details.html";
        return;
    }

    const form = document.getElementById("edit-address-form");

    fetch(`http://localhost:8080/api/account/addresses/${userId}/${addressLabel}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(address => {
            form.addressLabel.value = address.label;
            form.fullName.value = address.fullName;
            form.phoneNumber.value = address.phone;
            form.addressLine.value = address.addressLine;
            form.addressCity.value = address.city;
            form.postalCode.value = address.postalCode;
            form.addressCountry.value = address.country;
        })
        .catch(error =>{
            console.error("Error fetching address:", error);
            alert("Failed to load address details. Redirecting to account details.");
            window.location.href = "acc-details.html";
        })
});