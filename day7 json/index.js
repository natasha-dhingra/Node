const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

const USERS_FILE = 'users.json';

// Read users from file
const readUsers = () => {
    try {
        const data = fs.readFileSync(USERS_FILE);
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Write users to file
const writeUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// GET /users → Returns a list of users
app.get('/users', (req, res) => {
    res.json(readUsers());
});

// POST /users → Accepts a new user and adds it to the list
app.post('/users', (req, res) => {
    const users = readUsers();
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }
    const newUser = { id: users.length + 1, name, email };
    users.push(newUser);
    writeUsers(users);
    res.status(201).json(newUser);
});

// PUT /users/:id → Updates user details
app.put('/users/:id', (req, res) => {
    const users = readUsers();
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    const { name, email } = req.body;
    if (!name && !email) {
        return res.status(400).json({ message: 'At least one field (name or email) must be provided' });
    }
    
    users[userIndex] = { ...users[userIndex], ...req.body };
    writeUsers(users);
    res.json(users[userIndex]);
});

// DELETE /users/:id → Deletes a user
app.delete('/users/:id', (req, res) => {
    let users = readUsers();
    const userId = parseInt(req.params.id);
    
    if (!users.some(user => user.id === userId)) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    users = users.filter(user => user.id !== userId);
    writeUsers(users);
    res.json({ message: 'User deleted successfully' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
    console.log('Server running at http://localhost:${port}');
});