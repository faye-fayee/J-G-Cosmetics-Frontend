document.addEventListener('DOMContentLoaded', function () {
    const addressForm = document.getElementById("add-address-form");
    const userId = getLoggedInUserId();

    addressForm.addEventListener("submit", function (event) {
        event.preventDefault(); 

        const labelInput = document.getElementById("label").value;
        const fullNameInput = document.getElementById("full-name").value;
        const phoneNumberInput = document.getElementById("phone-number").value;
        const addressLineInput = document.getElementById("address-line").value;
        const cityInput = document.getElementById("city").value;
        const postalCodeInput = document.getElementById("postal-code").value;
        const countryInput = document.getElementById("country").value;

        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(fullNameInput)) {
            alert("Full name should contain only letters and spaces.");
            return;
        }

        const phoneRegex = /^\d{7,15}$/;
        if (!phoneRegex.test(phoneNumberInput)) {
            alert("Phone number must be between 7 and 15 digits.");
            return;
        }

        const postalCodeRegex = /^[A-Za-z0-9\s\-]{4,10}$/;
        if (!postalCodeRegex.test(postalCodeInput)) {
            alert("Invalid postal code format.");
            return;
        }

        if (labelInput === '' || fullNameInput === '' || phoneNumberInput === '' || addressLineInput === '' || cityInput === '' || postalCodeInput === '' || countryInput === '') {
            alert("Please fill in all fields.");
            return;
        }

        fetch(`http://localhost:8080/api/account/addresses/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                label: labelInput,
                fullName: fullNameInput,
                phone: phoneNumberInput,
                addressLine: addressLineInput,
                city: cityInput,
                postalCode: postalCodeInput,
                country: countryInput
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert('Address added successfully!');
            addressForm.reset(); 
        })
        .catch(error => {
            alert('Error adding address');
            console.error('Error:', error); 
        });
    });
});