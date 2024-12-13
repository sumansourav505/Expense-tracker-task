const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/database');
const userRoutes = require('./routes/user');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the login page
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Serve the signup page
app.get('/signup', async (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Use user routes
app.use('/user', userRoutes);

// Sync database and start server
sequelize
    .sync()
    .then(() => {
        console.log('Database synced successfully.');
        app.listen(3000, () => {
            console.log('Server running at http://localhost:3000');
        });
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });
