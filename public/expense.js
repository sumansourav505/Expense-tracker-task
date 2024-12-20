// new updates with Axios
let editingExpenseId = null;
const userId=1;//initial value
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

  const expense = { amount, description, category, userId }; 

  try {
    // Send data to the server
    const response = await axios.post('/expense', expense);

    const newExpense = response.data;
    if(newExpense.userId===userId){
      displayExpense(newExpense); // Update list with new expense
    }
    clearFields();
  } catch (error) {
    console.error('Error adding expense:', error.message);
    alert('Failed to add expense.');
  }
}

// Fetch and display all expenses
async function displayExpenses() {
  const token=localStorage.getItem('token');
  try {
    const response = await axios.get('/expense/user/${userId}',{header:{"Authorization":token}}); // Fetch expenses for userId=1

    const expenses = response.data;
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = ''; // Clear the list
    //filter expense by userId
    expenses
    .filter(expense=>expense.userId===userId)
    .forEach(expense => displayExpense(expense));
  } catch (error) {
    console.error('Error fetching expenses:', error.message);
  }
}

// Display a single expense
function displayExpense(expense) {
  const expenseList = document.getElementById('expenseList');
  const expenseItem = document.createElement('div');
  expenseItem.className = 'alert alert-secondary d-flex justify-content-between align-items-center';
  expenseItem.innerHTML = `
    <span>${expense.category}: ${expense.description} - ₹${expense.amount}</span>
    <div>
      <button class="btn btn-sm btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>
      <button class="btn btn-sm btn-warning mr-2" onclick="editExpense(${expense.id})">Edit</button>
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
  try {
    await axios.delete(`/expense/${id}`);

    alert('Expense deleted successfully!');
    displayExpenses(); // Refresh the list
  } catch (error) {
    console.error('Error deleting expense:', error.message);
    alert('Failed to delete expense.');
  }
}
