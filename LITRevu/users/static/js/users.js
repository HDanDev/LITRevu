window.callbackFollow = (responseData, source) => {
    if (responseData.status) {
        source.innerHTML = '<i class="icon-user-minus"></i>';
    } else {
        source.innerHTML = '<i class="icon-user-plus"></i>';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.follow-btn').forEach(function(button) {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            const url = this.getAttribute('data-url');
            const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
            const jsonBody = JSON.stringify({ user_id: userId });
            ajaxCall(url, csrfToken, jsonBody, callbackFollow, this);
        });
    });
});
