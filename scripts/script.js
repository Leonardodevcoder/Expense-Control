const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')


const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    transactions = transactions.filter(transaction =>
        transaction.ID !== ID)
    updateLocalStorage()
    init()
}

const addTransactionIntoDOM = ({ amount, name, ID }) => {
    const operator = amount < 0 ? '-' : '+'
    const CSSClass = amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(amount)
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `
    ${name}
     <span>${operator} R$ ${amountWithoutOperator} </span>
     <button class="delete-btn" onClick ="removeTransaction(${ID})">x</button>
    `

    transactionsUl.append(li)
}

const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
        .filter(value => value < 0)
        .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)

const getIncome = transactionsAmounts => transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getTotal = transactionsAmounts => transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)



const updateBalanceValues = () => {
    const transactionsAmounts = transactions.map(({ amount }) => amount)

    const income = getIncome(transactionsAmounts)
    const expense = getExpenses(transactionsAmounts)
    const total = getTotal(transactionsAmounts)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(math.random() * 1000)

const addTOTransactionsArray = (transactionName, transactionsAmounts) => {
    transactions.push({

        id: generateID,
        name: transactionName,
        amount: Number(transactionsAmounts)
    })
}

const cleanInputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

const handleFormSubmit = event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionsAmounts = inputTransactionAmount.value.trim()
    const isSomeIpuntEmpty = transactionName === '' || transactionsAmounts === ''

    if (isSomeIpuntEmpty) {
        alert('Por favor, preencha tanto o nome quanto o valor da transação ')
        return
    }
    addTOTransactionsArray(transactionName, transactionsAmounts)
    init()
    updateLocalStorage()
    cleanInputs()
}

form.addEventListener('submit', handleFormSubmit)