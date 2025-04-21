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
    let currentAddressId = null;



    fetch(`http://localhost:8080/api/account/addresses/${userId}/${addressLabel}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(address => {
            currentAddressId = address.id;
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

    function validateInput(inputs) {
        // Validate Full Name
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(inputs.fullName)) {
            alert("Full name should contain only letters and spaces.");
            return false;
        }
    
        // Validate Phone Number
        const phoneRegex = /^\d{7,15}$/;
        if (!phoneRegex.test(inputs.phoneNumber)) {
            alert("Phone number must be between 7 and 15 digits.");
            return false;
        }
    
        // Validate Postal Code
        const postalCodeRegex = /^[A-Za-z0-9\s\-]{4,10}$/;
        if (!postalCodeRegex.test(inputs.postalCode)) {
            alert("Invalid postal code format.");
            return false;
        }
    
        // Validate that all fields are filled
        if (inputs.label === '' || inputs.fullName === '' || inputs.phoneNumber === '' || inputs.addressLine === '' || inputs.city === '' || inputs.postalCode === '' || inputs.country === '') {
            alert("Please fill in all fields.");
            return false;
        }
    
        return true;
    }
        
    
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        if(!currentAddressId) {
            alert("Something went wrong. Address Id not found. Redirecting to account details.");
            window.location.href = "acc-details.html";
            return;
        }

        const updatedAddress = {
            fullName: form.fullName.value,
            phone: form.phoneNumber.value,
            addressLine: form.addressLine.value,
            city: form.addressCity.value,
            postalCode: form.postalCode.value,
            country: form.addressCountry.value,
            label: addressLabel
        };

        if (!validateInput(updatedAddress)) {
            return;
        }

        fetch(`http://localhost:8080/api/account/addresses/${currentAddressId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedAddress)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(() => {
            alert("Address updated successfully!");
            window.location.href = "acc-details.html";
        })
        .catch(error => {
            console.error("Error updating address:", error);
            alert("Failed to update address. Please try again.");
        });
    });
});
