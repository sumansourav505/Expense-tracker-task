const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/database');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const User=require('./models/user');
const Expense=require('./models/expense');


const app = express();

// Middleware
app.use(bodyParser.json()); // Parses JSON payloads
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded payloads
app.use(express.static(path.join(__dirname, 'public')));

// Serve pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signUp.html'));
});

app.get('/expense', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'expense.html'));
});

// Use routes
app.use('/user', userRoutes); // All user-related APIs
app.use('/expense', expenseRoutes); // All expense-related APIs
//association
User.hasMany(Expense);
Expense.belongsTo(User);

// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});


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
