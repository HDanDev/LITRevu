class DOMBuilder {
    constructor(
        ticket=null,
        review=null,
    ) {
        this.ticket = ticket;
        this.review = review;
        this.titleLink = null;
        this.editButton = null;
        this.deleteButton = null;
        this.descriptionLink = null;
        this.li = null;
        this.addReviewBtn = null;
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
    
        const youLink = document.createElement('a');
        if (!isMini) youLink.classList.add('colour-2');
        else youLink.classList.add('colour-3');
        youLink.href = '/profile/';
        youLink.textContent = 'you';

        infoParagraph.appendChild(youLink);
        infoLikesBlock.appendChild(infoParagraph);

        return infoLikesBlock;
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
    
        this.titleLink = this.generateTitle();
        header.appendChild(this.titleLink);
        
        this.editButton = this.generateButton(`edit-${lowerCaseTicketString}-btn`, `edit-${lowerCaseTicketString}`, [`${lowerCaseTicketString}-edit-btn`, 'icon-hover-box'], this.ticket.id, this.ticket.title, `/${lowerCaseTicketString}/${this.ticket.id}/edit/`, '<i class="icon-pencil crud-btn"></i>');
        header.appendChild(this.editButton);
    
        this.deleteButton = this.generateButton(`delete-${lowerCaseTicketString}-btn`, `delete-${lowerCaseTicketString}`, [`${lowerCaseTicketString}-delete-btn`, 'icon-hover-box'], this.ticket.id, this.ticket.title, `/${lowerCaseTicketString}/${this.ticket.id}/delete/`, '<i class="icon-bin crud-btn"></i>');
        header.appendChild(this.deleteButton);
    
        this.descriptionLink = this.generateDescription();
        itemContainer.appendChild(this.descriptionLink);
    
        const tagContainer = this.generateTagContainer();
        itemContainer.appendChild(tagContainer);
    
        const infoLikesBlock = this.generateinfoLikesBlock();
    
        itemContainer.appendChild(infoLikesBlock);
    
        const ulReview = this.generateUlReview();

        const addReviewBtn = this.generateAddReviewBtn(this.ticket.id);
        this.addReviewBtn = addReviewBtn;

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
    
        if (this.review.cover_image) {
            const itemBackground = this.generateImage("review-img", this.review.cover_image);
            itemContainer.appendChild(itemBackground);
        }
        
        const reviewInfos = document.createElement('div');
        reviewInfos.classList.add('review-infos');
    
        const header = this.generateHeader('h4');
        itemContainer.appendChild(header);
    
        this.titleLink = this.generateTitle(this.review.id, ['item-title', 'icon-hover-box', 'view-review-btn']);
        const title = this.generateTitleSpan();
        this.titleLink.appendChild(title);
        header.appendChild(this.titleLink);
        
        this.editButton = this.generateButton(`edit-${lowerCaseReviewString}-btn`, `edit-${lowerCaseReviewString}`, [`${lowerCaseReviewString}-edit-btn`, 'icon-hover-box'], this.review.id, this.review.title, `/${lowerCaseReviewString}/${this.review.id}/edit/`, '<i class="icon-pencil crud-btn"></i>');
        header.appendChild(this.editButton);
    
        this.deleteButton = this.generateButton(`delete-${lowerCaseReviewString}-btn`, `delete-${lowerCaseReviewString}`, [`${lowerCaseReviewString}-delete-btn`, 'icon-hover-box'], this.review.id, this.review.title, `/${lowerCaseReviewString}/${this.review.id}/delete/`, '<i class="icon-bin crud-btn"></i>');
        header.appendChild(this.deleteButton);

        const ratingPreview = this.generateRatingPreview();
        header.appendChild(ratingPreview);
        reviewInfos.appendChild(header);
    
        this.descriptionLink = this.generateDescription(lowerCaseReviewString, this.review.id, this.review.content);
        reviewInfos.appendChild(this.descriptionLink);

        itemContainer.appendChild(reviewInfos);
    
        const infoLikesBlock = this.generateinfoLikesBlock(true, this.review.createdAt);
    
        li.appendChild(infoLikesBlock);
    
        this.li = li;

        return li;
    }

    publicGenerateAddReviewBtn (isFirst=false) {
        const id = this.ticket != null ? this.ticket.id : this.review.ticket;
        console.log(document.getElementById(`create-review-btn-${id}`));
        document.getElementById(`create-review-btn-${id}`).remove();
        console.log(id);

        const addReviewBtn = this.generateAddReviewBtn(id, isFirst);

        const ticketBlock = document.getElementById(`ticket-${id}`);
        const reviewList = ticketBlock.querySelector('ul.reviews-list');

        console.log(reviewList);

        reviewList.appendChild(addReviewBtn);

        this.addReviewBtn = addReviewBtn;
    }
    
    generateViewTicketModal = (ticketId) => {
        console.log(ticketId);
        const ticket = ticketsData.find(t => t.id === ticketId);
        const title = document.createElement('h2');
        title.className = 'main-title item-infos';
        title.innerHTML = `"<span id="viewTicketName">${ticket.title}</span>" ticket details`;
      
        const itemContainer = document.createElement('div');
        itemContainer.className = 'item-container';
      
        if (ticket.image) {
          const itemBackground = document.createElement('div');
          itemBackground.className = 'item-background';
          itemBackground.style.backgroundImage = `url(${ticket.image})`;
          itemContainer.appendChild(itemBackground);
        }
      
        itemContainer.appendChild(this.generateTitleView(ticket, true));
      
        const description = document.createElement('p');
        description.innerText = ticket.description;
        itemContainer.appendChild(description);
        
        if (ticket.tags.length > 0){
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'tag-container item-infos';
            const tags = ticket.tags.split(',');
            tags.forEach(tag => {
              const tagDiv = document.createElement('div');
              tagDiv.className = 'tag';
              tagDiv.innerText = tag;
              tagsContainer.appendChild(tagDiv);
            });
            itemContainer.appendChild(tagsContainer);
        }
    
        itemContainer.appendChild(this.generateInfos(ticket));
    
        const ticketReviewsFilteredList = reviewsData.filter(r => r.ticket === ticket.id && r.isArchived.toLowerCase() === "false");
        const reviewsList = document.createElement('ul');
        reviewsList.className = 'item-infos reviews-list';
        if (ticketReviewsFilteredList.length > 0) {
            ticketReviewsFilteredList.forEach(review => {
                const listItem = document.createElement('li');
                listItem.id = `review-${review.id}`;
                listItem.appendChild(this.generateReviewsList(review, true));
                reviewsList.appendChild(listItem);
            });
        }
        const createReviewButton = document.createElement('button');
        createReviewButton.type = 'button';
        createReviewButton.id = `create-review-btn-${ticket.id}`;
        createReviewButton.name = 'create-review';
        createReviewButton.className = 'review-create-btn icon-hover-box';
        createReviewButton.dataset.itemAction = `/review/create/${ticket.id}`;
        createReviewButton.innerHTML = `<i class="icon-plus double-icon"></i><i class="icon-file-text double-icon"></i>`;
    
        if (ticketReviewsFilteredList.length === 0) {
            const span = document.createElement('span');
            span.className = 'blue';
            span.textContent = 'Be the first to review !';
            createReviewButton.appendChild(span);
        }
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
        viewReviewContainer.appendChild(this.generateReviewsList(review));
      }
    
      generateReviewsList = (review, isInList=false) => {
        const itemContainer = document.createElement('div');
        itemContainer.className = 'item-container';
    
        if (review.coverImage) {
            const backgroundDiv = document.createElement('div');
            backgroundDiv.className = 'item-background';
            backgroundDiv.style.backgroundImage = `url(${review.coverImage})`;
            itemContainer.appendChild(backgroundDiv);
        }
    
        itemContainer.appendChild(this.generateTitleView(review, !isInList));
    
        const reviewContent = document.createElement('p');
        reviewContent.className = 'item-infos';
        reviewContent.innerHTML = isInList 
        ? `<a href="/review/${review.id}/detail">${review.content}</a>`
        : `<p>${review.content}</p>`;
        itemContainer.appendChild(reviewContent);
        itemContainer.appendChild(this.generateInfos(review, isInList ? 'mini-font' : ''));
    
        return itemContainer;
    }
    
    generateViewUserModal = async (userId, followData) => {
        const user = usersData.find(u => u.id === userId);   
        if (!user) {
            console.error('User not found');
            return;
        }
        const reviews = reviewsData.filter(r => r.author === userId);
        const tickets = ticketsData.filter(t => t.author === userId);
        const title = document.createElement('h2');
        title.className = 'main-title item-infos';
        title.innerHTML = `<span class="colour-2">${user.username}</span>`;
    
        const viewReviewContainer = document.getElementById('viewUserContainer');
        viewReviewContainer.innerHTML = "";
        viewReviewContainer.appendChild(title);

        const followers = followData.followers || [];
        const following = followData.following || [];
    
        const followersList = document.createElement('ul');
        followers.forEach(follower => {
            const listItem = document.createElement('li');
            listItem.textContent = follower.username + ' (' + follower.id + ')';
            followersList.appendChild(listItem);
        });
        viewReviewContainer.appendChild(followersList);
    
        const followingList = document.createElement('ul');
        following.forEach(follow => {
            const listItem = document.createElement('li');
            listItem.textContent = follow.username + ' (' + follow.id + ')';
            followingList.appendChild(listItem);
        });
        viewReviewContainer.appendChild(followingList);

        // viewReviewContainer.appendChild(generateReviewsList(review));
    }
    
    generateTitleView = (object, isTicket) => {  
        const header = document.createElement(isTicket ? 'h3' : 'h4');
        header.className = 'aligned item-infos';
    
        const titleA = document.createElement(isTicket ? 'span' : 'a');
        titleA.className = `item-title ${isTicket ? '' : 'icon-hover-box'}`;
        titleA.innerHTML = `<span class="font-style">${object.title}</span>${isTicket ? '' : '<i class="icon-eye-plus"></i>'}`;
        header.appendChild(titleA);
    
        if (object.author === jsUser.id) {
            const editButton = this.createButton('edit-review-btn', 'edit-review', object.id, object.title, `/review/${object.id}/update`, 'icon-pencil', 'crud-btn');
            header.appendChild(editButton);
    
            const deleteButton = this.createButton('delete-review-btn', 'delete-review', object.id, object.title, `/review/${object.id}/delete`, 'icon-bin', 'crud-btn');
            header.appendChild(deleteButton);
        }
        return header;
    }
    
    generateInfos = (object, optionalClass="") => {
        const infoBlock = document.createElement('p');
        infoBlock.className = 'item-infos ' + optionalClass;
        infoBlock.innerHTML = `<span>Posted on ${object.createdAt} by </span>`;
    
        if (object.author === jsUser.id) {
            infoBlock.innerHTML += 'you';
        } else {
            const authorSpan = document.createElement('span');
            authorSpan.textContent = object.authorName;
            infoBlock.appendChild(authorSpan);
    
            const followButton = this.createFollowButton(object.author, `/toggle_follow/${object.author}`, jsCsrfToken, object.isFollowing);
            infoBlock.appendChild(followButton);
        }
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
        console.log("withing upadate ticket");
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
            console.log(newTags);
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
        console.log("withing upadate review");
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