const balance = document.getElementById('balance')
const money_plus = document.getElementById('money-plus')
const money_minus = document.getElementById('money-minus')
const list = document.getElementById('list')
const form = document.getElementById('form')
const text = document.getElementById('text')
const amount = document.getElementById('amount')

localStorage.setItem('title', 'exprense')
const appTitle = localStorage.getItem('title')
console.log('App title from localStorage:', appTitle)

const titleElement = document.getElementById('app-title')
if (titleElement) {
  titleElement.innerText = appTitle;
}

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please enter a description and amount')
    return;
  }

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value
  };

  transactions.push(transaction)
  addTransactionDOM(transaction)
  updateValues()
  updateLocalStorage()

  text.value = ''
  amount.value = ''
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+'
  const item = document.createElement('li')

  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus')
  item.innerHTML = `
    ${transaction.text} <span>${sign}₹${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">❌</button>
  `;

  list.appendChild(item)
}

function updateValues() {
  const amounts = transactions.map(txn => txn.amount)

  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2)
  const income = amounts
    .filter(val => val > 0)
    .reduce((acc, val) => acc + val, 0)
    .toFixed(2);
  const expense = (
    amounts
      .filter(val => val < 0)
      .reduce((acc, val) => acc + val, 0) * -1
  ).toFixed(2);

  balance.innerText = `₹${total}`
  money_plus.innerText = `₹${income}`
  money_minus.innerText = `₹${expense}`
}

function removeTransaction(id) {
  transactions = transactions.filter(txn => txn.id !== id)
  updateLocalStorage()
  init()
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

function init() {
  list.innerHTML = ''
  transactions.forEach(addTransactionDOM)
  updateValues()
}
init()
form.addEventListener('submit', addTransaction)