const loginForm = document.getElementById('loginForm');
const signupButton = document.getElementById('signupButton');

const BASE_URL = 'http://localhost:3000'; // Define base URL

// Handle login submission
loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('mail').value.trim();
    const password = document.getElementById('pwd').value.trim();

    if (!email || !password) {
        alert('Please fill all the fields.');
        return;
    }

    const loginData = { email, password };
    const loginButton = event.submitter; // Access the submit button

    try {
        // Disable button and show loading state
        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';

        const response = await axios.post(`${BASE_URL}/user/login`, loginData);

        // Save token to localStorage
        localStorage.setItem('token', response.data.token);

        alert('Login successful!');
        loginForm.reset(); // Reset the form fields
        window.location.href = '/expense'; // Redirect to the expense page
    } catch (error) {
        console.error('Error:', error);

        if (error.response && error.response.data && error.response.data.message) {
            alert(`Login failed: ${error.response.data.message}`);
        } else {
            alert('An error occurred. Please try again.');
        }
    } finally {
        // Re-enable button and reset loading state
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
    }
});

// Redirect to signup page
signupButton.addEventListener('click', () => {
    window.location.href = '/signup';
});
