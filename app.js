const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

app.post('/user/signup', (req, res) => {
    const { name, email, password } = req.body;
    console.log('User Data:', { name, email, password });
    
    // Add your logic to save user data or return an error
    if (name && email && password) {
        res.status(201).json({ message: 'User signed up successfully!' });
    } else {
        res.status(400).json({ message: 'Invalid user data.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
