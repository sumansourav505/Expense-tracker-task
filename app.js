const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/database');
const userRoutes = require('./routes/user');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Serve index.html from the views folder
app.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'views', 'index.html'));
    } catch (error) {
        res.status(500).send('Error loading the page.');
    }
});

// Use user routes
app.use('/user', userRoutes);

// Sync database and start server
sequelize
    .sync()
    .then(() => {
        console.log('Database synced successfully.');

        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });

module.exports = app;
