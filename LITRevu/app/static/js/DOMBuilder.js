class DOMBuilder {
    constructor(
        ticket=null,
        review=null,
    ) {
        this.ticket = ticket;
        this.review = review;
        this.li = null;
        this.createReviewModal = null;
        this.createReviewConfirmButton = null;
        this.callbackCreateReview = null;
        this.editModal = null;
        this.editConfirmButton = null;
        this.editTicketName = null;
        this.deletionModal = null;
        this.deletionConfirmButton = null;
        this.callbackDeleteTicket = null;
        this.deleteTicketName = null;
        this.viewTicketModal = null;
        this.editReviewModal = null;
        this.editReviewConfirmButton = null;
        this.editReviewName = null;
        this.deleteReviewModal = null;
        this.deleteReviewConfirmButton = null;
        this.callbackDeleteReview = null;
        this.deleteReviewName = null;
        this.viewUserModal = null;
        this.csrfToken = null;
        this.blockedUsers = null;
        this.followingUsers = null;
    }  

    generateLi (objectName="ticket", id=this.ticket.id) {
        const li = document.createElement('li');
        li.id = `${objectName}-${id}`;
        li.classList.add(`${objectName}-li`);
        return li;
    }

    generateItemContainer (objectName="item") {
        const itemContainer = document.createElement('div');
        itemContainer.classList.add(`${objectName}-container`);
        return itemContainer;
    }

    generateImage (imgClassName="item-background", src=this.ticket.image) {
        const itemBackground = document.createElement('div');
        itemBackground.classList.add(imgClassName);
        itemBackground.dataset.src = src;
        itemBackground.style.backgroundImage = `url(${src})`;
        return itemBackground;
    }

    generateHeader (headerSize='h3') {
        const header = document.createElement(headerSize);
        header.classList.add('aligned', 'item-infos', 'stylish-header');
        return header;
    }

    generateTitle (id=this.ticket.id, titleClasses=[]) {
        const titleLink = document.createElement('a');
        if (titleClasses.length > 0) {
            titleClasses.forEach(cls => titleLink.classList.add(cls));
        }
        else {
            titleLink.classList.add('ticket-title', 'item-title', 'view-ticket-btn', 'title', 'custom-colour-target');
            titleLink.textContent = this.ticket.title;
        }
        titleLink.dataset.itemId = id;
        titleLink.href = '';
        return titleLink;
    }

    generateTitleSpan () {
        const spanTitle = document.createElement('span');
        spanTitle.classList.add('font-style', 'title', 'custom-colour-target');
        spanTitle.textContent = this.review.title;
        return spanTitle;
    }

    generateRatingPreview () {
        const ratingPreview = document.createElement('div');
        ratingPreview.classList.add('rating-preview');
        if (this.review.rating !== 0) {
            for (let i = 0; i < this.review.rating; i++) {
                ratingPreview.textContent += '☆';
            }
        }
        return ratingPreview;
    }

    generateButton (btnId=null, btnName=null, btnClasses=[], objectId=this.ticket.id, objectName=this.ticket.title, btnUrl=null, btnInner=null) {
        const button = document.createElement('button');
        button.type = 'button';
        button.id = btnId;
        button.name = btnName;
        if (btnClasses.length > 0) {
            btnClasses.forEach(cls => button.classList.add(cls));
        }
        button.dataset.itemId = objectId;
        button.dataset.itemName = objectName;
        button.dataset.itemAction = btnUrl;
        button.innerHTML = btnInner;
        return button;
    }

    generateDescription (objectName="ticket", id=this.ticket.id, content=this.ticket.description) {
        const descriptionLink = document.createElement('a');
        descriptionLink.classList.add('item-infos', `view-${objectName}-btn`);
        if (objectName != "ticket") descriptionLink.classList.add('font-style');
        descriptionLink.dataset.itemId = id;
        descriptionLink.href = '';
        const descriptionParagraph = document.createElement('p');
        descriptionParagraph.classList.add(`${objectName}-description`, 'sample-text');
        descriptionParagraph.textContent = content;
        descriptionLink.appendChild(descriptionParagraph);
        return descriptionLink;
    }

    generateTagContainer () {
        const tagContainer = document.createElement('div');
        tagContainer.classList.add('tag-container', 'item-infos');
        const tagsArray = this.ticket.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        tagsArray.forEach(tag => {
            const tagDiv = document.createElement('div');
            tagDiv.classList.add('tag');
            tagDiv.textContent = tag;
            tagContainer.appendChild(tagDiv);
        });
        return tagContainer;
    }

    generateinfoLikesBlock (isMini=false, creationDate=this.ticket.createdAt) {
        const infoLikesBlock = document.createElement('div');
        infoLikesBlock.classList.add('item-infos', 'info-likes-block');
        const infoParagraph = document.createElement('p');
        infoParagraph.classList.add('no-margin');
        if (isMini)
            {
                infoLikesBlock.classList.add('mini-likes');
                infoParagraph.classList.add('mini-font');
            } 
        infoParagraph.innerHTML = `Posted on ${new Date(creationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} by `;
        const object = this.ticket ? this.ticket : this.review;
        const authorLink = this.generateUserLink(object, isMini);

        infoParagraph.appendChild(authorLink);
            
        const followBlockBtns = this.generateFollowBlockBtns(object.author);

        infoParagraph.appendChild(followBlockBtns.followButton);
        infoParagraph.appendChild(followBlockBtns.blockButton);

        infoLikesBlock.appendChild(infoParagraph);

        if (object.author != jsUser.id) infoLikesBlock.appendChild(this.generateLikeBlock());

        return infoLikesBlock;
    }

    generateLikeBlock () {
        const container = document.createElement('div');
        container.classList.add('like-container');
        const item = this.ticket ? this.ticket : this.review;
        const itemType = this.ticket ? 'ticket' : 'review';
        container.appendChild(this.generateLikeForm(item, 'like', itemType));
        container.appendChild(this.generateLikeForm(item, 'dislike', itemType));
        return container;
    }

    generateLikeForm (item, likeType, itemType) {
        const id = item.author
        const form = document.createElement('form');
        const isLike = likeType == 'like' ? true : false;

        form.id = `${likeType}-form-${id}`;
        form.method = 'post';
        form.action = `/${itemType}/${id}/${likeType}/`;
        form.classList.add('like-block');

        const csrfHiddenInput = document.createElement('input');
        csrfHiddenInput.type = "hidden";
        csrfHiddenInput.name = "csrfmiddlewaretoken";
        csrfHiddenInput.value = this.csrfToken;

        form.appendChild(csrfHiddenInput);

        const btn = document.createElement('button'); 
        btn.classList.add(`${likeType}-btn`, "icon-hover-box");
        btn.innerHTML = `<i class="icon-heart${isLike ? '' : '-broken'}"></i>`;
        const count = document.createElement('span');
        count.classList.add(`${likeType}s-count`);
        count.textContent = isLike ? item.likesCount : item.dislikesCount;

        form.appendChild(btn);
        form.appendChild(count);
        likeEventSubscriber(btn);

        return form;
    }

    generateUserLink (object, isMini) {
        const userLink = document.createElement('a');
        if (object.author && object.author != jsUser.id) {
            userLink.classList.add(`colour-${Math.floor(Math.random() * 10)}`, 'author');
            userLink.textContent = object.authorName;     
            openViewModalSubscriber(userLink, this.generateViewUserModal, this.viewUserModal, object.author);
        }
        else {
            !isMini ? userLink.classList.add('colour-2', 'author') : userLink.classList.add('colour-3', 'author');
            userLink.href = '/profile/';
            userLink.textContent = 'you';
        }
        return userLink;
    }

    generateUlReview () {
        const ulReview = document.createElement('ul');
        ulReview.classList.add('item-infos', 'reviews-list');
        return ulReview;
    }

    generateAddReviewBtn (id, isFirst=true) {
        const addReviewBtn = this.generateButton (
            `create-review-btn-${id}`, 
            "create-review",
            ["review-create-btn", "icon-hover-box"],
            null,
            null,
            `/review/${id}/new/`,
            null);

        const iPlus = document.createElement('i');
        iPlus.classList.add('icon-plus', 'double-icon');

        const iFile = document.createElement('i');
        iFile.classList.add('icon-file-text', 'double-icon');

        addReviewBtn.appendChild(iPlus);
        addReviewBtn.appendChild(iFile);

        if (isFirst) {
            const innerSpan = document.createElement('span');
            innerSpan.classList.add('blue');
            innerSpan.innerHTML = "Be the first to review!";
            addReviewBtn.appendChild(innerSpan);
        }
        return addReviewBtn;
    }

    generateTicket() {
        const lowerCaseTicketString = "ticket";
        const li = this.generateLi();
        const itemContainer = this.generateItemContainer();
        li.appendChild(itemContainer);
    
        if (this.ticket.image) {
            const itemBackground = this.generateImage();
            itemContainer.appendChild(itemBackground);
        }
    
        const header = this.generateHeader();
        itemContainer.appendChild(header);
    
        const titleLink = this.generateTitle();
        openViewModalSubscriber(titleLink, this.generateViewTicketModal, this.viewTicketModal);
        header.appendChild(titleLink);

        if (this.ticket.author == jsUser.id) {
            const editButton = this.generateButton(`edit-${lowerCaseTicketString}-btn`, `edit-${lowerCaseTicketString}`, [`${lowerCaseTicketString}-edit-btn`, 'icon-hover-box'], this.ticket.id, this.ticket.title, `/${lowerCaseTicketString}/${this.ticket.id}/edit/`, '<i class="icon-pencil crud-btn"></i>');
            asyncSingleBtnModalFormInit(editButton, this.editModal, this.editConfirmButton, null, this.editTicketName, FormTypeEnum.EDIT_TICKET);
            header.appendChild(editButton);
        
            const deleteButton = this.generateButton(`delete-${lowerCaseTicketString}-btn`, `delete-${lowerCaseTicketString}`, [`${lowerCaseTicketString}-delete-btn`, 'icon-hover-box'], this.ticket.id, this.ticket.title, `/${lowerCaseTicketString}/${this.ticket.id}/delete/`, '<i class="icon-bin crud-btn"></i>');
            asyncSingleBtnModalFormInit(deleteButton, this.deletionModal, this.deletionConfirmButton, this.callbackDeleteTicket, this.deleteTicketName, FormTypeEnum.DELETE_TICKET);
            header.appendChild(deleteButton);
        }
    
        const descriptionLink = this.generateDescription();
        openViewModalSubscriber(descriptionLink, this.generateViewTicketModal, this.viewTicketModal);
        itemContainer.appendChild(descriptionLink);
    
        const tagContainer = this.generateTagContainer();
        itemContainer.appendChild(tagContainer);
    
        const infoLikesBlock = this.generateinfoLikesBlock();
    
        itemContainer.appendChild(infoLikesBlock);
    
        const ulReview = this.generateUlReview();

        const addReviewBtn = this.generateAddReviewBtn(this.ticket.id);
        asyncSingleBtnModalFormInit(addReviewBtn, this.createReviewModal, this.createReviewConfirmButton, this.callbackCreateReview);

        ulReview.appendChild(addReviewBtn);

        itemContainer.appendChild(ulReview);

        this.li = li;

        return li;
    }

    generateReview() {
        const lowerCaseReviewString = "review";
        const li = this.generateLi(lowerCaseReviewString, this.review.id);
        const itemContainer = this.generateItemContainer(lowerCaseReviewString);
        li.appendChild(itemContainer);
    
        if (this.review.coverImage) {
            const itemBackground = this.generateImage("review-img", this.review.coverImage);
            itemContainer.appendChild(itemBackground);
        }
        
        const reviewInfos = document.createElement('div');
        reviewInfos.classList.add('review-infos');
    
        const header = this.generateHeader('h4');
        itemContainer.appendChild(header);
    
        const titleLink = this.generateTitle(this.review.id, ['item-title', 'icon-hover-box', 'view-review-btn']);
        const title = this.generateTitleSpan();
        titleLink.appendChild(title);
        openViewModalSubscriber(titleLink, this.generateViewReviewModal, this.viewReviewModal);
        header.appendChild(titleLink);

        if (this.review.author == jsUser.id) {
            const editButton = this.generateButton(`edit-${lowerCaseReviewString}-btn`, `edit-${lowerCaseReviewString}`, [`${lowerCaseReviewString}-edit-btn`, 'icon-hover-box'], this.review.id, this.review.title, `/${lowerCaseReviewString}/${this.review.id}/edit/`, '<i class="icon-pencil crud-btn"></i>');
            asyncSingleBtnModalFormInit(editButton, this.editReviewModal, this.editReviewConfirmButton, null, this.editReviewName, FormTypeEnum.EDIT_REVIEW);
            header.appendChild(editButton);
        
            const deleteButton = this.generateButton(`delete-${lowerCaseReviewString}-btn`, `delete-${lowerCaseReviewString}`, [`${lowerCaseReviewString}-delete-btn`, 'icon-hover-box'], this.review.id, this.review.title, `/${lowerCaseReviewString}/${this.review.id}/delete/`, '<i class="icon-bin crud-btn"></i>');
            asyncSingleBtnModalFormInit(deleteButton, this.deleteReviewModal, this.deleteReviewConfirmButton, this.callbackDeleteReview, this.deleteReviewName, FormTypeEnum.DELETE_REVIEW);
            header.appendChild(deleteButton);
        }

        const ratingPreview = this.generateRatingPreview();
        header.appendChild(ratingPreview);
        reviewInfos.appendChild(header);
    
        const descriptionLink = this.generateDescription(lowerCaseReviewString, this.review.id, this.review.content);
        openViewModalSubscriber(descriptionLink, this.generateViewReviewModal, this.viewReviewModal);
        reviewInfos.appendChild(descriptionLink);
        itemContainer.appendChild(reviewInfos);
    
        const infoLikesBlock = this.generateinfoLikesBlock(true, this.review.createdAt);
    
        li.appendChild(infoLikesBlock);
    
        this.li = li;

        return li;
    }

    publicGenerateAddReviewBtn (isFirst=false) {
        const id = this.ticket != null ? this.ticket.id : this.review.ticket;
        document.getElementById(`create-review-btn-${id}`).remove();

        const addReviewBtn = this.generateAddReviewBtn(id, isFirst);
        asyncSingleBtnModalFormInit(addReviewBtn, this.createReviewModal, this.createReviewConfirmButton, this.callbackCreateReview);

        const ticketBlock = document.getElementById(`ticket-${id}`);
        const reviewList = ticketBlock.querySelector('ul.reviews-list');

        reviewList.appendChild(addReviewBtn);
    }
    
    generateViewTicketModal = (ticketId) => {
        const ticket = ticketsData.find(t => t.id === ticketId);
        const title = document.createElement('h2');
        title.className = 'main-title item-infos';
        title.innerHTML = `"<span id="viewTicketName">${ticket.title}</span>" ticket details`;
      
        const itemContainer = document.createElement('div');
        itemContainer.className = 'item-container';

        const imgDescBlock = document.createElement('div');
        imgDescBlock.className = 'review-container';
      
        if (ticket.image) {
            const itemBackground = document.createElement('div');
            itemBackground.classList.add('review-img', 'view-img-resize');
            itemBackground.style.backgroundImage = `url(${ticket.image})`;
            imgDescBlock.appendChild(itemBackground);
        }
      
        itemContainer.appendChild(this.generateTitleView(ticket, true));
      
        const descriptionBlock = document.createElement('div');
        descriptionBlock.className = "view-description-block";

        const description = document.createElement('p');
        description.innerText = ticket.description;

        descriptionBlock.appendChild(description);
        imgDescBlock.appendChild(descriptionBlock);
        itemContainer.appendChild(imgDescBlock);
        
        if (ticket.tags.length > 0){
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'tag-container item-infos';
            const tags = ticket.tags.split(',');
            tags.forEach(tag => {
                if (!isNullOrWhitespace(tag)) {
                    const tagDiv = document.createElement('div');
                    tagDiv.className = 'tag';
                    tagDiv.innerText = tag;
                    tagsContainer.appendChild(tagDiv);}
            });
            itemContainer.appendChild(tagsContainer);
        }
    
        itemContainer.appendChild(this.generateInfos(ticket));
    
        const ticketReviewsFilteredList = reviewsData.filter(r => r.ticket == ticket.id && (!r.isArchived || r.isArchived.toLowerCase() === "false"));
        const reviewsList = document.createElement('ul');
        reviewsList.className = 'item-infos reviews-list';
        if (ticketReviewsFilteredList.length > 0) {
            ticketReviewsFilteredList.forEach(review => {
                const listItem = document.createElement('li');
                listItem.id = `review-${review.id}`;
                const generatedReviewsList = this.generateReviewsList(review, true);
                listItem.appendChild(generatedReviewsList.reviewContainer);
                listItem.appendChild(generatedReviewsList.reviewInfos);
                reviewsList.appendChild(listItem);
            });
        }
        const createReviewButton = document.createElement('button');
        createReviewButton.type = 'button';
        createReviewButton.id = `create-review-btn-${ticket.id}`;
        createReviewButton.name = 'create-review';
        createReviewButton.className = 'review-create-btn icon-hover-box';
        createReviewButton.dataset.itemAction = `/review/${ticket.id}/new/`;
        createReviewButton.innerHTML = `<i class="icon-plus double-icon"></i><i class="icon-file-text double-icon"></i>`;
    
        if (ticketReviewsFilteredList.length === 0) {
            const span = document.createElement('span');
            span.className = 'blue';
            span.textContent = 'Be the first to review !';
            createReviewButton.appendChild(span);
        }
        asyncSingleBtnModalFormInit(createReviewButton, this.createReviewModal, this.createReviewConfirmButton, this.callbackCreateReview);
        reviewsList.appendChild(createReviewButton);
        itemContainer.appendChild(reviewsList);
    
        const viewTicketContainer = document.getElementById('viewTicketContainer');
        viewTicketContainer.innerHTML = "";
        viewTicketContainer.appendChild(title);
        viewTicketContainer.appendChild(itemContainer);
      }
    
      generateViewReviewModal = (reviewId) => {
        const review = reviewsData.find(r => r.id === reviewId);
        const title = document.createElement('h2');
        title.className = 'main-title item-infos';
        title.innerHTML = `"<span id="viewReviewName">${review.title}</span>" review details`;
    
        const viewReviewContainer = document.getElementById('viewReviewContainer');
        viewReviewContainer.innerHTML = "";
        viewReviewContainer.appendChild(title);
        const generatedReviewsList = this.generateReviewsList(review);
        viewReviewContainer.appendChild(generatedReviewsList.reviewContainer);
        viewReviewContainer.appendChild(generatedReviewsList.reviewInfos);
      }
    
      generateReviewsList = (review, isInList=false) => {
        const itemContainer = document.createElement('div');
        itemContainer.className = 'review-container';
    
        if (review.coverImage) {
            const backgroundDiv = document.createElement('div');
            backgroundDiv.classList.add('review-img', 'view-img-resize');
            backgroundDiv.style.backgroundImage = `url(${review.coverImage})`;
            itemContainer.appendChild(backgroundDiv);
        }
    
        const descriptionBlock = document.createElement('div');
        descriptionBlock.className = "view-description-block";
    
        const reviewContent = document.createElement('p');
        reviewContent.className = 'item-infos';
        if (isInList) {
            const a = document.createElement('a');
            a.textContent = review.content;
            a.dataset.itemId = review.id;
            openViewModalSubscriber(a, this.generateViewReviewModal, this.viewReviewModal);
            reviewContent.appendChild(a);
        }
        else {
            reviewContent.innerHTML = `<p>${review.content}</p>`;

        }

        descriptionBlock.appendChild(this.generateTitleView(review, false, isInList));
        descriptionBlock.appendChild(reviewContent);

        itemContainer.appendChild(descriptionBlock);
    
        return {reviewContainer: itemContainer, reviewInfos: this.generateInfos(review, isInList ? 'mini-font' : '')} ;
    }
    
    generateViewUserModal = async (userId, followData) => {
        const user = usersData.find(u => u.id === userId);   
        if (!user) {
            console.error('User not found');
            return;
        }
        // const reviews = reviewsData.filter(r => r.author === userId);
        // const tickets = ticketsData.filter(t => t.author === userId);
        const title = document.createElement('h2');
        title.className = 'main-title item-infos';
        title.innerHTML = `<span class="colour-2">${user.username}</span>`;
    
        const viewReviewContainer = document.getElementById('viewUserContainer');
        viewReviewContainer.innerHTML = "";
        viewReviewContainer.appendChild(title);

        const followers = followData.followers || [];
        const following = followData.following || [];

        const currentPlayerColourClass = `colour-${Math.floor(Math.random() * 10)}`;

        viewReviewContainer.appendChild(this.generateFollowBlock(`People who follows <span class="colour-2">${user.username}</span>:`, followers, currentPlayerColourClass));
        viewReviewContainer.appendChild(this.generateFollowBlock(`People <span class="colour-2">${user.username}</span> follows:`, following, currentPlayerColourClass));

        // viewReviewContainer.appendChild(generateReviewsList(review));
    }

    generateFollowBlock = (title, userList, classColour) => {
        const mainDiv = document.createElement('div');

        const h3 = document.createElement('h3');
        h3.classList.add("profile-info");
        h3.innerHTML = title;

        const ul = document.createElement('ul');

        userList.forEach(user => {
            const listItem = document.createElement('li');
            listItem.className = 'profile-info';
    
            const userLink = document.createElement('a');
            listItem.appendChild(userLink);
            
            if (jsUser.id != user.id) {
                userLink.href = `/user/${user.id}/`;
                userLink.textContent = user.username;
                userLink.classList.add(`colour-${Math.floor(Math.random() * 10)}`);

                const followBlockBtns = this.generateFollowBlockBtns(user.id);

                listItem.appendChild(followBlockBtns.followButton);
                listItem.appendChild(followBlockBtns.blockButton);
            }
            else {
                userLink.href = '/profile/';
                userLink.classList.add(classColour, 'title');
                userLink.textContent = 'You';
            }
    
            ul.appendChild(listItem);
        });

        mainDiv.appendChild(h3);
        mainDiv.appendChild(ul);
        return mainDiv;
    }

    generateFollowBlockBtns = (userId) => {
        const followButton = document.createElement('button');
        followButton.className = 'follow-btn icon-hover-box';
        followButton.dataset.userId = userId;
        followButton.dataset.url = `/toggle-follow/${userId}/`;
        followBtnListenerSetup(followButton, callbackMassFollow);

        const followIcon = document.createElement('i');
        followIcon.className = this.followingUsers.includes(userId) ? 'icon-user-minus' : 'icon-user-plus';
        followButton.appendChild(followIcon);

        const blockButton = document.createElement('button');
        blockButton.className = 'block-btn icon-hover-box';
        blockButton.dataset.userId = userId;
        blockButton.dataset.url = `/toggle-block/${userId}/`;
        followBtnListenerSetup(blockButton, callbackMassBlock);

        const blockIcon = document.createElement('i');
        blockIcon.className = this.blockedUsers.includes(userId) ? 'icon-checkmark not-validation' : 'icon-blocked not-validation';
        blockButton.appendChild(blockIcon);

        return {
            followButton: followButton,
            blockButton: blockButton
        }
    }
    
    generateTitleView = (object, isTicket, isInList=false) => {  
        let header = null;

        const titleReviewInner = isInList ? '<i class="icon-eye-plus"></i>' : ''; 
        if (isTicket) header = this.generateTitleTicketReviewSpliter(object, 'h3', 'span');
        else header = this.generateTitleTicketReviewSpliter(object, 'h4', 'a', ' stylish-header', 'icon-hover-box view-review-btn', titleReviewInner);
    
        if (object.author === jsUser.id) {
            const editButton = this.createButton('edit-review-btn', 'edit-review', object.id, object.title, `/review/${object.id}/edit/`, 'icon-pencil', 'crud-btn');
            header.appendChild(editButton);
    
            const deleteButton = this.createButton('delete-review-btn', 'delete-review', object.id, object.title, `/review/${object.id}/delete/`, 'icon-bin', 'crud-btn');
            header.appendChild(deleteButton);
                
            asyncSingleBtnModalFormInit(editButton, this.editReviewModal, this.editReviewConfirmButton, null, this.editReviewName, FormTypeEnum.EDIT_REVIEW);
            asyncSingleBtnModalFormInit(deleteButton, this.deleteReviewModal, this.deleteReviewConfirmButton, this.callbackDeleteReview, this.deleteReviewName, FormTypeEnum.DELETE_REVIEW);
        }   

        if (!isTicket) {
            const rating = document.createElement('div');
            rating.className = "rating-preview";
            rating.innerHTML = ' ☆ '.repeat(object.rating);
            header.appendChild(rating);
        }

        return header;
    }

    generateTitleTicketReviewSpliter = (object, typeOfH, typeOfA, headerClassName="", titleClassName="", titleInner="") => {
        const header = document.createElement(typeOfH);
        header.className = 'aligned item-infos' + headerClassName;
    
        const titleA = document.createElement(typeOfA);
        titleA.className = `item-title ${titleClassName}`;
        titleA.innerHTML = `<span class="font-style title colour-${Math.floor(Math.random() * 10)}">${object.title}</span>${titleInner}`;

        if (titleInner != '') {
            titleA.dataset.itemId = object.id;
            openViewModalSubscriber(titleA, this.generateViewReviewModal, this.viewReviewModal);
        }

        header.appendChild(titleA);

        return header;
    }
    
    generateInfos = (object, optionalClass="") => {
        const infoBlock = document.createElement('div');
        infoBlock.classList.add('item-infos', 'info-likes-block');

        const authorP = document.createElement('p');
        authorP.className = 'item-infos ' + optionalClass;
        authorP.innerHTML = `<span>Posted on ${object.createdAt} by </span>`;
    
        const authorName = this.generateUserLink(object, false);
        authorP.appendChild(authorName);

        let likesBtn = null;

        if (object.author && object.author != jsUser.id) {    
            // const followButton = this.createFollowButton(object.author, `/toggle-follow/${object.author}/`, jsCsrfToken, object.isFollowing);
            const followBlockBtns = this.generateFollowBlockBtns(object.author);

            authorP.appendChild(followBlockBtns.followButton);
            authorP.appendChild(followBlockBtns.blockButton);

            likesBtn = this.generateLikeBlock();
        }

        infoBlock.appendChild(authorP);
        if (likesBtn) infoBlock.appendChild(likesBtn);

        return infoBlock;
    }

    createFollowButton = (userId, url, csrfToken, isFollowing) => {
        const followButton = document.createElement('button');
        followButton.className = 'follow-btn icon-hover-box';
        followButton.dataset.userId = userId;
        followButton.dataset.url = url;
        followButton.dataset.token = csrfToken;
    
        followButton.innerHTML = `<i class="${isFollowing ? 'icon-user-minus' : 'icon-user-plus'}"></i>`;
    
        return followButton;
    }
    
    createButton = (buttonId, buttonName, itemId, itemName, actionUrl, iconClass, crudClass) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.id = `${buttonId}-${itemId}`;
        button.name = buttonName;
        button.className = `${buttonId} icon-hover-box`;
        button.dataset.itemId = itemId;
        button.dataset.itemName = itemName;
        button.dataset.itemAction = actionUrl;
        button.innerHTML = `<i class="${iconClass} ${crudClass}"></i>`;
        return button;
    }

    updateTicket = (ticketId, newImage, newTitle, newDescription, newTags) => {
        const ticket = document.getElementById(`ticket-${ticketId}`);

        if (newImage) {
            const itemBackground = ticket.querySelector('.item-background');
            if (itemBackground) {
                itemBackground.style.backgroundImage = `url(${newImage})`;
                itemBackground.setAttribute('data-src', newImage);
            }
            else {
                const itemContainer = ticket.querySelector('.item-container');
                const newItemBackground = document.createElement('div');
                itemBackground.style.backgroundImage = `url(${newImage})`;
                newItemBackground.classList.add('item-background');
                itemBackground.setAttribute('data-src', newImage);
                itemContainer.prepend(itemBackground);
            }
        }

        if (newTitle) {
            const titleElement = ticket.querySelector('.ticket-title');
            titleElement.textContent = newTitle;
        }

        if (newDescription) {
            const descriptionElement = ticket.querySelector('.ticket-description');
            descriptionElement.textContent = newDescription;
        }

        if (newTags) {
            const tagContainer = ticket.querySelector('.tag-container');
            tagContainer.innerHTML = '';
            newTags.forEach(tag => {
                const tagDiv = document.createElement('div');
                tagDiv.className = 'tag';
                tagDiv.textContent = tag;
                tagContainer.appendChild(tagDiv);
            });
        }
    }

    updateReview = (reviewId, newCoverImage, newTitle, newRating, newContent) => {
        const review = document.getElementById(`review-${reviewId}`);
  
        if (newCoverImage) {
            const reviewImg = review.querySelector('.review-img');
            if (reviewImg) {
                reviewImg.style.backgroundImage = `url(${newCoverImage})`;
                reviewImg.setAttribute('data-src', newCoverImage);
            }
            else {
                const itemContainer = review.querySelector('.review-container');
                const newItemBackground = document.createElement('div');
                itemBackground.style.backgroundImage = `url(${newImage})`;
                newItemBackground.classList.add('review-img');
                itemBackground.setAttribute('data-src', newImage);
                itemContainer.prepend(itemBackground);
            }
        }
  
        if (newTitle) {
          const titleElement = review.querySelector('.item-title .title');
          titleElement.textContent = newTitle;
        }
  
        if (newRating !== undefined) {
          const ratingPreview = review.querySelector('.rating-preview');
          ratingPreview.innerHTML = ' ☆ '.repeat(newRating);
        }
  
        if (newContent) {
          const contentElement = review.querySelector('.sample-text');
          contentElement.textContent = newContent;
        }
    }
}