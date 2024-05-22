document.getElementById("id_profile_picture").addEventListener("change", function(event) {
    var reader = new FileReader();
    reader.onload = function() {
        var output = document.getElementById("profile-picture-preview");
        output.src = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
});