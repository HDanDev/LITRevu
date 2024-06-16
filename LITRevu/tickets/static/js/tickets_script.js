document.addEventListener("DOMContentLoaded", () => {

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

    const TicketsLikeBtns = document.querySelectorAll(".like-btn");
    const TicketsDislikeBtns = document.querySelectorAll(".dislike-btn");
    
    deletionCloseModalBtn.addEventListener("click", () => {closeModal(deletionModal);});
    createCloseModalBtn.addEventListener("click", () => {closeModal(createModal);});
    editCloseModalBtn.addEventListener("click", () => {closeModal(editModal);});

    asyncDeletionModalFormHandlingInit(deletionTicketButtons, deletionModal, deleteItemName);
    asyncModalFormCancel(deletionCancelButton);
    asyncModalFormConfirm(deletionConfirmButton);

    asyncSingleBtnModalFormInit(createTicketButton, createModal, createConfirmButton);
    asyncModalFormCancel(createCancelButton);
    // asyncModalFormConfirm(createConfirmButton);    

    asyncMultipleBtnsModalFormInit(editTicketButtons, editModal, editItemName);
    asyncModalFormCancel(editCancelButton);
    // asyncModalFormConfirm(editConfirmButton);    

    likeListener(TicketsLikeBtns);
    dislikeListener(TicketsDislikeBtns);

        var createReviewCheckbox = document.getElementById("id_create_review");
        var reviewForm = document.getElementById('reviewFormPage');
        var ticketForm = document.getElementById('ticketFormPage');
        var spiral = document.getElementById('spiralDoublePage');
        var closeBtn = document.getElementById('createTicketModalCloseBtn');

        createReviewCheckbox.addEventListener('change', function () {
            if (this.checked) {
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

        const stars = document.querySelectorAll('.rating input[type="radio"]');
    
        stars.forEach(function(star) {
            star.addEventListener('change', function() {
                const selectedStars = this.value;
                const labels = document.querySelectorAll('.rating label');
                
                labels.forEach(function(label, index) {
                    if (index < selectedStars) {
                        label.classList.add('selected');
                    } else {
                        label.classList.remove('selected');
                    }
                });
            });
        });

        createReviewCheckbox.dispatchEvent(new Event('change'));

});