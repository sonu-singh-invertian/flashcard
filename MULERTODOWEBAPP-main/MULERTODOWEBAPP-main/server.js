import express from 'express';
import cors from 'cors';
import upload from './multerConfig.js';

const app = express();
app.use(cors());
app.use(express.json());

// Expose the public folder for images, and frontend folder for the website
app.use('/public', express.static('public'));
app.use(express.static('frontend'));

// Our In-Memory "Database"
let tasks = []; 

// 1. READ: Get all tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// 2. CREATE: Add a new task (with image)
// 2. CREATE: Add a new task (with image)
app.post('/api/tasks', upload.single('thumbnail'), (req, res) => {
    
    // --> ADDED THIS TRACKER <--
    console.log("File received by server:", req.file); 
    console.log("Body received by server:", req.body);

    const { title } = req.body;
    const newTask = {
        id: Date.now().toString(),
        title: title || 'Untitled Task',
        thumbnail: req.file ? req.file.path.replace(/\\/g, "/") : null, 
        completed: false
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// 3. MUTATE: Toggle task completion
app.put('/api/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === req.params.id);
    if (task) {
        task.completed = !task.completed;
        res.json(task);
    } else {
        res.status(404).json({ error: "Task not found" });
    }
});

// 4. DELETE: Remove a task
app.delete('/api/tasks/:id', (req, res) => {
    tasks = tasks.filter(t => t.id !== req.params.id);
    res.json({ message: "Task deleted" });
});

app.listen(5000, () => {
    console.log('Server running! Open http://localhost:5000 in your browser.');
});