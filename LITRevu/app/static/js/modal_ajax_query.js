let activeModal;

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

window.asyncMultipleBtnsModalFormInit = (btnsList, modal, validationBtn, targetElem=null) => {
    let modalForm = modal.getElementsByTagName('form')[0];
    for (let i = 0; i < btnsList.length; i++) {
        btnsList[i].addEventListener("click", () => {
            let btn = btnsList[i];
            action = autoFormFill(modal, btn, targetElem);
            uniqueBtnListener(validationBtn, modalForm, callbackCloseModal, action);
        });
    }
}

window.asyncSingleBtnModalFormInit = (btn, modal, validationBtn, targetElem=null) => {
    let modalForm = modal.getElementsByTagName('form')[0];
    btn.addEventListener("click", () => {
        action = autoFormFill(modal, btn, targetElem);
        uniqueBtnListener(validationBtn, modalForm, callbackCloseModal, action);
    });
}

window.autoFormFill = (targetModal, btn, targetElem=null) => {
    action = btn.getAttribute("data-item-action")
    targetModal.action = action;
    if (targetElem != null) {
        document.getElementById(targetElem);
        let itemName = btn.getAttribute("data-item-name");
        targetElem.innerHTML = itemName;
    }
    openModal(targetModal);
    return action;
}

window.asyncModalFormCancel = (cancelBtn) => {
    cancelBtn.onclick = (event) => {
        event.preventDefault();
        activeModal.style.display = "none";
        activeModal = null;
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

window.submitForm = async (event, form, callback, url) => {
    event.preventDefault();
    if (!form) {
        console.error('Form not found');
        return;
    }
    console.log(form);
    let formData = new FormData(form);
    console.log(formData);

    try {
        ajaxCallFromForm(url, callback, formData, form);        
    } catch (error) {
        alert('An error occurred while processing your request.');
        console.error('Fetch error:', error);
    }
};

window.ajaxCallFromForm = async (url, callback, formData, form) => {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData
    });
    handleResponse(response, callback, form);
}

window.ajaxCall = async (url, token, jsonBody, callback, source=null) => {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': token,
        },
        body: jsonBody
    });
    handleResponse(response, callback, null, source);
}

window.handleResponse = async (response, callback, form=null, source=null) => {
    if (!response.ok) {
        console.error('Network response was not ok', response.status, response.statusText);
        throw new Error('Network response was not ok');
    }

    let responseData = await response.json();
    console.log('Response data:', responseData);

    if (responseData.success) {
        console.log('is success');
        if (callback && typeof callback === 'function') {
            if (form != null){
                callback(form.id, responseData);
            } 
            else {
                callback(responseData, source);
            } 
        }
        alert(responseData.message);
    } else {
        let errors = '';
        for (let field in responseData.errors) {
            errors += responseData.errors[field][0] + '\n';
        }
        alert(responseData.message, errors);
    }
}

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
            let form = btn.closest('form');
            let url = btn.closest('form').action;
            submitForm(event, form, handleVoteCallback, url);
        });
    });
}

window.dislikeListener = (dislikeBtns) => {
    dislikeBtns.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            let form = btn.closest('form');
            let url = btn.closest('form').action;
            submitForm(event, form, handleVoteCallback, url);
        });
    });
}

window.uniqueBtnListener = (btn, form, callbackFunction, url) => {
    btn.addEventListener("click", (event) => {
        submitForm(event, form, callbackFunction, url);
    });
}

window.manageRating = (stars, labels) => {
    let previousStar = null;

    Array.prototype.forEach.call(stars, (star, s) => {
        star.addEventListener("click", (event) => {
            let selectedStars = event.target;
            // console.log(event.target.closest('form').id);
            
            if (selectedStars == previousStar) {
                let lastRadioButton = stars[stars.length - 1];
                lastRadioButton.checked = true;
                Array.prototype.forEach.call(labels, (label) => {
                    label.classList.add('selected');
                });
                previousStar = null;
            } else {
                Array.prototype.forEach.call(labels, (label, l) => {
                    if (l < selectedStars) {
                        label.classList.add('selected');
                    } else {
                        label.classList.remove('selected');
                    }
                });
                previousStar = selectedStars;
            }
        });
    });
}

window.singleToDoublePageSwitcher = () => {

    var createReviewCheckbox = document.getElementById("id_create_review");
    var reviewForm = document.getElementById('reviewFormPage');
    var ticketForm = document.getElementById('ticketFormPage');
    var spiral = document.getElementById('spiralDoublePage');
    var closeBtn = document.getElementById('createTicketModalCloseBtn');

    createReviewCheckbox.addEventListener('change', (event) => {
        if (event.target.checked) {
            reviewForm.classList.remove('d-none');
            ticketForm.classList.add('double-page-layout');
            spiral.classList.remove('double-page-spiral-modal');
            closeBtn.classList.add('double-page-close');
        } else {
            reviewForm.classList.add('d-none');
            ticketForm.classList.remove('double-page-layout');
            spiral.classList.add('double-page-spiral-modal');
            closeBtn.classList.remove('double-page-close');
        }
    });

    createReviewCheckbox.dispatchEvent(new Event('change'));
}