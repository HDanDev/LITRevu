let activeModal;
let formToSubmit;

document.addEventListener("DOMContentLoaded", function() {
    const navigationMenuBackground = document.getElementById('navigationMenuBackground');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navigationMenuBackground.classList.add('scrolled');
        } else {
            navigationMenuBackground.classList.remove('scrolled');
        }
    });
});


window.deletionValidationInit = (deleteButtons, modal) => {
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", (event) => {
            event.preventDefault();
            let button = event.target;
            formToSubmit = button.closest('form');
            let itemName = button.getAttribute("data-item-name");
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

window.handleVoteCallback = (formId, responseData) => {
    let likeFormId = formId;
    let dislikeFormId = formId;
    if (formId.startsWith('like')) dislikeFormId = 'dis' + dislikeFormId;
    else likeFormId = likeFormId.substring(3);
    let likeForm = document.getElementById(likeFormId);
    let dislikeForm = document.getElementById(dislikeFormId);
    if (likeForm) {
        let likesCountSpan = likeForm.querySelector('.likes-count');
        if (likesCountSpan) {
            likesCountSpan.textContent = responseData.likes_count;
        }
    }
    if (dislikeForm) {
        let dislikesCountSpan = dislikeForm.querySelector('.dislikes-count');
        if (dislikesCountSpan) {
            dislikesCountSpan.textContent = responseData.dislikes_count;
        }
    }
}

window.callbackCloseModal = (formId) => {
    closeModal(document.getElementById(formId.replace('Form', 'Modal')));
}

window.callbackUpdateEmail = (formId, responseData) => {
    ProfileUpdateFeedback(formId, responseData, "feedbackProfileEmailDiv", "Email", "userProfileEmail");
}

window.callbackUpdatedUsername = (formId, responseData) => {
    ProfileUpdateFeedback(formId, responseData, "feedbackProfileUsernameDiv", "Username", "userProfileUsername");
}

window.callbackUpdatedPassword = (formId, responseData) => {
    ProfileUpdateFeedback(formId, responseData, "feedbackProfilePasswordDiv", "Password", "userProfilePassword");
}

window.ProfileUpdateFeedback = (formId, responseData, divId, innerHtmlText, targetInfo) => {
    clearProfileFeedbacks();
    const targetElem = document.getElementById(targetInfo);
    targetElem.innerHTML = "";
    if (divId == "feedbackProfileEmailDiv") {
        targetElem.innerHTML = responseData.email;
    }
    else if (divId == "feedbackProfileUsernameDiv"){
        targetElem.innerHTML = responseData.username;
    }
    const div = document.getElementById(divId);
    div.className = "profile-info feedback success";
    const icon = document.createElement('i');
    icon.classList.add('icon-checkmark');
    div.appendChild(icon);
    div.innerHTML += innerHtmlText + " updated successfully";
    closeModal(document.getElementById(formId.replace('Form', 'Modal')));
}

window.clearProfileFeedbacks = () => {
    const feedbackProfileEmailDiv = document.getElementById("feedbackProfileEmailDiv");
    const feedbackProfileUsernameDiv = document.getElementById("feedbackProfileUsernameDiv");
    const feedbackProfilePasswordDiv = document.getElementById("feedbackProfilePasswordDiv");
    feedbackProfileEmailDiv.innerHTML = "";
    feedbackProfileUsernameDiv.innerHTML = "";
    feedbackProfilePasswordDiv.innerHTML = "";
    feedbackProfileEmailDiv.className = "";
    feedbackProfileUsernameDiv.className = "";
    feedbackProfilePasswordDiv.className = "";
}

window.likeListener = (likeBtns) => {
    likeBtns.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            let formId = btn.closest('form').id;
            let url = btn.closest('form').action;
            submitForm(event, formId, handleVoteCallback, url);
        });
    });
}

window.dislikeListener = (dislikeBtns) => {
    dislikeBtns.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            let formId = btn.closest('form').id;
            let url = btn.closest('form').action;
            submitForm(event, formId, handleVoteCallback, url);
        });
    });
}

window.uniqueBtnListener = (btn, callbackFunction) => {
    btn.addEventListener("click", (event) => {
        let formId = btn.closest('form').id;
        let url = btn.closest('form').action;
        submitForm(event, formId, callbackFunction, url);
    });
}