document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sign_up_form');   // Store the input element
    const NameInput = document.getElementById('name');    // Store the input element
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
    function validateFName(name) {
        return /^[A-Za-z]+$/.test(name); // Makes sure it only contains letters
    }

    function validateUName(username) {
        return /^[A-Za-z0-9]+$/.test(username); // Makes sure it only contains letters and numbers
    }

    function validatePassword(password) {
        return password.length >= 6; // Makes sure it is at least 6 characters long
    }

    // Event Listeners for the input fields
    NameInput.addEventListener("input", function() {
        if (!validateFName(NameInput.value)) {
            showMessage(NameInput, 'Name must contain only letters');
        } else {
            clearMessage(NameInput);
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
        event.preventDefault(); // Prevent the default form submission
        console.log('Form submitted!'); // Log to the console for debugging

        if (NameInput.value === '') {
            alert('Name must be filled out');
            event.preventDefault();
        } else if (uNameInput.value === '') {
            alert('Username must be filled out');
            event.preventDefault();
        } else if (passwordInput.value === '') {
            alert('Password must be filled out');
            event.preventDefault();
        } else if (!validateFName(NameInput.value)) {
            alert('Name must contain only letters');
            event.preventDefault();
        } else if (!validateUName(uNameInput.value)) { 
            alert('Username must contain only letters and numbers');
            event.preventDefault();
        } else if (!validatePassword(passwordInput.value)) {
            alert('Password must be at least 6 characters long');
            event.preventDefault();
        }

        // If all validations pass, the form will be submitted
        fetch('http://localhost:8080/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: NameInput.value, 
                username: uNameInput.value, 
                password: passwordInput.value
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            alert(data.message);
            window.location.href = 'log-in.html'; // Redirect to login page after successful registration
        })
        .catch(error => {
            alert('Error registering user!');
            console.error('Error:', error); // Log the error to the console for debugging
        });
    });
});
