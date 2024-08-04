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
let ticketSet = 1;
let isLoadingFeed = false;
let hasNotReachedSetsEnd = true;
const staticDOMBuilder = new DOMBuilder();

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

window.asyncMultipleBtnsModalFormInit = (btnsList, modal, validationBtn, callbackFunction=null, targetId=null, formType=null) => {
    let modalForm = modal.getElementsByTagName('form')[0];
    if (callbackFunction === null) callbackFunction = callbackCloseModal; 
    for (let i = 0; i < btnsList.length; i++) {
        btnsList[i].addEventListener("click", () => {
            let btn = btnsList[i];
            let action = autoFormFill(modal, btn, targetId, formType);
            uniqueBtnListener(validationBtn, modalForm, callbackFunction, action);
        });
    }
}

window.asyncSingleBtnModalFormInit = (btn, modal, validationBtn, callbackFunction=null, targetId=null, formType=null) => {
    let modalForm = modal.getElementsByTagName('form')[0];
    if (callbackFunction === null) callbackFunction = callbackCloseModal; 
    btn.addEventListener("click", () => {
        let action = autoFormFill(modal, btn, targetId, formType);
        console.log(validationBtn, modalForm, callbackFunction, action);
        uniqueBtnListener(validationBtn, modalForm, callbackFunction, action);
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
    if (review.coverImage){
        document.getElementById("editReviewFormImagePreview").src = review.coverImage;
        document.getElementById("editReviewFormImageInput").src = review.coverImage;
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
    if (activeModal) {
        closeModal(activeModal);
    }
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

window.openViewModal = (openModalViewButtons, generatingFunction, targetModal) => {
    Array.prototype.forEach.call(openModalViewButtons, (btn) => {
        openViewModalSubscriber (btn, generatingFunction, targetModal)
    });
}

window.openViewModalSubscriber = (btn, generatingFunction, targetModal, directItemId=null) => {
    btn.onclick = async (event) => {
        event.preventDefault();
        console.log('direct id : ', directItemId);
        directItemId ? generatingFunction(directItemId, await getUserFollows(directItemId)) : generatingFunction(btn.getAttribute("data-item-id"));
        openModal(targetModal);
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

window.ajaxCallPost = async (url, token, jsonBody, callback, source=null) => {
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

window.ajaxCallGet = async (url, token, callback, source=null) => {
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': token,
        }
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

window.callbackBlock = (responseData, source) => {
    iconSwitcher(responseData.is_blocked, source, "checkmark not-validation", "blocked not-validation");
}

window.callbackMassBlock = (responseData, source) => {
    massIconSwitcher(".block-btn", responseData.blocked_user, responseData.is_blocked, "checkmark not-validation", "blocked not-validation");
}

window.callbackFollow = (responseData, source) => {
    iconSwitcher(responseData.status, source, "user-minus", "user-plus");
}

window.callbackMassFollow = (responseData, source) => {
    massIconSwitcher(".follow-btn", responseData.followed_user, responseData.status, "user-minus", "user-plus");
}

window.callbackDeleteTicket = (formId, responseData) => {
    console.log(responseData.id);
    DOMRemove(responseData.id, "ticket");
    callbackCloseModal(formId);
}

window.callbackDeleteReview = (formId, responseData) => {
    console.log(responseData.id);
    DOMRemove(responseData.id, "review");
    callbackCloseModal(formId);
}

window.callbackCreateTicket = (formId, responseData) => {
    console.log(responseData.id);
    const parentList = document.getElementById("tickets-list");
    console.log(parentList);
    generateTicket(parentList, responseData.id, responseData.img, responseData.title, responseData.description, responseData.tags, responseData.creation_date);
    if (responseData.create_review){
        const ticket = document.getElementById(`ticket-${responseData.id}`);
        const reviewList = ticket.querySelector('.reviews-list');
        generateReview(reviewList, responseData.review_id, responseData.review_cover_image, responseData.review_title, responseData.review_content, responseData.review_rating, responseData.review_creation_date, responseData.id);
    }
    if (formId) callbackCloseModal(formId);
}

window.callbackCreateReview = (formId, responseData) => {
    console.log(responseData.id);
    const ticket = document.getElementById(`ticket-${responseData.ticket}`);
    const parentList = ticket.querySelector('.reviews-list');
    generateReview(parentList, responseData.id, responseData.cover_image, responseData.title, responseData.content, responseData.rating, responseData.creation_date, responseData.ticket);
    callbackCloseModal(formId);
}

window.callbackUpdateTicket = (formId, responseData) => {
    staticDOMBuilder.updateTicket(responseData.ticket.id, responseData.ticket.image_url, responseData.ticket.title, responseData.ticket.description, responseData.ticket.tags);
    const ticket = ticketsData.find(t => t.id == responseData.ticket.id);
    let ticketString = "";
    responseData.ticket.tags.forEach(tag => {
        ticketString += `${tag}, `;
    });
    ticket.title = responseData.ticket.title;
    ticket.description = responseData.ticket.description;
    ticket.image = responseData.ticket.image_url;
    ticket.tags = ticketString;
    callbackCloseModal(formId);
}

window.callbackUpdateReview = (formId, responseData) => {
    staticDOMBuilder.updateReview(responseData.review.id, responseData.review.cover_image_url, responseData.review.title, responseData.review.rating, responseData.review.content);
    const review = reviewsData.find(r => r.id == responseData.review.id);
    review.title = responseData.review.title;
    review.content = responseData.review.content;
    review.coverImage = responseData.review.cover_image_url;
    review.rating = responseData.review.rating;
    callbackCloseModal(formId);
}

window.callbackGetUserFollows = (responseData, notRequiredSource) => {
    if (responseData.success && !checkIfExistsInArray(followersData, responseData.id)) {
        followersData.push({
            id: responseData.id,
            following: responseData.following,
            followers: responseData.followers
        });
    }
    else console.log(responseData.error);
}

window.callbackFeedFiller = (responseData, notRequiredSource) => {

    responseData.data.forEach(ticket => {
        const ticketList = document.getElementById("tickets-list");
        generateTicket(ticketList, ticket.id, ticket.img, ticket.title, ticket.description, ticket.tags, ticket.creation_date, ticket.author);
        if (ticket.reviews && ticket.reviews.length > 0) {
            const targetTicket = document.getElementById(`ticket-${ticket.id}`);
            const reviewList = targetTicket.querySelector('.reviews-list');
            ticket.reviews.forEach(review => {
                generateReview(reviewList, review.id, review.cover_image, review.title, review.content, review.rating, review.creation_date, ticket.id, review.author);
            });
        }
    });

    // document.getElementById('ticket-container').insertAdjacentHTML('beforeend', responseData.data);
    document.getElementById('loading').style.display = 'none';
    isLoadingFeed = false;
    hasNotReachedSetsEnd = responseData.has_more_sets;
    // setRandomColour(document.getElementById("rightPage"));
}

window.DOMRemove = (targetId, targetName) => {
    document.getElementById(targetName + "-" + targetId).remove();
}

window.iconSwitcher = (condition, source, trueIcon, falseIcon) => {
    source.innerHTML = condition ? `<i class="icon-${trueIcon}"></i>` : `<i class="icon-${falseIcon}"></i>`;
}

window.massIconSwitcher = (targetClass, followedUserId, condition, trueIcon, falseIcon) => {
    let targetList = document.querySelectorAll(targetClass);
    let concernedTargetList = Array.from(targetList).filter(i => i.getAttribute("data-user-id") == followedUserId);
    let innerHTMLIcon = condition ? `<i class="icon-${trueIcon}"></i>` : `<i class="icon-${falseIcon}"></i>`;
    concernedTargetList.forEach((l) => {
        l.innerHTML = innerHTMLIcon;
    });
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
    const handleSubmit = (event) => {
        submitForm(event, form, callbackFunction, url);
    };

    btn.removeEventListener("click", btn._handleSubmit);
    btn.addEventListener("click", handleSubmit);
    btn._handleSubmit = handleSubmit;
};

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

window.followUserManager = (btnClassName, callback) => {
    document.querySelectorAll(btnClassName).forEach((button) => {
        followBtnListenerSetup(button, callback);
    });
}

window.followBtnListenerSetup = (btn, callback) => {
    btn.addEventListener('click', (event) => {
        const btn = event.target.closest('button');
        const userId = btn.getAttribute('data-user-id');
        const url = btn.getAttribute('data-url');
        const jsonBody = JSON.stringify({ user_id: userId });
        console.log(btn, userId, url, jsonBody);
        ajaxCallPost(url, jsCsrfToken, jsonBody, callback, btn);
    });
}

window.isNullOrWhitespace = (string) => {
    return !string || string.trim().length === 0;
}

window.searchThroughList = (inputId, querySelectorValue, subQuerySelectorValue, isIgnoringNullInput=false) => {
    document.getElementById(inputId).addEventListener('keyup', (event) => {
        const filterValue = event.target.value.toLowerCase().trim();
        const items = document.querySelectorAll(querySelectorValue);

        items.forEach(item => {
            let isToBeHidden = true;
            subQuerySelectorValue.forEach(subItemSelector => {
                const subItem = item.querySelector(subItemSelector);
                if (subItem) {
                    const subItemText = subItem.innerHTML.toLowerCase();
                    if (subItemText.includes(filterValue) && (!isNullOrWhitespace(filterValue) || isIgnoringNullInput)) {
                        isToBeHidden = false;
                    }
                }
            });
            if(isToBeHidden) {
                item.classList.add('d-none');
            } else {
                item.classList.remove('d-none');
            }
        });
    });
}

window.getUserFollowsBackend = async (id) => {
    const url = `${absoluteUrl}user/${id}/followers_and_followings/`;
    const jsonBody = JSON.stringify({ user_pk: id });

    try {
        await ajaxCallPost(url, jsCsrfToken, jsonBody, callbackGetUserFollows);
        let result = getUserFollowsFrontend(id);
        if (!result){
            const maxRetries = 5;
            const delay = 1000; // Delay in milliseconds
            try {
                for (let attempt = 0; attempt < maxRetries; attempt++) {
                    result = getUserFollowsFrontend(id);
                    if (result) {
                        break;
                    }
                    console.log(`Attempt ${attempt + 1} data not implemented yet...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
                if (!result) {
                    console.error('Failed to fetch user list after multiple attempts');
                    return null;
                }
                return {
                    following: result.following,
                    followers: result.followers
                };
            } catch (error) {
                console.error('Error fetching user list:', error);
            }
        }
    } catch (error) {
        console.error('Failed to fetch user follow data:', error);
        return null;
    }
}

window.getUserFollowsFrontend = (id) => {
    const targetFollowData = getItemInArray(followersData, id);
    if (targetFollowData != null) {
        return {
            following: targetFollowData.following,
            followers: targetFollowData.followers
        }
    } 
}

window.getUserFollows = async (id) => {
    let result = getUserFollowsFrontend(id);
    const targetFollowData = getItemInArray(followersData, id);
    if (!targetFollowData) {
        result = await getUserFollowsBackend(id);
    }
    return result;
}

window.checkIfExistsInArray = (array, id) => {
    return array.some(item => String(item.id) === String(id));
}

window.getItemInArray = (array, id) => {
    return array.find(item => String(item.id) === String(id));
}

window.setRandomColour = (target) => {
    target.querySelectorAll(".custom-colour-target").forEach(i => {
        i.classList.add(`colour-${Math.floor(Math.random() * 10)}`);
    })
}

window.brokenImgWatcher = () => {
    const defaultImage = "/static/images/PPPlaceholder.PNG";
    document.querySelectorAll('img').forEach(img => {
        img.onerror = (event) => {
            event.target.onerror = null;
            event.target.src = defaultImage;
        };
    });
    setBackgroundImage(".item-background", defaultImage);
    setBackgroundImage(".review-img", defaultImage);
}

window.setBackgroundImage = (elementList, defaultImage) => {
    document.querySelectorAll(elementList).forEach(bgElement => {
        const bgSrc = bgElement.getAttribute('data-src');
        const img = new Image();
        img.onload = () => {
            bgElement.style.backgroundImage = `url(${bgSrc})`;
        };
        img.onerror = () => {
            bgElement.style.backgroundImage = `url(${defaultImage})`;
        };
        img.src = bgSrc;
    });
}

window.switchModal = (sourceModal, targetModal) => {}
  