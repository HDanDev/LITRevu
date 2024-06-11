document.addEventListener("DOMContentLoaded", () => {
    const deletionModal = document.getElementById("deleteTicketModal");
    const confirmButton = document.getElementById("deleteTicketModalConfirmBtn");
    const cancelButton = document.getElementById("deleteTicketModalCancelBtn");
    const closeDeletionModalBtn = document.getElementById("deleteTicketModalCloseBtn");
    const ticketsDeleteButtons = document.getElementsByClassName("ticket-delete-btn");

    const likeBtns = document.querySelectorAll(".like-btn");
    const dislikeBtns = document.querySelectorAll(".dislike-btn");
    
    closeDeletionModalBtn.addEventListener("click", () => {closeModal(deletionModal) ;});

    deletionValidationInit(ticketsDeleteButtons, deletionModal);
    deletionCancel(cancelButton);
    deletionConfirm(confirmButton);

    function handleVoteCallback(formId, responseData) {
        let likeFormId = formId;
        let dislikeFormId = formId;
        if (formId.startsWith('like')) dislikeFormId = 'dis' + dislikeFormId;
        else likeFormId = likeFormId.substring(3);
        console.log('like id = ' + likeFormId);
        console.log('dislike id = ' + dislikeFormId);
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

    likeBtns.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            let formId = btn.closest('form').id;
            let url = btn.closest('form').action;
            submitForm(event, formId, handleVoteCallback, url);
        });
    });

    dislikeBtns.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            let formId = btn.closest('form').id;
            let url = btn.closest('form').action;
            submitForm(event, formId, handleVoteCallback, url);
        });
    });
});