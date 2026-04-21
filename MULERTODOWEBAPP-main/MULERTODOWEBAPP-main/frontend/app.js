const API_URL = 'http://localhost:5000/api/tasks';

// Load tasks on startup
async function fetchTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    renderTasks(tasks);
}

// Render tasks to the DOM
function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear current list

    tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // If there's an image, point to the server url. Otherwise, show a placeholder block.
        const imageHtml = task.thumbnail 
            ? `<img src="http://localhost:5000/${task.thumbnail}" class="task-img" alt="Thumbnail">`
            : `<div class="task-img" style="display:flex; align-items:center; justify-content:center; color:#999;">No Image</div>`;

        div.innerHTML = `
            ${imageHtml}
            <div class="task-content">
                <h3>${task.title}</h3>
            </div>
            <div class="task-actions">
                <button class="btn-toggle" onclick="toggleTask('${task.id}')">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="btn-delete" onclick="deleteTask('${task.id}')">Delete</button>
            </div>
        `;
        taskList.appendChild(div);
    });
}

// ADD Task
document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    
    const fileInput = document.getElementById('thumbnail');
    if (fileInput.files[0]) formData.append('thumbnail', fileInput.files[0]);

    await fetch(API_URL, { method: 'POST', body: formData });
    
    document.getElementById('taskForm').reset();
    fetchTasks();
});

// MUTATE: Toggle Complete
async function toggleTask(id) {
    await fetch(`${API_URL}/${id}`, { method: 'PUT' });
    fetchTasks();
}

// DELETE Task
async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTasks();
}

// Initial load
fetchTasks();