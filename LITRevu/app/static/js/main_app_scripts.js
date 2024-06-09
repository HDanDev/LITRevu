document.addEventListener('DOMContentLoaded', function() {
    window.openModal = function(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }
    
    window.closeModal = function(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    window.submitForm = async function(event, formId, callback, url) {
        console.log("everything works")
        event.preventDefault();
        let form = document.getElementById(formId);
        if (!form) {
            console.error('Form not found:', formId);
            return;
        }
        let formData = new FormData(form);
    
        try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: formData
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            let responseData = await response.json();
    
            if (responseData.success) {
                if (callback && typeof callback === 'function') {
                    callback(formId);
                }
                alert(responseData.message);
            } else {
                let errors = '';
                for (let field in responseData.errors) {
                    errors += responseData.errors[field][0] + '\n';
                }
                alert(errors);
            }
        } catch (error) {
            alert('An error occurred while processing your request.');
            console.error('Fetch error:', error);
        }
    };
});