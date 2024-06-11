document.addEventListener("DOMContentLoaded", function() {

const updateEmailModal = document.getElementById("updateEmailModal");
const updateUsernameModal = document.getElementById("updateUsernameModal");
const updatePasswordModal = document.getElementById("updatePasswordModal");
const updateEmailModalOpenBtn = document.getElementById("openEditEmailModalBtn");
const updateUsernameModalOpenBtn = document.getElementById("openEditUsernameModalBtn");
const updatePasswordModalOpenBtn = document.getElementById("openEditPasswordModalBtn");
const updateEmailModalCloseBtn = document.getElementById("closeEditEmailModalBtn");
const updateUsernameModalCloseBtn = document.getElementById("closeEditUsernameModalBtn");
const updatePasswordModalCloseBtn = document.getElementById("closeEditPasswordModalBtn");

updateEmailModalOpenBtn.addEventListener("click", () => {openModal(updateEmailModal) ;});
updateUsernameModalOpenBtn.addEventListener("click", () => {openModal(updateUsernameModal) ;});
updatePasswordModalOpenBtn.addEventListener("click", () => {openModal(updatePasswordModal) ;});
updateEmailModalCloseBtn.addEventListener("click", () => {closeModal(updateEmailModal) ;});
updateUsernameModalCloseBtn.addEventListener("click", () => {closeModal(updateUsernameModal) ;});
updatePasswordModalCloseBtn.addEventListener("click", () => {closeModal(updatePasswordModal) ;});

});

function callbackCloseModal(formId) {
    closeModal(document.getElementById(formId.replace('Form', 'Modal')));
}

function callbackUpdatedProfile(formId) {
    console.log("Successfully updated profile");
}