document.addEventListener('DOMContentLoaded', displayExpenses);
document.getElementById('addExpense').addEventListener('click', addExpense);

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
function displayExpenses() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Authorization token not found');
        return;
    }

    axios
        .get(`/expense/user/`, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
            const expenses = response.data;
            const expenseList = document.getElementById('expenseList');
            expenseList.innerHTML = ''; // Clear the list
            expenses.forEach((expense) => displayExpense(expense));
        })
        .catch((error) => {
            console.error('Error fetching expenses:', error.message);
        });
}

// Display a single expense
function displayExpense(expense) {
    const expenseList = document.getElementById('expenseList');
    const expenseItem = document.createElement('div');
    expenseItem.className =
        'alert alert-secondary d-flex justify-content-between align-items-center';
    expenseItem.innerHTML = `
        <span>${expense.category}: ${expense.description} - ₹${expense.amount}</span>
        <div>
            <button class="btn btn-sm btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>
        </div>
    `;
    expenseList.appendChild(expenseItem);
}

// Clear input fields
function clearFields() {
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseDescription').value = '';
    document.getElementById('expenseCategory').value = '';
}

// Delete an expense
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
