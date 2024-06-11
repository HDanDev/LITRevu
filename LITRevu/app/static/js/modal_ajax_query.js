let activeModal;
let formToSubmit;

window.deletionValidationInit = (deleteButtons, modal) => {
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", (event) => {
            event.preventDefault();
            formToSubmit = this.closest('form');
            let itemName = this.getAttribute("data-item-name");
            document.getElementById("itemName").textContent = itemName;
            openModal(modal);
        });
    }
}

window.deletionCancel = (cancelBtn) => {
    cancelBtn.onclick = (event) => {
        event.preventDefault();
        activeModal.style.display = "none";
        activeModal = null;
    } 
}

window.deletionConfirm = (confirmBtn) => {
    confirmBtn.onclick = () => {
        if (formToSubmit) {
            let tempFormToSubmit = formToSubmit;
            formToSubmit = null;
            tempFormToSubmit.submit();
        }
    }
}

window.openModal = (modal) => {
    modal.style.display = 'flex';
    activeModal = modal;
}

window.closeModal = (modal) => {
    modal.style.display = 'none';
    activeModal = null;
}

window.onclick = (event) => {
    if (event.target == activeModal) {
        activeModal.style.display = "none";
        activeModal = null;
    }
}

window.submitForm = async (event, formId, callback, url) => {
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
                callback(formId, responseData);
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