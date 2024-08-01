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

    const viewTicketModal = document.getElementById("viewTicketModal");
    const viewTicketButtons = document.getElementsByClassName("view-ticket-btn");
    const viewTicketCancelButton = document.getElementById("viewTicketModalCloseBtn");

    const viewReviewModal = document.getElementById("viewReviewModal");
    const viewReviewButtons = document.getElementsByClassName("view-review-btn");
    const viewReviewCancelButton = document.getElementById("viewReviewModalCloseBtn");

    const viewUserModal = document.getElementById("viewUserModal");
    const viewUserButtons = document.getElementsByClassName("author");
    const viewUserCancelButton = document.getElementById("viewUserModalCloseBtn");

    //////////// List const list ////////////

    const ticketsLikeBtns = document.querySelectorAll(".like-btn");
    const ticketsDislikeBtns = document.querySelectorAll(".dislike-btn");

    const starCreateTicketReviewRating = document.getElementsByClassName("rating-create-ticket-review-input");
    const labelCreateTicketReviewRating = document.getElementsByClassName("rating-create-ticket-review-label");
    const starCreateSingleRating = document.getElementsByClassName("rating-create-review-input");
    const labelCreateSingleRating = document.getElementsByClassName("rating-create-review-label");
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

    asyncSingleBtnModalFormInit(createTicketButton, createModal, createConfirmButton, callbackCreateTicket);
    asyncModalFormCancel(createCancelButton);

    asyncMultipleBtnsModalFormInit(editTicketButtons, editModal, editConfirmButton, callbackUpdateTicket, editTicketName, FormTypeEnum.EDIT_TICKET);
    asyncModalFormCancel(editCancelButton);

    asyncMultipleBtnsModalFormInit(deletionTicketButtons, deletionModal, deletionConfirmButton, callbackDeleteTicket, deleteTicketName, FormTypeEnum.DELETE_TICKET);
    asyncModalFormCancel(deletionCancelButton);

    asyncMultipleBtnsModalFormInit(createReviewButtons, createReviewModal, createReviewConfirmButton, callbackCreateReview);
    asyncModalFormCancel(createReviewCancelButton);

    asyncMultipleBtnsModalFormInit(editReviewButtons, editReviewModal, editReviewConfirmButton, callbackUpdateReview, editReviewName, FormTypeEnum.EDIT_REVIEW);
    asyncModalFormCancel(editReviewCancelButton);

    asyncMultipleBtnsModalFormInit(deleteReviewButtons, deleteReviewModal, deleteReviewConfirmButton, callbackDeleteReview, deleteReviewName, FormTypeEnum.DELETE_REVIEW);
    asyncModalFormCancel(deleteReviewCancelButton);
    
    const staticBuilder = new DOMBuilder();
    staticBuilder.createReviewModal = createReviewModal;
    staticBuilder.createReviewConfirmButton = createReviewConfirmButton;
    staticBuilder.callbackCreateReview = callbackCreateReview;
    staticBuilder.editModal = editModal;
    staticBuilder.editConfirmButton = editConfirmButton;
    staticBuilder.editTicketName = editTicketName;
    staticBuilder.deletionModal = deletionModal;
    staticBuilder.deletionConfirmButton = deletionConfirmButton;
    staticBuilder.callbackDeleteTicket = callbackDeleteTicket;
    staticBuilder.deleteTicketName = deleteTicketName;
    staticBuilder.viewTicketModal = viewTicketModal;
    staticBuilder.editReviewModal = editReviewModal;
    staticBuilder.editReviewConfirmButton = editReviewConfirmButton;
    staticBuilder.editReviewName = editReviewName;
    staticBuilder.deleteReviewModal = deleteReviewModal;
    staticBuilder.deleteReviewConfirmButton = deleteReviewConfirmButton;
    staticBuilder.callbackDeleteReview = callbackDeleteReview;
    staticBuilder.deleteReviewName = deleteReviewName;
    staticBuilder.viewReviewModal = viewReviewModal;

    openViewModal(viewTicketButtons, (id) => staticBuilder.generateViewTicketModal(id), viewTicketModal);
    asyncModalFormCancel(viewTicketCancelButton);
    
    openViewModal(viewReviewButtons, (id) => staticBuilder.generateViewReviewModal(id), viewReviewModal);
    asyncModalFormCancel(viewReviewCancelButton);
    
    openViewModal(viewUserButtons, async (id) => await staticBuilder.generateViewUserModal(id, await getUserFollows(id)), viewUserModal);
    asyncModalFormCancel(viewUserCancelButton);

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
    followUserManager(".block-btn", callbackMassBlock);
    followUserManager(".follow-btn", callbackMassFollow);
    searchThroughList('filterInput', '.ticket-li', ['.ticket-title', '.ticket-description', '.tag', '.author'], true);
    setRandomColour(document.getElementById("rightPage"));
    brokenImgWatcher();

    window.generateTicket = (targetList, ticketId, ticketImg, ticketTitle, ticketDescription, ticketTags, ticketCreationDate) => {
        staticBuilder.review = null;
        staticBuilder.ticket = addTicketsDataEntry(ticketId, ticketImg, ticketTitle, ticketDescription, ticketTags, ticketCreationDate);
        staticBuilder.generateTicket();
        setRandomColour(staticBuilder.li);

        targetList.appendChild(staticBuilder.li);
    }

    window.generateReview = (targetList, reviewId, reviewImg, reviewTitle, reviewDescription, reviewRating, reviewCreationDate, reviewTicket) => {
        staticBuilder.ticket = null;
        staticBuilder.review = addReviewsDataEntry(reviewId, reviewImg, reviewTitle, reviewDescription, reviewRating, reviewCreationDate, reviewTicket);
        staticBuilder.generateReview();
        setRandomColour(staticBuilder.li);

        targetList.appendChild(staticBuilder.li);
        staticBuilder.publicGenerateAddReviewBtn();
    }

    window.addTicketsDataEntry = (ticketId, ticketImg, ticketTitle, ticketDescription, ticketTags, ticketCreationDate) => {
        let ticketString = ""
        ticketTags.forEach(tag => {
            ticketString += `${tag}, `;
        })
        const newTicket = {
            id: ticketId.toString(),
            title: ticketTitle,
            description: ticketDescription,
            image: ticketImg,
            tags: ticketString,
            author: jsUser.id,
            authorName: jsUser.username,
            isFollowing: "false",
            createdAt: ticketCreationDate
        };
        
        ticketsData.push(newTicket);
        return newTicket;
    }

    window.addReviewsDataEntry = (reviewId, reviewImg, reviewTitle, reviewDescription, reviewRating, reviewCreationDate, reviewTicket) => {
        const newReview = {
            id: reviewId.toString(),
            title: reviewTitle,
            content: reviewDescription,
            coverImage: reviewImg,
            rating: reviewRating,
            author: jsUser.id,
            authorName: jsUser.username,
            isFollowing: "false",
            createdAt: reviewCreationDate,
            ticket: reviewTicket
        };
        
        reviewsData.push(newReview);
        return newReview;
    }
});