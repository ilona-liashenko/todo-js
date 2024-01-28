class Storage {
    #key;

    constructor(key) {
        this.#key = key;
    }

    add(value) {
        const data = JSON.parse(localStorage.getItem(this.#key)) || [];

        data.push(value);

        localStorage.setItem(this.#key, JSON.stringify(data));
    }

    remove(id) {
        const data = JSON.parse(localStorage.getItem(this.#key));

        if (data?.length) {
            const result = data.filter(item => item.id !== id);

            localStorage.setItem(this.#key, JSON.stringify(result));
        }
    }

    toggleCheck(id, completed) {
        const data = JSON.parse(localStorage.getItem(this.#key));

        if (data?.length) {
            const result = data.map(item => {
                if (item.id === id) {
                    item.isCompleted = completed;
                }

                return item;
            });

            localStorage.setItem(this.#key, JSON.stringify(result));
        }
    }

    get data() {
        return JSON.parse(localStorage.getItem(this.#key));
    }
}

class TodoItem {
    constructor(text, priority, isCompleted = false) {
        this.id = Date.now();
        this.text = text;
        this.priority = priority;
        this.isCompleted = isCompleted;
    }
}

const taskInput = document.querySelector('.form-control');
const submitBtn = document.querySelector('.btn');
const list = document.querySelector('.list');
const taskStorage = new Storage('tasks');

window.onload = function() {
    console.log('taskStorage.data: ', taskStorage.data);

    if (taskStorage.data?.length) {
        taskStorage.data.forEach(todoItem => {
            list.innerHTML += renderLi(todoItem);
        });
    }
}

taskInput.addEventListener('focus', () => {
    taskInput.placeholder = '';
})

submitBtn.addEventListener('click', (event) => {
    event.preventDefault();

    if (!taskInput.value?.trim()) return;
   
    const priorityRadio = document.querySelector('input[name="priority"]:checked');
    const priorityValue = priorityRadio ? priorityRadio.value : '1';
    const todoItem = new TodoItem(taskInput.value, priorityValue);

    taskStorage.add(todoItem);
    list.innerHTML += renderLi(todoItem);
    taskInput.value = '';

    taskInput.placeholder = 'Write your task here...';
});


function toggleTask(target, id) {
    if (target.checked) {
        target.nextElementSibling.classList.add('completed');
    } else {
        target.nextElementSibling.classList.remove('completed');
    }

    taskStorage.toggleCheck(id, target.checked);
}


function deleteItem(target, id) {
    const confirmed = confirm('Are you sure you want to delete item?');

    if (confirmed) {
        const listItem = target.closest('li.list__item');
    
        listItem.remove(); 
        taskStorage.remove(id);
    }
}

function renderLi({id, text, priority, isCompleted}) {
    return `
        <li class="list-group-item list__item list__item--priority-${priority}">
            <div class="list__item-wrap">
                <input class="form-check-input me-1" type="checkbox" id="firstCheckbox-${id}" ${isCompleted ? 'checked' : ''} onchange="toggleTask(this, ${id})">
                <label class="form-check-label ${isCompleted ? 'completed' : ''}" for="firstCheckbox-${id}">
                    ${text}
                </label>
            </div>
            <div class="list__link-wrap">
                <button class="list__link-btn" onclick="deleteItem(this, ${id})"><i class="fa-regular fa-trash-can list__link"></i></button>
            </div>
        </li>
    `;
}










