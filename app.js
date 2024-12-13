const express = require('express');
const app = express();
const path=require('path');
const PORT = 3000;
// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')))

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','index.html'));
});

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
