const loginForm = document.getElementById('loginForm');
const signupButton = document.getElementById('signupButton');

// Handle login submission
loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('mail').value;
    const password = document.getElementById('pwd').value;

    const loginData = { email, password };

    try {
        const response = await fetch('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            loginForm.reset();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Redirect to the signup page
signupButton.addEventListener('click', function () {
    window.location.href = '/signup';
});
