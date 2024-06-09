document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("registration-form");

    // Username validation
    var usernameInput = document.getElementById("username");
    var usernameError = document.querySelector(".error.username");
    usernameInput.addEventListener("input", function() {
        if (usernameInput.value.length < 3) {
            usernameError.textContent = "Username must be at least 3 characters long.";
            usernameError.style.display = "block";
        } else {
            usernameError.textContent = "";
            usernameError.style.display = "none";
        }
    });

    // Email validation
    var emailInput = document.getElementById("email");
    var emailError = document.querySelector(".error.email");
    emailInput.addEventListener("input", function() {
        emailError.textContent = "";
        emailError.style.display = "none";
    });

    // Password validation
    var password1Input = document.getElementById("password1");
    var password1Error = document.querySelector(".error.password1");
    password1Input.addEventListener("input", function() {
        if (password1Input.value.length < 8) {
            password1Error.textContent = "Password must be at least 8 characters long.";
            password1Error.style.display = "block";
        } else {
            password1Error.textContent = "";
            password1Error.style.display = "none";
        }
    });

    // Password confirmation validation
    var password2Input = document.getElementById("password2");
    var password2Error = document.querySelector(".error.password2");
    password2Input.addEventListener("input", function() {
        if (password2Input.value !== password1Input.value) {
            password2Error.textContent = "Passwords do not match.";
            password2Error.style.display = "block";
        } else {
            password2Error.textContent = "";
            password2Error.style.display = "none";
        }
    });

    const updateUsernameForm = document.getElementById('updateUsernameForm');
    if (updateUsernameForm) {
        updateUsernameForm.addEventListener('submit', event => ajaxFormSubmitionAction(event, 'updateUsernameForm', callbackCloseModal, updateUsernameForm.action));
    }
});