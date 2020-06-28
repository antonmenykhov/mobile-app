const navbaContent = document.getElementById('navbar-content');
const menuBtns = document.getElementsByClassName('btn-bottom');

// PAGES
const profilePage = document.getElementById('profile-page');
const listPage = document.getElementById('list-page');
const contactsPage = document.getElementById('contacts-page');
const settingsPage = document.getElementById('settings-page');

// PROFILE
const profileCard = document.getElementById('card-profile');
const profileForm = document.getElementById('profile-form');
const btnRedactProfile = document.getElementById('btn-redact-profile');
const profileName = document.getElementById('profile-name');
const profileDescription = document.getElementById('profile-description');

// CONTACTS
const contactsList = document.getElementById('contacts-list');
const searchContactsForm = document.getElementById('contacts-search-form');
const addContactForm = document.getElementById('add-contact-form');

// SETTINGS
const btnClearStore = document.getElementById('btn-clear-store');
const switchTheme = document.getElementById('switch-theme');
// LIST
const toDoList = document.getElementById('todo-list');
const toDoCheckboxes = document.getElementsByClassName('checkbox');
const addToDoForm = document.getElementById('add-todo-form');
const toDoText = document.getElementsByClassName('todoitem');
let currentId = 3;
const checkAll = document.getElementById('check-all');
const clearChecked = document.getElementById('clear-checked');
const uncheckAll = document.getElementById('unchek-all');

// INITIAL OBJECTS
const user = {
    name: "Билл Гейтс",
    description: "Some quick example text to build on the card title and make up the bulk of the card's content."
}

let contacts = [
    {name: "Стив Джобс", mobile: "8979873498732"},
    {name: "Стив Возняк", mobile: "3675423475"},
    {name: "Балмер", mobile: "765467253467"}
];
let todoItems = [
    {id: 0, check: 0, text: "Кнопки внизу чтобы управлять заданиями"},
    {id: 1, check: 1, text: "Отмечай галочками выполненные"},
    {id: 2, check: 0, text: "Нажми на карандаш чтобы отредактировать"},
    
];

function createContactItem(contact) {
    return `
        <li class="list-group-item">
            ${contact.name}
            <div>
                <small>${contact.mobile}</small>
            </div>
        </li>
    `
}

function renderContacts(contacts) {
    contactsList.innerHTML = '';

    for (let i = 0; i < contacts.length; i++) {
        const currentContact = contacts[i];
        contactsList.innerHTML += createContactItem(currentContact);
    }
}

function changeNavbarContent(value) {
    navbaContent.innerText = value;
}

function changeProfileContent(name, description) {
    profileName.innerText = name;
    profileDescription.innerText = description;
}

function initialApp() {
    const savedName = localStorage.getItem('name');
    const savedDescription = localStorage.getItem('description');
    const savedContacts = localStorage.getItem('contacts');
    const savedTheme = localStorage.getItem('theme');
    const savedPage = localStorage.getItem('currentPage');
    const savedPageName = localStorage.getItem('pageName');
    const savedToDo = localStorage.getItem('todoItems');
    const savedId = localStorage.getItem('id');

    if (savedTheme === 'dark') {
        document.body.classList.add('theme-dark');
        switchTheme.classList.add('switch-active');
        switchTheme.setAttribute('data-checked', "1");
    }

    // Проверка на сохранённые имя и описание
    if (savedName) {
        user.name = savedName;
    }

    if (savedDescription) {
        user.description = savedDescription;
    }

    // Проверка сохраннённых контактов
    if (savedContacts) {
        contacts = JSON.parse(savedContacts);
    }

    if (savedToDo) {
        todoItems = JSON.parse(savedToDo);
    }
    if (savedId) {
        currentId = JSON.parse(savedId);
    }
    if (savedPage) {
        switchPage(savedPage);
    } else {
        switchPage("profile");
    }
    if (savedPageName) {
        changeNavbarContent(savedPageName);
    } else {
        changeNavbarContent("Профиль");
    }


    changeProfileContent(user.name, user.description);
    renderContacts(contacts);
    renderToDo(todoItems);

    profileForm['name'].value = user.name;
    profileForm['description'].value = user.description;


}

initialApp();

function menuBtnsBindEvent() {
    for (let i = 0; i < menuBtns.length; i++) {
        const btn = menuBtns[i];

        btn.addEventListener('click', function () {
            const pageName = btn.getAttribute('data-pagename');
            const path = btn.getAttribute('data-path');
            localStorage.setItem('pageName', pageName);
            changeNavbarContent(pageName);
            switchPage(path);
        })
    }
}

function switchPage(activePage) {
    switch (activePage) {
        case "profile":
            profilePage.style.display = "block";
            settingsPage.style.display = "none";
            listPage.style.display = "none";
            contactsPage.style.display = "none";
            localStorage.setItem('currentPage', 'profile');
            break;

        case "list":
            profilePage.style.display = "none";
            listPage.style.display = "block";
            contactsPage.style.display = "none";
            settingsPage.style.display = "none";
            localStorage.setItem('currentPage', 'list');
            break;

        case "contacts":
            profilePage.style.display = "none";
            listPage.style.display = "none";
            contactsPage.style.display = "block";
            settingsPage.style.display = "none";
            localStorage.setItem('currentPage', 'contacts');
            break;

        case "settings":
            profilePage.style.display = "none";
            listPage.style.display = "none";
            contactsPage.style.display = "none";
            settingsPage.style.display = "block";
            localStorage.setItem('currentPage', 'settings');
            break;
    }
}

