const express = require('express');
const app = express();
const PORT = 3000;

// logging, executes for each request
app.use((req, res, next) =>{
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} ${req.method} ${req.originalUrl}`);
    next();
});

app.use(express.json());

// placeholder data 
let resources = [
    {id: 1, name:"Have chatgpt do my homework", completed: false},
    {id: 2, name:"Cram for midterm", completed: false},
];
let nextId=3;


// Endpoints setup

//GET all resources
app.get('/api/resources', (req,res) => {
    res.status(200).json(resources);
});

//GET single resouce
app.get('/api/resources/:id', (req, res) => {
    const id = Number(req.params.id);
    const resource = resources.find(item => item.id === id);

    if (!resource) {
        return res.status(404).json({
            error: "Resource not found"
        });
    }

    res.status(200).json(resource);
});

//POST a new resource
app.post('/api/resources', (req, res) => {
    const { name, completed } = req.body;

    if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
            error: "Task name required"
        });
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).json({
            error: "Completed must be true or false"
        });
    }
    // Assemble the new resource
    const newResource = {
        id: nextId++,
        name: name.trim(),
        completed: completed ?? false
    };
    resources.push(newResource);

    res.status(201).json(newResource);
});

//PUT update a resource
app.put('/api/resources/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = resources.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Resource not found"
        });
    }

    const { name, completed } = req.body;

    if (typeof name !== 'string' || !name.trim()
        || typeof completed !== 'boolean') {
        return res.status(400).json({
            error: "A name and boolean completed value are required"
        });
    }

    resources[index] = {
        id: resources[index].id,
        name: name.trim(),
        completed
    };

    res.status(200).json(resources[index]);
});

//DELETE resource
app.delete('/api/resources/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = resources.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Resource not found"
        });
    }

    resources.splice(index, 1);

    res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

