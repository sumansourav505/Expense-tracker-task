const loginForm = document.getElementById('loginForm');
const signupButton = document.getElementById('signupButton');

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

    try {
        const response = await fetch('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Login successful!');
            window.location.href = '/expense';
        } else {
            alert(`Login failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Redirect to signup page
signupButton.addEventListener('click', () => {
    window.location.href = '/signup';
});
