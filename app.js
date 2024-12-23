const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // Load environment variables
const sequelize = require('./config/database');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'views', 'signUp.html')));
app.get('/expense', (req, res) => res.sendFile(path.join(__dirname, 'views', 'expense.html')));

// Use routes
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);

// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Associations
User.hasMany(Expense, { foreignKey: 'userId', onDelete: 'CASCADE' });
Expense.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Order);
Order.belongsTo(User);

// Sync database and start server
sequelize
    .sync()
    .then(() => {
        console.log('Database synced successfully.');
        app.listen(3000, () => console.log('Server running at http://localhost:3000'));
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });
