const taskInput = document.getElementById('task-input');
const taskPriority = document.getElementById('task-priority');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const filterAll = document.getElementById('filter-all');
const filterCompleted = document.getElementById('filter-completed');
const filterIncomplete = document.getElementById('filter-incomplete');

// adding eventt listeners
addTaskButton.addEventListener('click', addTask);
darkModeToggle.addEventListener('click', toggleDarkMode);
filterAll.addEventListener('click', () => filterTasks('all'));
filterCompleted.addEventListener('click', () => filterTasks('completed'));
filterIncomplete.addEventListener('click', () => filterTasks('incomplete'));

// Functions
function addTask() {
    const taskText = taskInput.value.trim();
    const priority = taskPriority.value;

    if (!taskText) {
        alert('Task cannot be empty!');
        return;
    }

    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
        <span>${taskText} (${priority})</span>
        <div>
            <input type="checkbox" class="task-complete">
            <button class="edit-task">Edit</button>
            <button class="delete-task">Delete</button>
        </div>
    `;

    // Adding event listeners for buttons for each task event
    taskItem.querySelector('.task-complete').addEventListener('change', () => toggleTaskCompletion(taskItem));
    taskItem.querySelector('.edit-task').addEventListener('click', () => editTask(taskItem));
    taskItem.querySelector('.delete-task').addEventListener('click', () => deleteTask(taskItem));

    taskList.appendChild(taskItem);
    taskInput.value = '';
    saveTasks();
}

function toggleTaskCompletion(taskItem) {
    const taskSpan = taskItem.querySelector('span');
    const isCompleted = taskItem.querySelector('.task-complete').checked;

    if (isCompleted) {
        taskSpan.style.textDecoration = 'line-through';
        taskSpan.style.color = 'gray';
    } else {
        taskSpan.style.textDecoration = 'none';
        taskSpan.style.color = 'black';
    }

    saveTasks();
    filterTasks('all');
}

function editTask(taskItem) {
    const taskSpan = taskItem.querySelector('span');
    const originalText = taskSpan.textContent.split(' (')[0];
    const originalPriority = taskSpan.textContent.match(/\((.*?)\)/)[1];

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = originalText;

    const prioritySelect = document.createElement('select');
    ['High', 'Medium', 'Low'].forEach(priority => {
        const option = document.createElement('option');
        option.value = priority;
        option.textContent = priority;
        if (priority === originalPriority) {
            option.selected = true;
        }
        prioritySelect.appendChild(option);
    });

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', () => {
        const updatedText = inputField.value.trim();
        const updatedPriority = prioritySelect.value;

        if (!updatedText) {
            alert('Task cannot be empty!');
            return;
        }

        taskSpan.textContent = `${updatedText} (${updatedPriority})`;
        taskItem.replaceChild(taskSpan, inputField);
        taskItem.querySelector('div').replaceChild(taskItem.querySelector('.edit-task'), saveButton);
        saveTasks();
        filterTasks('all');
    });

    // cancel button functionality
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
        taskItem.replaceChild(taskSpan, inputField);
        taskItem.querySelector('div').replaceChild(taskItem.querySelector('.edit-task'), saveButton);
    });

    taskItem.replaceChild(inputField, taskSpan);
    taskItem.querySelector('div').replaceChild(saveButton, taskItem.querySelector('.edit-task'));
    taskItem.querySelector('div').appendChild(prioritySelect);
    taskItem.querySelector('div').appendChild(cancelButton);
}

// delete task functionality

function deleteTask(taskItem) {
    taskList.removeChild(taskItem);
    saveTasks();
}

// Dark Mode functionality
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Filter tasks functionality
function filterTasks(filter) {
    const tasks = taskList.children;
    for (let task of tasks) {
        const isCompleted = task.querySelector('.task-complete').checked;
        if (
            filter === 'all' ||
            (filter === 'completed' && isCompleted) ||
            (filter === 'incomplete' && !isCompleted)
        ) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    }
}

// saving tasks
function saveTasks() {
    const tasks = [];
    for (let task of taskList.children) {
        tasks.push({
            text: task.querySelector('span').textContent,
            completed: task.querySelector('.task-complete').checked,
        });
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// loading tasks from local storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    for (let task of tasks) {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <span>${task.text}</span>
            <div>
                <input type="checkbox" class="task-complete" ${task.completed ? 'checked' : ''}>
                <button class="edit-task">Edit</button>
                <button class="delete-task">Delete</button>
            </div>
        `;

        // Add event listeners for buttons
        taskItem.querySelector('.task-complete').addEventListener('change', () => toggleTaskCompletion(taskItem));
        taskItem.querySelector('.edit-task').addEventListener('click', () => editTask(taskItem));
        taskItem.querySelector('.delete-task').addEventListener('click', () => deleteTask(taskItem));

        taskList.appendChild(taskItem);
    }
}

// Initialization
loadTasks();