document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("log_in_form");   // Store the input element
    const uNameInput = document.getElementById("uname");    // Store the input element
    const passwordInput = document.getElementById("psw");   // Store the input element


    function showMessage(input, message) {
        const errorMessage = input.parentElement.querySelector("small");  // Declare an error message variable for the small element
        errorMessage.textContent = message;            // Set the error message to the message passed in
        errorMessage.style.color = "black";           // Set the color of the error message to black
    }

    function clearMessage(input) {
        const errorMessage = input.parentElement.querySelector("small"); // Declare an error message variable for the small element
        errorMessage.textContent = '';                // Set the error message to an empty string
    }

    function validateUName(username) {
        return /^[A-Za-z0-9]+$/.test(username); // Makes sure it only contains letters and numbers
    }

    function validatePassword(password) {
        return password.length >= 6; // Makes sure it is at least 6 characters long
    }

    function emptyField (input) {
        return input === " ";
    }

    // event listeners for the input fields
    uNameInput.addEventListener("input", function() {
        if (!validateUName(uNameInput.value)) {
            showMessage(uNameInput, 'Username must contain only letters and numbers');
        } else {
            clearMessage(uNameInput);
        }
    });

    passwordInput.addEventListener("change", function() {
        if (!validatePassword(passwordInput.value)) {
            showMessage(passwordInput, 'Password must be at least 6 characters long');
        } else {
            clearMessage(passwordInput);
        }
    });

    //Event listener for the submit button
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the default form submission
        console.log('Form submitted!'); // Log to the console for debugging


         // Simple validations
         if (uNameInput.value === "" || passwordInput.value === "") {
            alert('Username and password must not be empty');
            return;
        }
        if (!validateUName(uNameInput.value)) {
            alert('Username must contain only letters and numbers');
            return;
        }
        if (!validatePassword(passwordInput.value)) {
            alert('Password must be at least 6 characters long');
            return;
        }

        // If all validations pass, the form will be submitted
        fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: uNameInput.value,
                password: passwordInput.value
            })
        })
        .then(response =>response.json())
        .then(data => {
            if (data.success) {
                alert('Login successful!');
                window.location.href = 'acc-details.html'; // Redirect to home page
            }
            else {
                alert('Login failed. Please check your username and password.');
            }
        })
        .catch(error => {
            alert('An error occurred. Please try again later.');
            console.error(error);
        });
    });

});