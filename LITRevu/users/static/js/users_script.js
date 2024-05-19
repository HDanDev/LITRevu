document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("registration-form");
    var usernameInput = document.getElementById("username");
    var usernameError = document.getElementById("username-error");

    usernameInput.addEventListener("input", function() {
        var username = usernameInput.value.trim();
        if (username.length < 3) {
            usernameError.textContent = "Username must be at least 3 characters long.";
            usernameError.style.display = "inline-block";
        } else {
            usernameError.textContent = "";
            usernameError.style.display = "none";
        }
    });
});