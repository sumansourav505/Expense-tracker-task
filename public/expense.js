// document.addEventListener('DOMContentLoaded', displayExpenses);
// document.getElementById('addExpense').addEventListener('click', addExpense);

// function addExpense() {
//   const amount = document.getElementById('expenseAmount').value;
//   const description = document.getElementById('expenseDescription').value;
//   const category = document.getElementById('expenseCategory').value;

//   if (amount && description && category) {
//     const expense = { id: Date.now(), amount, description, category };
//     // saveExpenseToLocal(expense);
//     displayExpense(expense);
//     clearFields();
//   } else {
//     alert("Please fill all fields!");
//   }
// }

// // function saveExpenseToLocal(expense) {
// //   let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
// //   expenses.push(expense);
// //   localStorage.setItem('expenses', JSON.stringify(expenses));
// // }

// function displayExpenses() {
//   document.getElementById('expenseList').innerHTML = "";  // Clear list before displaying
//   let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
//   expenses.forEach(expense => displayExpense(expense));
// }

// function displayExpense(expense) {
//   const expenseList = document.getElementById('expenseList');
//   const expenseItem = document.createElement('div');
//   expenseItem.className = 'alert alert-secondary d-flex justify-content-between align-items-center';
//   expenseItem.innerHTML = `
//     <span>${expense.category}: ${expense.description} - ₹${expense.amount}</span>
//     <div>
//       <button class="btn btn-sm btn-warning mr-2" onclick="editExpense(${expense.id})">Edit</button>
//       <button class="btn btn-sm btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>
//     </div>
//   `;
//   expenseItem.dataset.id = expense.id;
//   expenseList.appendChild(expenseItem);
// }

// // function deleteExpense(id) {
// //   let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
// //   expenses = expenses.filter(expense => expense.id !== id);
// //   localStorage.setItem('expenses', JSON.stringify(expenses));
// //   displayExpenses();  // Refresh the list
// // }

// // function editExpense(id) {
// //   let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
// //   const expense = expenses.find(exp => exp.id === id);

// //   if (expense) {
// //     document.getElementById('expenseAmount').value = expense.amount;
// //     document.getElementById('expenseDescription').value = expense.description;
// //     document.getElementById('expenseCategory').value = expense.category;

// //     // Remove the existing item temporarily
// //     deleteExpense(id);

// //     // Re-add with new details when 'Add Expense' is clicked
// //     document.getElementById('addExpense').innerText = 'Update Expense';
// //     document.getElementById('addExpense').onclick = function () {
// //       updateExpense(id);
// //     };
// //   }
// // }

// // function updateExpense(id) {
// //   const amount = document.getElementById('expenseAmount').value;
// //   const description = document.getElementById('expenseDescription').value;
// //   const category = document.getElementById('expenseCategory').value;

// //   if (amount && description && category) {
// //     const updatedExpense = { id, amount, description, category };
// //     saveExpenseToLocal(updatedExpense);
// //     displayExpenses();
// //     clearFields();
// //     document.getElementById('addExpense').innerText = 'Add Expense';
// //     document.getElementById('addExpense').onclick = addExpense;
// //   } else {
// //     alert("Please fill all fields!");
// //   }
// // }

// function clearFields() {
//   document.getElementById('expenseAmount').value = '';
//   document.getElementById('expenseDescription').value = '';
//   document.getElementById('expenseCategory').value = '';
// }
//new updates
let editingExpenseId = null;
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

  const expense = { amount, description, category, userId: 1 }; // Set userId (dynamic later)

  try {
    // Send data to the server
    const response = await fetch('/expense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add expense');
    }

    const newExpense = await response.json();
    displayExpense(newExpense); // Update list with new expense
    clearFields();
  } catch (error) {
    console.error('Error adding expense:', error.message);
    alert('Failed to add expense.');
  }
}

// Fetch and display all expenses
async function displayExpenses() {
  try {
    const response = await fetch('/expense/user/1'); // Fetch expenses for userId=1
    if (!response.ok) throw new Error('Failed to fetch expenses');

    const expenses = await response.json();
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = ''; // Clear the list

    expenses.forEach(expense => displayExpense(expense));
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
    const response = await fetch(`/expense/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete expense');

    alert('Expense deleted successfully!');
    displayExpenses(); // Refresh the list
  } catch (error) {
    console.error('Error deleting expense:', error.message);
    alert('Failed to delete expense.');
  }
}
