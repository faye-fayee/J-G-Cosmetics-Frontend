document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sign_up_form');   // Store the input element
    const fNameInput = document.getElementById('fname');    // Store the input element
    const lNameInput = document.getElementById('lname');    // Store the input element
    const uNameInput = document.getElementById('uname');    // Store the input element
    const passwordInput = document.getElementById('psw');   // Store the input element

    // Function to show Error Message using the small element
    function showMessage(input, message) {
        const errorMessage = input.nextElementSibling;  // Declare an error message variable for the small element
        errorMessage.textContent = message;            // Set the error message to the message passed in
        errorMessage.style.color = "black";           // Set the color of the error message to black
    }
    // Function to clear the Error Message
    function clearMessage(input) {
        const errorMessage = input.nextElementSibling; // Declare an error message variable for the small element
        errorMessage.textContent = '';                // Set the error message to an empty string
    }

    // Functions to validate the inputs
    function validateFName(first_name) {
        return /^[A-Za-z]+$/.test(first_name); // Makes sure it only contains letters
    }

    function validateLName(last_name) {
        return /^[A-Za-z]+$/.test(last_name); // Makes sure it only contains letters
    }

    function validateUName(username) {
        return /^[A-Za-z0-9]+$/.test(username); // Makes sure it only contains letters and numbers
    }

    function validatePassword(password) {
        return password.length >= 6; // Makes sure it is at least 6 characters long
    }

    // Event Listeners for the input fields
    fNameInput.addEventListener("input", function() {
        if (!validateFName(fNameInput.value)) {
            showMessage(fNameInput, 'First name must contain only letters');
        } else {
            clearMessage(fNameInput);
        }
    });

    lNameInput.addEventListener("input", function() {
        if (!validateLName(lNameInput.value)) {
            showMessage(lNameInput, 'Last name must contain only letters');
        } else {
            clearMessage(lNameInput);
        }
    });

    uNameInput.addEventListener("input", function() {
        if (!validateUName(uNameInput.value)) {
            showMessage(uNameInput, 'Username must contain only letters and numbers');
        } else {
            clearMessage(uNameInput);
        }
    });

    passwordInput.addEventListener("blur", function() {
        if (!validatePassword(passwordInput.value)) {
            showMessage(passwordInput, 'Password must be at least 6 characters long');
        } else {
            clearMessage(passwordInput);
        }
    });


    // Event Listener for the submit form
    form.addEventListener('submit', function(event) {

        if (fNameInput.value === '') {
            alert('First name must be filled out');
            event.preventDefault();
        } else if (lNameInput.value === '') {
            alert('Last name must be filled out');
            event.preventDefault();
        } else if (uNameInput.value === '') {
            alert('Username must be filled out');
            event.preventDefault();
        } else if (passwordInput.value === '') {
            alert('Password must be filled out');
            event.preventDefault();
        } else if (!validateFName(fNameInput.value)) {
            alert('First name must contain only letters');
            event.preventDefault();
        } else if (!validateLName(lNameInput.value)) {
            alert('Last name must contain only letters');
            event.preventDefault();
        } else if (!validateUName(uNameInput.value)) { 
            alert('Username must contain only letters and numbers');
            event.preventDefault();
        } else if (!validatePassword(passwordInput.value)) {
            alert('Password must be at least 6 characters long');
            event.preventDefault();
        }
    });
});
