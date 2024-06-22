class FormTypeEnum {
    
    static EDIT_TICKET =  'edit_ticket';
    static DELETE_TICKET =  'delete_ticket';
    static EDIT_REVIEW =  'edit_review';
    static DELETE_REVIEW =  'delete_review';
    static EDIT_COMMENT =  'edit_comment';
    static DELETE_COMMENT =  'delete_comment';

    static values() {
        return [
            FormTypeEnum.EDIT_TICKET,
            FormTypeEnum.DELETE_TICKET,
            FormTypeEnum.EDIT_REVIEW,
            FormTypeEnum.DELETE_REVIEW,
            FormTypeEnum.EDIT_COMMENT,
            FormTypeEnum.DELETE_COMMENT
        ];
    }
}

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

window.asyncMultipleBtnsModalFormInit = (btnsList, modal, validationBtn, targetId=null, formType=null) => {
    let modalForm = modal.getElementsByTagName('form')[0];
    for (let i = 0; i < btnsList.length; i++) {
        btnsList[i].addEventListener("click", () => {
            let btn = btnsList[i];
            action = autoFormFill(modal, btn, targetId, formType);
            uniqueBtnListener(validationBtn, modalForm, callbackCloseModal, action);
        });
    }
}

window.asyncSingleBtnModalFormInit = (btn, modal, validationBtn, targetId=null, formType=null) => {
    let modalForm = modal.getElementsByTagName('form')[0];
    btn.addEventListener("click", () => {
        action = autoFormFill(modal, btn, targetId, formType);
        uniqueBtnListener(validationBtn, modalForm, callbackCloseModal, action);
    });
}

window.autoFormFill = (targetModal, btn, targetId=null, formType=null) => {
    action = btn.getAttribute("data-item-action");
    targetModal.action = action;
    if (formType != null && targetId != null) {
        const objectId = btn.getAttribute("data-item-id");
        switch (formType) {
            case FormTypeEnum.EDIT_TICKET:
                editTicketPopulateModal(targetId, objectId);
                break;
            case FormTypeEnum.DELETE_TICKET:
                deleteTicketPopulateModal(targetId, objectId);
                break;
            case FormTypeEnum.EDIT_REVIEW:
                editReviewPopulateModal(targetId, objectId);
                break;
            case FormTypeEnum.DELETE_REVIEW:
                deleteReviewPopulateModal(targetId, objectId);
                break;
            case FormTypeEnum.EDIT_COMMENT:
                // populateModal(targetId, objectId);
                break;
            case FormTypeEnum.DELETE_COMMENT:
                // populateModal(targetId, objectId);
                break;
            default:
            break;
        }
    }
    openModal(targetModal);
    return action;
}

window.editTicketPopulateModal = (targetId, objectId) => {   
    const ticket = ticketsData.find(t => t.id === objectId);
    const form = targetId.closest('form');
    targetId.innerHTML = ticket.title;
    form.querySelector("#id_title").value = ticket.title;
    form.querySelector("#id_description").value = ticket.description;
    form.querySelector("#id_tags").value = ticket.tags;
    if (ticket.image){
        document.getElementById("editTicketFormImagePreview").src = ticket.image;
        document.getElementById("editTicketFormImageInput").src = ticket.image;
    }
}

window.editReviewPopulateModal = (targetId, objectId) => {    
    const review = reviewsData.find(r => r.id === objectId);
    const form = targetId.closest('form');
    targetId.innerHTML = review.title;
    form.querySelector("#id_title").value = review.title;
    form.querySelector("#id_content").value = review.content;
    if (review.cover_image_url){
        document.getElementById("editReviewFormImagePreview").src = review.cover_image_url;
        document.getElementById("editReviewFormImageInput").src = review.cover_image_url;
    }
    setRadioValue(document.getElementById("editSingleRating"), review.rating);
}

window.deleteTicketPopulateModal = (targetId, objectId) => {    
    const ticket = ticketsData.find(t => t.id === objectId);
    targetId.innerHTML = ticket.title;
}

window.deleteReviewPopulateModal = (targetId, objectId) => {    
    const review = reviewsData.find(r => r.id === objectId);
    targetId.innerHTML = review.title;
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

window.callbackFollow = (responseData, source) => {
    if (responseData.status) {
        source.innerHTML = '<i class="icon-user-minus"></i>';
    } else {
        source.innerHTML = '<i class="icon-user-plus"></i>';
    }
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

window.setRadioValue = (input, value) => {
    const inputs = input.querySelectorAll("input");
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value == value) {
            inputs[i].checked = true;
            inputs[i].click();
            break;
        }
    }
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

window.imagePreviewManager = (imageInputId, previewPlaceholder) => {
    document.getElementById(imageInputId).addEventListener("change", function(event) {
        var reader = new FileReader();
        reader.onload = function() {
            var output = document.getElementById(previewPlaceholder);
            output.src = reader.result;
        }
        reader.readAsDataURL(event.target.files[0]);
    });
}

window.followUserManager = (btnClassName) => {
    document.querySelectorAll(btnClassName).forEach((button) => {
        button.addEventListener('click', (event) => {
            const btn = event.target.closest('button');
            const userId = btn.getAttribute('data-user-id');
            const url = btn.getAttribute('data-url');
            const csrfToken = btn.getAttribute('data-token');
            const jsonBody = JSON.stringify({ user_id: userId });
            ajaxCall(url, csrfToken, jsonBody, callbackFollow, btn);
        });
    });
}