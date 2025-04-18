document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("forgot-form");
    const msg = document.getElementById("reset-msg");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("uname").value;
        const newPassword = document.getElementById("new-psw").value;
        const confirmPassword = document.getElementById("confirm-psw").value;

        if (newPassword !== confirmPassword) {
            msg.textContent = "Passwords do not match.";
            msg.style.color = "red";
            return;
        }

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
