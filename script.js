const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const incomeText = document.getElementById("income-text");
const expenseText = document.getElementById("expense-text"); 

// Retrieve transactions from localStorage and parse it into an array
const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Function to handle adding a new transaction when a form is submitted
function addTransaction(e) {
    e.preventDefault(); // Prevent the default form submission behavior
    
    // Check if the income text input is not empty
    if (incomeText.value.trim() !== "") {
        // Create a new income transaction object with a generated ID, 'Income' text, and amount from input
        const incomeTransaction = {
            id: generateID(),
            text: 'Income',
            amount: +incomeText.value 
        };

        transactions.push(incomeTransaction); // Add the new transaction to the transactions array
        addTransactionDOM(incomeTransaction); // Display the new transaction in the DOM
    }
    
    // Check if the expense text input is not empty
    if (expenseText.value.trim() !== "") {
        const expenseTransaction = {
            id: generateID(),
            text: 'Expense',
            amount: -expenseText.value 
        };

        transactions.push(expenseTransaction); // Add the new transaction to the transactions array
        addTransactionDOM(expenseTransaction); // Display the new transaction in the DOM
    }
    updateValues();
    updateLocalStorage();

    incomeText.value = '';
    expenseText.value = '';
    text.value = '';
}

// Function to generate a unique ID for each transaction
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Function to add a new transaction to the DOM
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";

    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    item.innerHTML =
        `${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
         <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>`; 

    list.appendChild(item);
}

// Function to update the balance, income, and expense amounts
function updateValues() {
    const amounts = transactions.map((transaction) => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
        .filter((item) => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = amounts
        .filter((item) => item < 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${Math.abs(expense)}`;
}

// Function to remove a transaction
function removeTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);

    updateLocalStorage();
    init();
}

// Function to update localStorage
function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Function to initialize the app
function init() {
    list.innerHTML = "";

    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();

// Add event listener for form submit
form.addEventListener("submit", addTransaction);
