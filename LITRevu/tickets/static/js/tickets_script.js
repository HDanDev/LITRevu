document.addEventListener("DOMContentLoaded", () => {

    //////////// Single elem const list ////////////

    const deletionModal = document.getElementById("deleteTicketModal");
    const deletionConfirmButton = document.getElementById("deleteTicketModalConfirmBtn");
    const deletionCancelButton = document.getElementById("deleteTicketModalCancelBtn");
    const deletionCloseModalBtn = document.getElementById("deleteTicketModalCloseBtn");
    const deleteTicketName = document.getElementById("deleteTicketName");
    const deletionTicketButtons = document.getElementsByClassName("ticket-delete-btn");

    const deleteReviewModal = document.getElementById("deleteReviewModal");
    const deleteReviewConfirmButton = document.getElementById("deleteReviewModalConfirmBtn");
    const deleteReviewCancelButton = document.getElementById("deleteReviewModalCancelBtn");
    const deleteReviewCloseModalBtn = document.getElementById("deleteReviewModalCloseBtn");
    const deleteReviewName = document.getElementById("deleteReviewName");
    const deleteReviewButtons = document.getElementsByClassName("review-delete-btn");

    const createModal = document.getElementById("createTicketModal");
    const createConfirmButton = document.getElementById("createTicketModalConfirmBtn");
    const createCancelButton = document.getElementById("createTicketModalCancelBtn");
    const createCloseModalBtn = document.getElementById("createTicketModalCloseBtn");
    const createTicketButton = document.getElementById("create-ticket-btn");

    const editModal = document.getElementById("editTicketModal");
    const editConfirmButton = document.getElementById("editTicketModalConfirmBtn");
    const editCancelButton = document.getElementById("editTicketModalCancelBtn");
    const editCloseModalBtn = document.getElementById("editTicketModalCloseBtn");
    const editTicketName = document.getElementById("editTicketName");
    const editTicketButtons = document.getElementsByClassName("ticket-edit-btn");

    const editReviewModal = document.getElementById("editReviewModal");
    const editReviewConfirmButton = document.getElementById("editReviewModalConfirmBtn");
    const editReviewCancelButton = document.getElementById("editReviewModalCancelBtn");
    const editReviewCloseModalBtn = document.getElementById("editReviewModalCloseBtn");
    const editReviewName = document.getElementById("editReviewName");
    const editReviewButtons = document.getElementsByClassName("review-edit-btn");

    const createReviewModal = document.getElementById("createReviewModal");
    const createReviewConfirmButton = document.getElementById("createReviewModalConfirmBtn");
    const createReviewCancelButton = document.getElementById("createReviewModalCancelBtn");
    const createReviewCloseModalBtn = document.getElementById("createReviewModalCloseBtn");
    const createReviewButtons = document.getElementsByClassName("review-create-btn");

    //////////// List const list ////////////

    const ticketsLikeBtns = document.querySelectorAll(".like-btn");
    const ticketsDislikeBtns = document.querySelectorAll(".dislike-btn");

    const starCreateTicketReviewRating = document.getElementsByClassName("rating-create-ticket-review-input");
    const labelCreateTicketReviewRating = document.getElementsByClassName("rating-create-ticket-review-label");
    const starCreateSingleRating = document.getElementsByClassName("rating-create-single-input");
    const labelCreateSingleRating = document.getElementsByClassName("rating-create-single-label");
    const starEditSingleRating = document.getElementsByClassName("rating-edit-review-input");
    const labelEditSingleRating = document.getElementsByClassName("rating-edit-review-label");
    
    //////////// Listeners init ////////////

    createCloseModalBtn.addEventListener("click", () => {closeModal(createModal);});
    editCloseModalBtn.addEventListener("click", () => {closeModal(editModal);});
    deletionCloseModalBtn.addEventListener("click", () => {closeModal(deletionModal);});
    createReviewCloseModalBtn.addEventListener("click", () => {closeModal(createReviewModal);});
    editReviewCloseModalBtn.addEventListener("click", () => {closeModal(editReviewModal);});
    deleteReviewCloseModalBtn.addEventListener("click", () => {closeModal(deleteReviewModal);});

    //////////// Functions init ////////////

    asyncSingleBtnModalFormInit(createTicketButton, createModal, createConfirmButton);
    asyncModalFormCancel(createCancelButton);

    asyncMultipleBtnsModalFormInit(editTicketButtons, editModal, editConfirmButton, editTicketName, FormTypeEnum.EDIT_TICKET);
    asyncModalFormCancel(editCancelButton);

    asyncMultipleBtnsModalFormInit(deletionTicketButtons, deletionModal, deletionConfirmButton, deleteTicketName, FormTypeEnum.DELETE_TICKET);
    asyncModalFormCancel(deletionCancelButton);

    asyncMultipleBtnsModalFormInit(createReviewButtons, createReviewModal, createReviewConfirmButton);
    asyncModalFormCancel(createReviewCancelButton);

    asyncMultipleBtnsModalFormInit(editReviewButtons, editReviewModal, editReviewConfirmButton, editReviewName, FormTypeEnum.EDIT_REVIEW);
    asyncModalFormCancel(editReviewCancelButton);

    asyncMultipleBtnsModalFormInit(deleteReviewButtons, deleteReviewModal, deleteReviewConfirmButton, deleteReviewName, FormTypeEnum.DELETE_REVIEW);
    asyncModalFormCancel(deleteReviewCancelButton);

    likeListener(ticketsLikeBtns);
    dislikeListener(ticketsDislikeBtns);

    manageRating(starCreateTicketReviewRating, labelCreateTicketReviewRating);
    manageRating(starCreateSingleRating, labelCreateSingleRating);
    manageRating(starEditSingleRating, labelEditSingleRating);

    imagePreviewManager("editTicketFormImageInput", "editTicketFormImagePreview");
    imagePreviewManager("editReviewFormImageInput", "editReviewFormImagePreview");
    imagePreviewManager("createTicketFormImageInput", "createTicketFormImagePreview");
    imagePreviewManager("reviewFormImageInput", "reviewFormImagePreview");
    imagePreviewManager("createReviewFormImageInput", "createReviewFormImagePreview");
    
    singleToDoublePageSwitcher();
    followUserManager(".follow-btn");
});