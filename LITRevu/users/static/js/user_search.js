function searchUsers() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";

    fetch(`/search-user/?query=${input}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                let li = document.createElement("li");
                li.textContent = user.username;
                searchResults.appendChild(li);
            });
        });
}