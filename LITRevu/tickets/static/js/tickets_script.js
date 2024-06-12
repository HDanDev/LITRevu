document.addEventListener("DOMContentLoaded", () => {

    const deletionModal = document.getElementById("deleteTicketModal");
    const confirmButton = document.getElementById("deleteTicketModalConfirmBtn");
    const cancelButton = document.getElementById("deleteTicketModalCancelBtn");
    const closeDeletionModalBtn = document.getElementById("deleteTicketModalCloseBtn");
    const ticketsDeleteButtons = document.getElementsByClassName("ticket-delete-btn");

    const TicketsLikeBtns = document.querySelectorAll(".like-btn");
    const TicketsDislikeBtns = document.querySelectorAll(".dislike-btn");
    
    closeDeletionModalBtn.addEventListener("click", () => {closeModal(deletionModal);});

    deletionValidationInit(ticketsDeleteButtons, deletionModal);
    deletionCancel(cancelButton);
    deletionConfirm(confirmButton);
    likeListener(TicketsLikeBtns);
    dislikeListener(TicketsDislikeBtns);
    
});