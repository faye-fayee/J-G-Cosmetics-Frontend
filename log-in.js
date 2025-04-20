document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("log_in_form");   
    const uNameInput = document.getElementById("uname");   
    const passwordInput = document.getElementById("psw"); 


    function showMessage(input, message) {
        const errorMessage = input.parentElement.querySelector("small");  
        errorMessage.textContent = message;           
        errorMessage.style.color = "black";       
    }

    function clearMessage(input) {
        const errorMessage = input.parentElement.querySelector("small");
        errorMessage.textContent = '';                
    }

    function validateUName(username) {
        return /^[A-Za-z0-9]+$/.test(username); 
    }

    function validatePassword(password) {
        return password.length >= 6; 
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
        event.preventDefault(); 
        console.log('Form submitted!'); 


         // Simple validations before sending the request
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
            console.log(data);

            if (data.success) {
                // Save the user data to local storage
                localStorage.setItem("userId", data.user.id);
                localStorage.setItem("name", data.user.name);
                localStorage.setItem("username", data.user.username);

                fetchCartFromBackend();

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