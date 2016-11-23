var CONTACTS = {
    //list with all contacts
    contactList: {},

    /**
     * Initializes the contact list with a default contact
     * 
     */
    initContactList: function () {
        CONTACTS.contactList.contacts = [];
        CONTACTS.addItem("Adesh Shah", "647-667-4651", "shah0150@algonquinlive.com", -1);
        CONTACTS.storeItems();
    },


    /**
     * Clears modal window content when {liItem} is null or fill the content with {liItem} values when it is not null. 
     * 
     * @param: {liItem} an li item with contact info
     */
    fillModal: function (liItem) {
        document.getElementById("name").className = "";
        if (liItem) {
            document.getElementById("name").value = liItem.querySelector("h3").textContent;
            document.getElementById("phone").value = liItem.querySelector(".phone").textContent;
            document.getElementById("email").value = liItem.querySelector(".email").textContent;
            document.querySelector(".modal").setAttribute("data-position", liItem.getAttribute("data-position"));
        } else {
            document.getElementById("name").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("email").value = "";
            document.querySelector(".modal").setAttribute("data-position", -1);
        }
    },

    /**
     *  Includes a new contact when {position} is equals -1 of update the contact at position {position} from {contactList}
     *
     * @param {fullname} name of the contact
     * @param {phone} phone of the contact
     * @param {email} email of the contact
     * @param {position} position of the contact in {contactList}. Parse -1 to add a new contact
     */
    addItem: function (fullname, phone, email, position) {
        //new contact
        if (position == -1) {
            let contact = {
                "fullname": fullname,
                "phone": phone,
                "email": email
            }
            CONTACTS.contactList.contacts.push(contact);
            //update contact
        } else {
            CONTACTS.contactList.contacts[position].fullname = fullname;
            CONTACTS.contactList.contacts[position].phone = phone;
            CONTACTS.contactList.contacts[position].email = email;
        }

        //sort list by name (fullname)
        CONTACTS.contactList.contacts.sort(function (a, b) {
            if (a.fullname.toUpperCase().trim() < b.fullname.toUpperCase().trim()) {
                return -1;
            } else if (a.fullname.toUpperCase().trim() > b.fullname.toUpperCase().trim()) {
                return 1;
            } else {
                return 0;
            }
        });
    },

    /**
     * Deletes a contact at position {position} from {contactList}
     * 
     * @param {position} position of the contact in {contactList}.
     */
    deleteItem: function (position) {
        CONTACTS.contactList.contacts.splice(position, 1);
    },

    /**
     * Saves {contactList} into a the localStorave variable {shah0150}
     * 
     */
    storeItems: function () {
        localStorage.setItem("shah0150", JSON.stringify(CONTACTS.contactList));
    },

    /**
     * create the HTML from a contact
     * 
     * @param {fullname} name of the contact
     * @param {phone} phone of the contact
     * @param {email} email of the contact
     * @param {position} position of the contact in {contactList}.
     * @return {liItem} li with contact info
     */
    createContactHTML: function (fullname, phone, email, position) {

        let liItem = document.createElement("li");
        liItem.className = "contact";

        let btnDelete = document.createElement("spam");
        btnDelete.className = "delete";
        btnDelete.addEventListener("click", CONTACTS.btnDeleteClick);
        liItem.appendChild(btnDelete);

        let h3Name = document.createElement("h3");
        h3Name.textContent = fullname;
        liItem.appendChild(h3Name);

        let pEmail = document.createElement("p");
        pEmail.textContent = email;
        pEmail.className = "email";
        liItem.appendChild(pEmail);

        let pPhone = document.createElement("p");
        pPhone.textContent = phone;
        pPhone.className = "phone";
        liItem.appendChild(pPhone);

        liItem.setAttribute("data-position", position);
        liItem.addEventListener("click", CONTACTS.toogleModal);

        return liItem;
    },

    /**
     * Draws / redraws contacts on screen
     */
    drawContactList: function () {
        //clears all listeners from memory
        let deleteList = document.querySelectorAll(".delete");
        deleteList.forEach(function (spam) {
            spam.removeEventListener("click", CONTACTS.btnDeleteClick);
        });
        let liList = document.querySelectorAll("li");
        liList.forEach(function (li) {
            li.removeEventListener("click", CONTACTS.toogleModal);
        });

        //removes childs
        let main = document.querySelector("main");
        main.removeChild(main.firstChild);

        //redraws elements
        let ul = document.createElement("ul");
        ul.className = "contacts";
        CONTACTS.contactList.contacts.forEach(function (item, position) {
            ul.appendChild(CONTACTS.createContactHTML(item.fullname, item.phone, item.email, position));
        });

        //draws only once on screen
        main.appendChild(ul);
    },

    /**
     * controls modal state (closed, open/add, open/edit)
     */
    toogleModal: function () {
        let modal = document.querySelector(".cover")
        let state = modal.getAttribute("data-state");

        if (state == "open") {
            modal.setAttribute("data-state", "closed");
        } else {
            let mode = this.getAttribute("data-mode");
            if (mode == "add") {
                CONTACTS.fillModal();
            } else {
                CONTACTS.fillModal(this);
            }
            modal.setAttribute("data-state", "open");
        }
    },

    /**
     * Event from Save button at modal window
     * Adds / Updates a contact
     */
    btnSaveClick: function () {
        //event.preventDefault();

        let fullname = document.getElementById("name").value;
        if (fullname == "") {
            document.getElementById("name").className = "error";
        } else {
            let phone = document.getElementById("phone").value;
            let email = document.getElementById("email").value;
            let position = document.querySelector(".modal").getAttribute("data-position");

            CONTACTS.addItem(fullname, phone, email, position);
            CONTACTS.storeItems();
            CONTACTS.drawContactList();
            CONTACTS.toogleModal();
        }
    },

    /**
     * Event from delete button at contact list.
     * Deletes the selected contact
     */
    btnDeleteClick: function (event) {
        event.stopPropagation();
        let position = this.parentElement.getAttribute("data-position");
        CONTACTS.deleteItem(position);
        CONTACTS.storeItems();
        CONTACTS.drawContactList();
    },

    /**
     * Application initialization
     */
    init: function () {
        if (localStorage) {
            let lsData = localStorage.getItem('shah0150');

            //console.log(lsData);

            if (lsData == null) {
                CONTACTS.initContactList();
            } else {
                CONTACTS.contactList = JSON.parse(lsData);
                if (CONTACTS.contactList.contacts.length == 0) {
                    CONTACTS.initContactList();
                }
            }

            CONTACTS.drawContactList();

            //listeners
            document.querySelector(".fab").addEventListener("click", CONTACTS.toogleModal);
            document.querySelector(".close").addEventListener("click", CONTACTS.toogleModal);
            document.getElementById("save").addEventListener("click", CONTACTS.btnSaveClick);
        } else {

            let main = document.querySelector("main");
            main.innerHTML = "<p>Sorry but your browser does not support localStorage</p>";
        }
    }
}

document.addEventListener("DOMContentLoaded", CONTACTS.init);
