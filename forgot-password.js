document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("forgot-form");
    const msg = document.getElementById("reset-msg");

    // Input fields
    const usernameInput = document.getElementById("uname");
    const newPasswordInput = document.getElementById("new-psw");
    const confirmPasswordInput = document.getElementById("confirm-psw");

    // Function to show error messages
    function showMessage(input, message) {
        const errorMessage = input.parentElement.querySelector(".error-message");
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.color = "black";
        }
    }

    // Function to clear error messages
    function clearMessage(input) {
        const errorMessage = input.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    }

    // Validation functions
    function validateUsername(username) {
        return /^[A-Za-z0-9]+$/.test(username);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    // Real-time validation
    usernameInput.addEventListener("input", () => {
        if (!validateUsername(usernameInput.value)) {
            showMessage(usernameInput, "Username must contain only letters and numbers");
        } else {
            clearMessage(usernameInput);
        }
    });

    newPasswordInput.addEventListener("input", () => {
        if (!validatePassword(newPasswordInput.value)) {
            showMessage(newPasswordInput, "Password must be at least 6 characters long");
        } else {
            clearMessage(newPasswordInput);
        }

        // Check password match as user types
        if (confirmPasswordInput.value !== "" && confirmPasswordInput.value !== newPasswordInput.value) {
            showMessage(confirmPasswordInput, "Passwords do not match");
        } else {
            clearMessage(confirmPasswordInput);
        }
    });

    confirmPasswordInput.addEventListener("input", () => {
        if (confirmPasswordInput.value !== newPasswordInput.value) {
            showMessage(confirmPasswordInput, "Passwords do not match");
        } else {
            clearMessage(confirmPasswordInput);
        }
    });

    // Submit event listener
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = usernameInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Final validation before submission
        if (!validateUsername(username)) {
            showMessage(usernameInput, "Username must contain only letters and numbers");
            return;
        }

        if (!validatePassword(newPassword)) {
            showMessage(newPasswordInput, "Password must be at least 6 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage(confirmPasswordInput, "Passwords do not match");
            return;
        }

        // If all validations pass, send the request
        fetch("http://localhost:8080/api/users/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, newPassword }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                msg.textContent = "Password reset successful. You may now log in.";
                msg.style.color = "green";
                setTimeout(() => window.location.href = "log-in.html", 2000);
            } else {
                msg.textContent = data.message || "User not found.";
                msg.style.color = "red";
            }
        })
        .catch(error => {
            msg.textContent = "Something went wrong.";
            msg.style.color = "red";
            console.error(error);
        });
    });
});
