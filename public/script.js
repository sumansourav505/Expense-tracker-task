const singUpSubmit=document.getElementById('signupForm');
        singUpSubmit.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent the default form submission

            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('mail').value;
            const password = document.getElementById('pwd').value;

            const userData = {
                name: name,
                email: email,
                password: password
            };

            try {
                // Send POST request to the backend
                const response = await fetch('http://localhost:3000/user/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                if (response.ok) {
                    const data = await response.json();
                    alert('Sign-up successful!');
                    console.log(data);
                    singUpSubmit.reset();
                } else {
                    const errorData = await response.json();
                    alert('Sign-up failed: ' + errorData.message);
                    console.error(errorData);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });