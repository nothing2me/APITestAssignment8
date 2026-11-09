const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Check and connect to the database
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing. Add it to your .env file.');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// logging, executes for each request
app.use((req, res, next) =>{
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} ${req.method} ${req.originalUrl}`);
    next();
});

app.use(express.json());

// Parse DB data 
function parseId(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        res.status(400).json({ error: 'ID must be a positive integer' });
        return null;
    }

    return id;
}

// Endpoints setup

// GET /api/items — Get every item
app.get('/api/items', async (req, res) => {
    const result = await pool.query(
        'SELECT id, name, completed FROM items ORDER BY id'
    );
    res.status(200).json(result.rows);
});

//GET single resouce
// GET /api/items/:id — Get one item
app.get('/api/items/:id', async (req, res) => {
    const id = parseId(req, res);
    if (id === null) return;

    const result = await pool.query(
        'SELECT id, name, completed FROM items WHERE id = $1',
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json(result.rows[0]);
});

// POST /api/items — Insert a new item
app.post('/api/items', async (req, res) => {
    const { name, completed } = req.body ?? {};
    const completedValue = completed === undefined ? false : completed;

    if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Task name required' });
    }

    if (typeof completedValue !== 'boolean') {
        return res.status(400).json({
            error: 'Completed must be true or false'
        });
    }

    const result = await pool.query(
        `INSERT INTO items (name, completed)
         VALUES ($1, $2)
         RETURNING id, name, completed`,
        [name.trim(), completedValue]
    );

    res.status(201).json(result.rows[0]);
});

// PUT /api/items/:id — Update an item
app.put('/api/items/:id', async (req, res) => {
    const id = parseId(req, res);
    if (id === null) return;

    const { name, completed } = req.body ?? {};

    if (typeof name !== 'string' || !name.trim()
        || typeof completed !== 'boolean') {
        return res.status(400).json({
            error: 'A name and boolean completed value are required'
        });
    }

    const result = await pool.query(
        `UPDATE items
         SET name = $1, completed = $2
         WHERE id = $3
         RETURNING id, name, completed`,
        [name.trim(), completed, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json(result.rows[0]);
});

// DELETE /api/items/:id — Delete the item
app.delete('/api/items/:id', async (req, res) => {
    const id = parseId(req, res);
    if (id === null) return;

    const result = await pool.query(
        'DELETE FROM items WHERE id = $1 RETURNING id',
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Item not found' });
    }

    res.status(204).send();
});

// Start the server after confirming database connection
pool.query('SELECT 1')
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to PostgreSQL:', error);
        process.exit(1);
    });