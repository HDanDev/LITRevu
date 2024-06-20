document.addEventListener("DOMContentLoaded", () => {

    //////////// Single elem const list ////////////

    const deletionModal = document.getElementById("deleteTicketModal");
    const deletionConfirmButton = document.getElementById("deleteTicketModalConfirmBtn");
    const deletionCancelButton = document.getElementById("deleteTicketModalCancelBtn");
    const deletionCloseModalBtn = document.getElementById("deleteTicketModalCloseBtn");
    const deleteItemName = document.getElementById("deleteItemName");
    const deletionTicketButtons = document.getElementsByClassName("ticket-delete-btn");

    const createModal = document.getElementById("createTicketModal");
    const createConfirmButton = document.getElementById("createTicketModalConfirmBtn");
    const createCancelButton = document.getElementById("createTicketModalCancelBtn");
    const createCloseModalBtn = document.getElementById("createTicketModalCloseBtn");
    const createTicketButton = document.getElementById("create-ticket-btn");

    const editModal = document.getElementById("editTicketModal");
    const editConfirmButton = document.getElementById("editTicketModalConfirmBtn");
    const editCancelButton = document.getElementById("editTicketModalCancelBtn");
    const editCloseModalBtn = document.getElementById("editTicketModalCloseBtn");
    const editItemName = document.getElementById("editItemName");
    const editTicketButtons = document.getElementsByClassName("ticket-edit-btn");

    //////////// List const list ////////////

    const ticketsLikeBtns = document.querySelectorAll(".like-btn");
    const ticketsDislikeBtns = document.querySelectorAll(".dislike-btn");
    const reviewsCreateBtns = document.querySelectorAll(".review-create-btn");
    const stars = document.querySelectorAll('.rating input[type="radio"]');
    const starsLabels = document.querySelectorAll('.rating label');
    
    //////////// Listeners init ////////////

    deletionCloseModalBtn.addEventListener("click", () => {closeModal(deletionModal);});
    createCloseModalBtn.addEventListener("click", () => {closeModal(createModal);});
    editCloseModalBtn.addEventListener("click", () => {closeModal(editModal);});

    //////////// Functions init ////////////

    asyncDeletionModalFormHandlingInit(deletionTicketButtons, deletionModal, deleteItemName);
    asyncModalFormCancel(deletionCancelButton);
    asyncModalFormConfirm(deletionConfirmButton);

    asyncSingleBtnModalFormInit(createTicketButton, createModal, createConfirmButton);
    asyncModalFormCancel(createCancelButton);

    asyncMultipleBtnsModalFormInit(editTicketButtons, editModal, editItemName);
    asyncModalFormCancel(editCancelButton);

    likeListener(ticketsLikeBtns);
    dislikeListener(ticketsDislikeBtns);
    manageRating(stars, starsLabels);
    singleToDoublePageSwitcher();
});