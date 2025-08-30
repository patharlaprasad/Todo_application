// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('add-task-form');
    const taskListContainer = document.getElementById('task-list-container');
    const loadingMessage = document.getElementById('loading-message');

    // --- API Communication Functions ---

    // Fetches all tasks from the backend API
    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/tasks');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            taskListContainer.innerHTML = '<p class="error">Could not load tasks. Please try again later.</p>';
        }
    };

    // --- DOM Manipulation Functions ---

    // Renders the list of tasks to the page
    const renderTasks = (tasks) => {
        // Clear current list
        taskListContainer.innerHTML = '';

        if (tasks.length === 0) {
            taskListContainer.innerHTML = '<p class="no-tasks">Your to-do list is empty. Add a task to get started!</p>';
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id; // Store task ID in a data attribute

            li.innerHTML = `
                <div class="task-details">
                    <span class="task-title">${task.title}</span>
                    <span class="task-category">${task.category}</span>
                    <p class="task-description">${task.description || 'No description'}</p>
                    <span class="task-timestamp">Created: ${task.created_at}</span>
                </div>
                <div class="task-actions">
                    ${!task.completed ? `<button class="btn-complete">✓ Complete</button>` : ''}
                    <button class="btn-delete">✗ Delete</button>
                </div>
            `;
            taskListContainer.appendChild(li);
        });
    };

    // --- Event Listeners ---

    // Handle form submission to add a new task
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission (page reload)

        const titleInput = document.getElementById('task-title');
        const descriptionInput = document.getElementById('task-description');
        const categoryInput = document.getElementById('task-category');

        const title = titleInput.value;
        const description = descriptionInput.value;
        const category = categoryInput.value;

        if (!title.trim()) {
            alert('Task title cannot be empty.');
            return;
        }

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description, category }),
            });

            if (response.ok) {
                taskForm.reset(); // Clear the form fields
                fetchTasks(); // Refresh the task list
            } else {
                throw new Error('Failed to add task');
            }
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Could not add task. Please check the connection.');
        }
    });

    // Handle clicks on "Complete" and "Delete" buttons using event delegation
    taskListContainer.addEventListener('click', async (e) => {
        const target = e.target;
        const taskItem = target.closest('.task-item');
        if (!taskItem) return;

        const taskId = taskItem.dataset.id;
        let url = `/api/tasks/${taskId}`;
        let method = 'DELETE';

        if (target.classList.contains('btn-complete')) {
            url += '/complete';
            method = 'POST';
        } else if (!target.classList.contains('btn-delete')) {
            return; // Click was not on a button
        }

        try {
            const response = await fetch(url, { method });
            if (response.ok) {
                fetchTasks(); // Refresh the list on success
            } else {
                throw new Error(`Failed to ${method === 'DELETE' ? 'delete' : 'complete'} task`);
            }
        } catch (error) {
            console.error(`Error with task action:`, error);
            alert('Action failed. Please try again.');
        }
    });

    // --- Initial Load ---
    // Fetches tasks from the server as soon as the page loads
    fetchTasks();
});
// static/script.js

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescInput = document.getElementById('task-description');
    const taskCategoryInput = document.getElementById('task-category');

    // --- Function to fetch and display tasks ---
    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/tasks');
            const tasks = await response.json();
            
            // Clear the current list
            taskList.innerHTML = ''; 
            
            if (tasks.length === 0) {
                taskList.innerHTML = '<p>Your to-do list is empty. Add a task to get started!</p>';
            } else {
                tasks.forEach(task => {
                    const taskItem = document.createElement('div');
                    taskItem.classList.add('task-item');
                    if (task.completed) {
                        taskItem.classList.add('completed');
                    }
                    
                    taskItem.innerHTML = `
                        <div class="task-content">
                            <h3>${task.title}</h3>
                            <p>${task.description || ''}</p>
                            <span class="category">${task.category || 'General'}</span>
                        </div>
                        <div class="task-actions">
                            <button class="complete-btn" data-id="${task.id}">${task.completed ? 'Undo' : 'Complete'}</button>
                            <button class="delete-btn" data-id="${task.id}">Delete</button>
                        </div>
                    `;
                    taskList.appendChild(taskItem);
                });
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            taskList.innerHTML = '<p>Could not load tasks. Please try again later.</p>';
        }
    };

    // --- Handle adding a new task ---
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent page reload
        
        const newTask = {
            title: taskTitleInput.value,
            description: taskDescInput.value,
            category: taskCategoryInput.value,
        };
        
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask),
            });
            
            if (response.ok) {
                taskForm.reset(); // Clear the form
                fetchTasks();     // Refresh the list
            } else {
                alert('Failed to add task.');
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    });

    // --- Handle complete and delete buttons (Event Delegation) ---
    taskList.addEventListener('click', async (e) => {
        const target = e.target;
        const taskId = target.dataset.id;

        if (!taskId) return; // Exit if the click was not on a button with a data-id

        // Handle delete
        if (target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this task?')) {
                await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
                fetchTasks(); // Refresh list
            }
        }

        // Handle complete/undo
        if (target.classList.contains('complete-btn')) {
            await fetch(`/api/tasks/${taskId}/complete`, { method: 'PUT' });
            fetchTasks(); // Refresh list
        }
    });

    // --- Initial load of tasks when the page loads ---
    fetchTasks();
});
