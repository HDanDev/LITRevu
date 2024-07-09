class DOMBuilder {
    constructor(
        ticket=null,
    ) {
        this.ticket = ticket;
        this.titleLink = null;
        this.editButton = null;
        this.deleteButton = null;
        this.descriptionLink = null;
        this.li = null;
    }  

    generateLi () {
        const li = document.createElement('li');
        li.id = `ticket-${this.ticket.id}`;
        li.classList.add('ticket-li');
        return li;
    }

    generateItemContainer () {
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('item-container');
        return itemContainer;
    }

    generateImage () {
        const itemBackground = document.createElement('div');
        itemBackground.classList.add('item-background');
        itemBackground.dataset.src = this.ticket.image;
        itemBackground.style.backgroundImage = `url(${this.ticket.image})`;
        return itemBackground;
    }

    generateHeader () {
        const header = document.createElement('h3');
        header.classList.add('aligned', 'item-infos', 'stylish-header');
        return header;
    }

    generateTitle () {
        const titleLink = document.createElement('a');
        titleLink.classList.add('ticket-title', 'item-title', 'view-ticket-btn', 'title', 'custom-colour-target');
        titleLink.dataset.itemId = this.ticket.id;
        titleLink.href = '';
        titleLink.textContent = this.ticket.title;
        return titleLink;
    }

    generateButton (btnId=null, btnName=null, btnClasses=[], btnUrl=null, btnInner=null) {
        const button = document.createElement('button');
        button.type = 'button';
        button.id = btnId;
        button.name = btnName;
        if (btnClasses.length > 0) {
            btnClasses.forEach(cls => button.classList.add(cls));
        }
        button.dataset.itemId = this.ticket.id;
        button.dataset.itemName = this.ticket.title;
        button.dataset.itemAction = btnUrl;
        button.innerHTML = btnInner;
        return button;
    }

    generateDescription () {
        const descriptionLink = document.createElement('a');
        descriptionLink.classList.add('item-infos', 'view-ticket-btn');
        descriptionLink.dataset.itemId = this.ticket.id;
        descriptionLink.href = '';
        const descriptionParagraph = document.createElement('p');
        descriptionParagraph.classList.add('ticket-description', 'sample-text');
        descriptionParagraph.textContent = this.ticket.description;
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

    generateinfoLikesBlock () {
        const infoLikesBlock = document.createElement('div');
        infoLikesBlock.classList.add('item-infos', 'info-likes-block');

        const infoParagraph = document.createElement('p');
        infoParagraph.classList.add('no-margin');
        infoParagraph.innerHTML = `Posted on ${new Date(this.ticket.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} by `;
    
        const youLink = document.createElement('a');
        youLink.classList.add('colour-2');
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

    generateTicket() {

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
        
        this.editButton = this.generateButton('edit-ticket-btn', 'edit-ticket', ['ticket-edit-btn', 'icon-hover-box'], `/ticket/update/${this.ticket.id}/`, '<i class="icon-pencil crud-btn"></i>');
        header.appendChild(this.editButton);
    
        this.deleteButton = this.generateButton('delete-ticket-btn', 'delete-ticket', ['ticket-delete-btn', 'icon-hover-box'], `/ticket/delete/${this.ticket.id}/`, '<i class="icon-bin crud-btn"></i>');
        header.appendChild(this.deleteButton);
    
        this.descriptionLink = this.generateDescription();
        itemContainer.appendChild(this.descriptionLink);
    
        const tagContainer = this.generateTagContainer();
        itemContainer.appendChild(tagContainer);
    
        const infoLikesBlock = this.generateinfoLikesBlock();
    
        itemContainer.appendChild(infoLikesBlock);
    
        const ulReview = this.generateUlReview();

        itemContainer.appendChild(ulReview);

        this.li = li;

        return li;
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
    
    generateViewUserModal = (userId) => {
        const user = usersData.find(u => u.id === userId);
        const reviews = reviewsData.filter(r => r.author === userId);
        const tickets = ticketsData.filter(t => t.author === userId);
        const title = document.createElement('h2');
        title.className = 'main-title item-infos';
        title.innerHTML = `<span class="colour-2">${user.username}</span>`;
    
        const viewReviewContainer = document.getElementById('viewUserContainer');
        viewReviewContainer.innerHTML = "";
        viewReviewContainer.appendChild(title);
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
}