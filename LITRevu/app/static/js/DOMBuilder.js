class DOMBuilder {
    constructor(
        ticket=null,
    ) {
        this.ticket = ticket;
        this.titleLink = null;
        this.editButton = null;
        this.deleteButton = null;
        this.descriptionLink = null;
        this.li = this.generateTicket();
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

        return li;
    }
}