function switchProfileForm(showProfileForm) {
    if (showProfileForm) {
        profileForm.style.display = 'block';
        profileCard.style.display = "none";
        showProfileForm = false;
        return;
    }

    profileForm.style.display = 'none';
    profileCard.style.display = "block";
    showProfileForm = true;
    return;
}

btnRedactProfile.addEventListener('click', function () {
    switchProfileForm(true);
})

profileForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Сохраняем изменные данные
    // F12 -> Application -> storage
    localStorage.setItem('name', profileForm['name'].value);
    localStorage.setItem('description', profileForm['description'].value);

    changeProfileContent(
        profileForm['name'].value,
        profileForm['description'].value
    )
    switchProfileForm(false);
})

searchContactsForm['search-query-contacts'].addEventListener('input', function () {
    const query = searchContactsForm['search-query-contacts'].value;
    const filtredContacts = contacts.filter(function (contact) {
        return contact.name.includes(query);
    })

    renderContacts(filtredContacts);
})

addContactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = addContactForm['name'].value;
    const mobile = addContactForm['mobile'].value;

    if (name.length && mobile.length) {
        // const contact = { name: name, mobile: mobile };
        contacts.unshift({name, mobile});
        localStorage.setItem('contacts', JSON.stringify(contacts));
        renderContacts(contacts);

        addContactForm['name'].value = '';
        addContactForm['mobile'].value = '';
    }

})

btnClearStore.addEventListener('click', function () {
    if (localStorage.length > 0) {
        const userAnswer = confirm('Вы уверены что хотите очистить localstorage?');

        if (userAnswer) {
            localStorage.clear();
        }
    }
})

switchTheme.addEventListener('click', function () {
    const checked = switchTheme.getAttribute('data-checked');
    switchTheme.classList.toggle('switch-active');
    document.body.classList.toggle('theme-dark');

    if (checked === '0') {
        switchTheme.setAttribute('data-checked', '1');
        localStorage.setItem('theme', 'dark');
    } else {
        switchTheme.setAttribute('data-checked', '0');
        localStorage.setItem('theme', 'light');
    }
})

// TODO FUNC


function createToDoItem(todoItem) {
    return `<li class="list-group-item">
        <div class="todoitem-container">
            <div class="checkbox" id="checkbox-${todoItem.id}" data-check="${todoItem.check}" data-id="${todoItem.id}"></div>
            <div class="todoitem" id="text-${todoItem.id}" data-edit="0">${todoItem.text} </div>
            <div class="correct" id="correct-${todoItem.id}"> <button class="btn-cor"  onclick="toDoCorrect(${todoItem.id})">
                          </button></div>
        </div>
        </li>
        `
}

function renderToDo(toDoItems) {
    toDoList.innerHTML = '';
    for (let i = 0; i < toDoItems.length; i++) {
        toDoList.innerHTML += createToDoItem(toDoItems[i]);

    }

}

addToDoForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const todo = addToDoForm['todo'].value;

    if (todo.length) {
        currentId += 1;
        todoItems.unshift({id: currentId, check: 0, text: todo});
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
        localStorage.setItem('id', JSON.stringify(currentId));
        renderToDo(todoItems);
        bindCheckBoxes();
        addToDoForm['todo'].value = '';
    }

})

function bindCheckBoxes() {
    for (let i = 0; i < toDoCheckboxes.length; i++) {
        let text = toDoText[i];
        const btn = toDoCheckboxes[i];
        //const id = btn.getAttribute('data-id');
        if (btn.getAttribute('data-check') === '1') {
            btn.classList.add('checkbox-checked')
            text.classList.add('todoitem-checked');
        }
        btn.addEventListener('click', function () {
            const cheked = btn.getAttribute('data-check');
            btn.classList.toggle('checkbox-checked');


            if (cheked === '0') {
                text.classList.add('todoitem-checked');
                btn.setAttribute('data-check', 1);
                todoItems[i].check = 1;

            } else {


                btn.setAttribute('data-check', 0);
                text.classList.remove('todoitem-checked');
                todoItems[i].check = 0;
            }
            localStorage.setItem('todoItems', JSON.stringify(todoItems));
        })
    }
}


function toDoCorrect(toDoId) {

    let text = document.getElementById('text-' + toDoId);
    let correct = document.getElementById('correct-' + toDoId);
    if (text.getAttribute('data-edit') == 0) {
        text.setAttribute('data-edit', 1);
        text.classList.toggle('editable');
        correct.classList.toggle('correct-active');
        text.contentEditable = true;
        text.focus();
    } else {
        text.setAttribute('data-edit', 0);
        text.contentEditable = false;
        text.classList.toggle('editable');
        correct.classList.toggle('correct-active');
        let idToDoArr = todoItems.findIndex(item => item.id == toDoId)
        todoItems[idToDoArr].text = text.innerHTML;
        localStorage.setItem('todoItems', JSON.stringify(todoItems));

    }

}

checkAll.addEventListener("click", function () {
    for (let i = 0; i < todoItems.length; i++) {
        todoItems[i].check = 1;
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
        renderToDo(todoItems);
        bindCheckBoxes();
    }
})
uncheckAll.addEventListener("click", function () {
    for (let i = 0; i < todoItems.length; i++) {
        todoItems[i].check = 0;
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
        renderToDo(todoItems);
        bindCheckBoxes();
    }
})
clearChecked.addEventListener("click", function () {
    for (let i = 0; i < todoItems.length; i++) {
        todoItems = todoItems.filter(item => item.check == 0);

    }
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
    renderToDo(todoItems);
    bindCheckBoxes();
})


renderToDo(todoItems);
bindCheckBoxes();
menuBtnsBindEvent();