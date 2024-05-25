document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.follow-btn').forEach(function(button) {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            const url = this.getAttribute('data-url');
            const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({ user_id: userId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    this.textContent = 'Unfollow';
                } else {
                    this.textContent = 'Follow';
                }
            })
            .catch(error => console.error('Error:', error));
        });
    });
});
