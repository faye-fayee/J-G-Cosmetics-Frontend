document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sign_up_form');   
    const NameInput = document.getElementById('name');    
    const uNameInput = document.getElementById('uname');    
    const passwordInput = document.getElementById('psw');  

    // Function to show Error Message using the small element
    function showMessage(input, message) {
        const errorMessage = input.nextElementSibling;  
        errorMessage.textContent = message;            
        errorMessage.style.color = "black";           
    }
    // Function to clear the Error Message
    function clearMessage(input) {
        const errorMessage = input.nextElementSibling; 
        errorMessage.textContent = '';                
    }

    // Functions to validate the inputs
    function validateFName(name) {
        return /^[a-zA-Z\s]*$/.test(name); 
    }
    function validateUName(username) {
        return /^[A-Za-z0-9]+$/.test(username); 
    }
    function validatePassword(password) {
        return password.length >= 6; 
    }

    // Event Listeners for the input fields
    NameInput.addEventListener("input", function() {
        if (!validateFName(NameInput.value)) {
            showMessage(NameInput, 'Name must contain only letters and spaces');
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
    passwordInput.addEventListener("input", function() {
        if (!validatePassword(passwordInput.value)) {
            showMessage(passwordInput, 'Password must be at least 6 characters long');
        } else {
            clearMessage(passwordInput);
        }
    });


    // Event Listener for the submit form
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('Form submitted!'); 

        // Validates form inputs before submission
        if (NameInput.value === ''|| uNameInput.value === '' || passwordInput.value === '') {
            alert('All fields must be filled out');
            return;
        } 
        if (!validateFName(NameInput.value)) {
            alert('Name must contain only letters');
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
        .then(async response => {
            const data = await response.json();
        
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
        
            alert(data.message);
            window.location.href = 'log-in.html';
        })
        .catch(error => {
            alert(error.message);
            form.reset();
            console.error('Error:', error);
        });
    });
});
