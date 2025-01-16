document.addEventListener('DOMContentLoaded', () => {
    displayExpenses();
    checkPremiumStatus(); // Check and update the premium button visibility
});

document.getElementById('addExpense').addEventListener('click', addExpense);
document.getElementById('premiumButton').addEventListener('click', razoPay);

document.addEventListener('click', (event) => {
    if (event.target && event.target.id === 'leadershipButton') {
        showLeadershipBoard();
    }
});

const BASE_URL = 'http://localhost:3000'; // Define your base URL


// Add a new expense
async function addExpense() {
    const amount = document.getElementById('expenseAmount').value.trim();
    const description = document.getElementById('expenseDescription').value.trim();
    const category = document.getElementById('expenseCategory').value.trim();

    if (!amount || !description || !category) {
        alert("Please fill all fields!");
        return;
    }

    const expense = { amount, description, category };

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/expense', expense, {
            headers: { Authorization: `Bearer ${token}` },
        });
        displayExpense(response.data);
        clearFields();
    } catch (error) {
        console.error('Error adding expense:', error.message);
        alert('Failed to add expense.');
    }
}

// Fetch and display all expenses
async function displayExpenses() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Authorization token not found');
        return;
    }

    try {
        const response = await axios.get(`${BASE_URL}/expense/user/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const expenses = response.data;
        const expenseList = document.getElementById('expenseList');
        expenseList.innerHTML = ''; // Clear the list
        if (expenses.length === 0) {
            const noExpensesMessage = document.createElement('p');
            noExpensesMessage.textContent = 'No expenses found.';
            expenseList.appendChild(noExpensesMessage);
        }
        expenses.forEach((expense) => displayExpense(expense));
    } catch (error) {
        console.error('Error fetching expenses:', error.message);
    }
}

// Display a single expense
function displayExpense(expense) {
    const expenseList = document.getElementById('expenseList');
    const expenseItem = document.createElement('div');
    expenseItem.className =
        'alert alert-secondary d-flex justify-content-between align-items-center';
    expenseItem.innerHTML = `
        <span>${expense.category}: ${expense.description} - ₹${parseFloat(expense.amount).toFixed(2)}</span>
        <div>
            <button class="btn btn-sm btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>
        </div>
    `;
    expenseList.appendChild(expenseItem);
}
//clear fields
function clearFields() {
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseDescription').value = '';
    document.getElementById('expenseCategory').value = '';
}
//delete expenses
async function deleteExpense(id) {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`/expense/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        alert('Expense deleted successfully!');
        displayExpenses();
    } catch (error) {
        console.error('Error deleting expense:', error.message);
        alert('Failed to delete expense.');
    }
}
// Check if the user is a premium user and show/hide the premium button
async function checkPremiumStatus() {
    const premiumButton = document.getElementById('premiumButton');
    let premiumContainer = document.getElementById('premiumMessageContainer');

    if (!premiumContainer) {
        premiumContainer = document.createElement('div');
        premiumContainer.id = 'premiumMessageContainer';
        document.body.appendChild(premiumContainer);
    }

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Authorization token not found.');
        return;
    }

    try {
        const response = await axios.get(`${BASE_URL}/user/status`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.isPremiumUser) {
            premiumButton.style.display = 'none';
            if (!document.getElementById('leadershipButton')) {
                const leadershipButton = document.createElement('button');
                leadershipButton.id = 'leadershipButton';
                leadershipButton.textContent = 'Leadership';
                leadershipButton.classList.add('btn', 'btn-info');
                leadershipButton.style.position = 'fixed';
                leadershipButton.style.top = '20px';
                leadershipButton.style.right = '120px';
                leadershipButton.style.zIndex = '1000';
                document.body.appendChild(leadershipButton);
            }

            let premiumMessage = document.querySelector('.premium-message');
            if (!premiumMessage) {
                premiumMessage = document.createElement('p');
                premiumMessage.textContent = 'You are a premium user🤴';
                premiumMessage.classList.add('premium-message');
                premiumContainer.appendChild(premiumMessage);
            }
        } else {
            premiumButton.style.display = 'block';

            const leadershipButton = document.getElementById('leadershipButton');
            if (leadershipButton) {
                leadershipButton.remove();
            }

            const premiumMessage = document.querySelector('.premium-message');
            if (premiumMessage) {
                premiumMessage.remove();
            }
        }
    } catch (error) {
        console.error('Error fetching premium status:', error.message);
        alert('Failed to fetch user status. Please refresh the page.');
    }
}

// Show leadership board
async function showLeadershipBoard() {
    const leadershipElement = document.getElementById('leadership');
    leadershipElement.innerHTML = '<h1>Leaders Board</h1>'; // Clear existing content and set header

    const token =localStorage.getItem('token');
        if (!token) {
            console.error('Authorization token not found');
            alert('Please log in to view the leadership board.');
            return;
        }

    try {
        const response = await axios.get(`${BASE_URL}/premium/show-leadership`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response.data);

        response.data.forEach((userDetails) => {
            const listItem = document.createElement('li');
            listItem.textContent = `Name: ${userDetails.name}, Total Expense: ₹${userDetails.totalExpenses}`;
            leadershipElement.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching leadership data:', error.message);
        alert('Failed to fetch leadership board.');
    }
}

// Razorpay Integration for Premium Membership
async function razoPay() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Authorization token not found');
        alert('Please log in to proceed');
        return;
    }

    try {
        const response = await axios.post(`${BASE_URL}/purchase/premium-membership`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const { order, keyId } = response.data;
        if (!order || !order.id || !keyId) {
            throw new Error('Invalid response from server during Razorpay integration.');
        }

        var options = {
            key: keyId,
            order_id: order.id,
            handler: async function (response) {
                try {
                    await axios.post(
                        `${BASE_URL}/purchase/updateTransactionStatus`,
                        {
                            order_id: options.order_id,
                            payment_id: response.razorpay_payment_id,
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    alert('You are a premium user now');
                    checkPremiumStatus();
                } catch (err) {
                    console.error('Error updating transaction status:', err);
                    alert('Transaction failed!');
                }
            },
        };

        const rzp = new Razorpay(options);
        rzp.open();
    } catch (error) {
        console.error('Error initiating Razorpay:', error.message);
        alert('Failed to initiate payment.');
    }
}
