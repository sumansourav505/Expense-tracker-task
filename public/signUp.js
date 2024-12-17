const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('mail').value.trim();
    const password = document.getElementById('pwd').value.trim();

    if (!name || !email || !password) {
        alert('Please fill all the fields.');
        return;
    }

    const userData = { name, email, password };

    try {
        const response = await fetch('/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Sign-up successful!');
            signupForm.reset();
            window.location.href = '/';
        } else {
            alert(`Sign-up failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});
