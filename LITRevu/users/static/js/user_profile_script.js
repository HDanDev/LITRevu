document.addEventListener("DOMContentLoaded", function() {

    const updateEmailModal = document.getElementById("updateEmailModal");
    const updateEmailModalOpenBtn = document.getElementById("openEditEmailModalBtn");
    const updateEmailFormValidationBtn = document.getElementById("updateEmailFormValidationBtn");
    const updateEmailModalCloseBtn = document.getElementById("closeEditEmailModalBtn");
    const updateEmailForm = document.getElementById("updateEmailForm");

    const updateUsernameModal = document.getElementById("updateUsernameModal");
    const updateUsernameModalOpenBtn = document.getElementById("openEditUsernameModalBtn");
    const updateUsernameFormValidationBtn = document.getElementById("updateUsernameFormValidationBtn");
    const updateUsernameModalCloseBtn = document.getElementById("closeEditUsernameModalBtn");
    const updateUsernameForm = document.getElementById("updateUsernameForm");

    const updatePasswordModal = document.getElementById("updatePasswordModal");
    const updatePasswordModalOpenBtn = document.getElementById("openEditPasswordModalBtn");
    const updatePasswordFormValidationBtn = document.getElementById("updatePasswordFormValidationBtn");
    const updatePasswordModalCloseBtn = document.getElementById("closeEditPasswordModalBtn");
    const updatePasswordForm = document.getElementById("updatePasswordForm");


    updateEmailModalOpenBtn.addEventListener("click", () => {openModal(updateEmailModal) ;});
    updateEmailModalCloseBtn.addEventListener("click", () => {closeModal(updateEmailModal) ;});

    updateUsernameModalOpenBtn.addEventListener("click", () => {openModal(updateUsernameModal) ;});
    updateUsernameModalCloseBtn.addEventListener("click", () => {closeModal(updateUsernameModal) ;});

    updatePasswordModalOpenBtn.addEventListener("click", () => {openModal(updatePasswordModal) ;});
    updatePasswordModalCloseBtn.addEventListener("click", () => {closeModal(updatePasswordModal) ;});    

    uniqueBtnListener(updateEmailFormValidationBtn, updateEmailForm, callbackUpdateEmail, updateEmailForm.action);
    uniqueBtnListener(updateUsernameFormValidationBtn, updateUsernameForm, callbackUpdatedUsername, updateUsernameForm.action);
    uniqueBtnListener(updatePasswordFormValidationBtn, updatePasswordForm, callbackUpdatedPassword, updatePasswordForm.action);

    imagePreviewManager("id_profile_picture", "profile-picture-preview");
    followUserManager(".follow-btn", callbackFollow);
    searchThroughList('filterInput', '.user-li', ['a'])
});