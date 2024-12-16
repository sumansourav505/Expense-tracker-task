// public/expense.js

document.addEventListener('DOMContentLoaded', displayExpenses);
document.getElementById('addExpense').addEventListener('click', addExpense);

async function addExpense() {
  const amount = document.getElementById('expenseAmount').value;
  const description = document.getElementById('expenseDescription').value;
  const category = document.getElementById('expenseCategory').value;

  if (amount && description && category) {
    const expense = { amount, description, category, userId: 1 }; // Replace `userId` with dynamic user authentication later

    try {
      const response = await fetch('/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        throw new Error('Failed to add expense');
      }

      const result = await response.json();
      displayExpense(result.expense);
      clearFields();
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error adding expense. Please try again.');
    }
  } else {
    alert('Please fill all fields!');
  }
}

async function displayExpenses() {
  document.getElementById('expenseList').innerHTML = ''; // Clear list before displaying

  try {
    const response = await fetch('/expense/1'); // Replace `1` with dynamic user authentication later

    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }

    const expenses = await response.json();
    expenses.forEach((expense) => displayExpense(expense));
  } catch (error) {
    console.error('Error fetching expenses:', error);
    alert('Error fetching expenses. Please try again.');
  }
}

function displayExpense(expense) {
  const expenseList = document.getElementById('expenseList');
  const expenseItem = document.createElement('div');
  expenseItem.className = 'alert alert-secondary d-flex justify-content-between align-items-center';
  expenseItem.innerHTML = `
    <span>${expense.category}: ${expense.description} - ₹${expense.amount}</span>
    <div>
      <button class="btn btn-sm btn-warning mr-2" onclick="editExpense(${expense.id})">Edit</button>
      <button class="btn btn-sm btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>
    </div>
  `;
  expenseItem.dataset.id = expense.id;
  expenseList.appendChild(expenseItem);
}

async function deleteExpense(id) {
  try {
    const response = await fetch(`/expense/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete expense');
    }

    displayExpenses(); // Refresh the list
  } catch (error) {
    console.error('Error deleting expense:', error);
    alert('Error deleting expense. Please try again.');
  }
}

function editExpense(id) {
  const expenseList = document.getElementById('expenseList');
  const expenseItems = Array.from(expenseList.children);

  const expense = expenseItems.find(item => item.dataset.id == id);
  const [category, description, amount] = expense.querySelector('span').innerText.split(/:|-/);

  document.getElementById('expenseAmount').value = amount.trim().slice(1); // Remove the '₹' symbol
  document.getElementById('expenseDescription').value = description.trim();
  document.getElementById('expenseCategory').value = category.trim();

  // Change button to Update Expense
  document.getElementById('addExpense').innerText = 'Update Expense';
  document.getElementById('addExpense').onclick = function () {
    updateExpense(id);
  };
}

async function updateExpense(id) {
  const amount = document.getElementById('expenseAmount').value;
  const description = document.getElementById('expenseDescription').value;
  const category = document.getElementById('expenseCategory').value;

  if (amount && description && category) {
    const updatedExpense = { amount, description, category };

    try {
      const response = await fetch(`/expense/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedExpense),
      });

      if (!response.ok) {
        throw new Error('Failed to update expense');
      }

      displayExpenses();
      clearFields();

      document.getElementById('addExpense').innerText = 'Add Expense';
      document.getElementById('addExpense').onclick = addExpense;
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Error updating expense. Please try again.');
    }
  } else {
    alert('Please fill all fields!');
  }
}

function clearFields() {
  document.getElementById('expenseAmount').value = '';
  document.getElementById('expenseDescription').value = '';
  document.getElementById('expenseCategory').value = '';
}
