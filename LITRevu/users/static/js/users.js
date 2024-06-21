document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registration-form");

    // Username validation
    const usernameInput = document.getElementById("username");
    const usernameError = document.querySelector(".error.username");
    usernameInput.addEventListener("input", () => {
        if (usernameInput.value.length < 3) {
            usernameError.textContent = "Username must be at least 3 characters long.";
            usernameError.style.display = "block";
        } else {
            usernameError.textContent = "";
            usernameError.style.display = "none";
        }
    });

    // Email validation
    const emailInput = document.getElementById("email");
    const emailError = document.querySelector(".error.email");
    emailInput.addEventListener("input", () => {
        emailError.textContent = "";
        emailError.style.display = "none";
    });

    // Password validation
    const password1Input = document.getElementById("password1");
    const password1Error = document.querySelector(".error.password1");
    password1Input.addEventListener("input", () => {
        if (password1Input.value.length < 8) {
            password1Error.textContent = "Password must be at least 8 characters long.";
            password1Error.style.display = "block";
        } else {
            password1Error.textContent = "";
            password1Error.style.display = "none";
        }
    });

    // Password confirmation validation
    const password2Input = document.getElementById("password2");
    const password2Error = document.querySelector(".error.password2");
    password2Input.addEventListener("input", () => {
        if (password2Input.value !== password1Input.value) {
            password2Error.textContent = "Passwords do not match.";
            password2Error.style.display = "block";
        } else {
            password2Error.textContent = "";
            password2Error.style.display = "none";
        }
    });
});