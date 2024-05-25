document.addEventListener("DOMContentLoaded", function() {
    var likeBtns = document.querySelectorAll(".like-btn");
    var dislikeBtns = document.querySelectorAll(".dislike-btn");

    function handleVote(event, type) {
        event.preventDefault();
        var btn = event.target;
        var ticketId = btn.getAttribute("data-ticket-id");
        var url = btn.getAttribute("data-ticket-url");
    
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": document.querySelector('input[name="csrfmiddlewaretoken"]').value
            }
        })
        .then(response => response.json())
        .then(data => {
            var likesCount = document.querySelector('.likes-count[data-ticket-id="' + ticketId + '"]');
            var dislikesCount = document.querySelector('.dislikes-count[data-ticket-id="' + ticketId + '"]');
            if (likesCount && dislikesCount) {
                likesCount.textContent = data.likes_count;
                dislikesCount.textContent = data.dislikes_count;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    likeBtns.forEach(function(btn) {
        btn.addEventListener("click", function(event) {
            handleVote(event, "like");
        });
    });

    dislikeBtns.forEach(function(btn) {
        btn.addEventListener("click", function(event) {
            handleVote(event, "dislike");
        });
    });
});
