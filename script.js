// link all html elements so that we can manipulate the dom
const previousDisplay = document.getElementById('previous-display');
const currentDisplay = document.getElementById('current-display');
const tempDisplay = document.getElementById('temp-display');
const clearBtn = document.getElementById('clear-btn')
const deleteBtn = document.getElementById('delete-btn')
const pointBtn = document.getElementById('point-btn')
const equalsBtn = document.getElementById('equals-btn')
const percentBtn = document.getElementById('percent-btn')
const plusMinusBtn = document.getElementById('plus-minus-btn')
const numbersBtn = document.querySelectorAll('[data-number]')
const operatorBtn = document.querySelectorAll('[data-operator]')

let previousDisplayNum = '';
let currentDisplayNum = '';
let result = null;
let lastOperation = '';
let haveDot = false;

//DOM manipulation section. This will run the function that we want after action
clearBtn.addEventListener('click', allClear)
deleteBtn.addEventListener('click', deleteNumber)
equalsBtn.addEventListener('click', evaluate)
percentBtn.addEventListener('click', getPercents)
plusMinusBtn.addEventListener('click', getPlusMinus)
numbersBtn.forEach((button) => button.addEventListener('click', () => appendNumber(button.textContent)))
operatorBtn.forEach((button) => button.addEventListener('click', () => setOperation(button.textContent)))
window.addEventListener('keydown', handleKeyboardInput)

//function to append number
function appendNumber(number) {
    if (currentDisplayNum === result) {
        allClear()
    }
    if (currentDisplayNum.length === 10) return
    if (number === '.' && !haveDot) {
        haveDot = true
    } else if (number === '.' && haveDot) {
        return
    }
    currentDisplayNum += number;
    currentDisplay.textContent = currentDisplayNum;
}

function getPercents() {
    if ((currentDisplay.textContent === '0' && currentDisplayNum === '')) return
    if (currentDisplayNum === '') return
    let newNumber = parseFloat(currentDisplay.textContent) / 100;
    currentDisplay.textContent = newNumber
    currentDisplayNum = currentDisplay.textContent;
}

function getPlusMinus() {
    if ((currentDisplay.textContent === '0' && currentDisplayNum === '')) return
    if (currentDisplayNum === '') return
    let newNumber = parseFloat(currentDisplayNum) * -1;
    currentDisplay.textContent = newNumber
    currentDisplayNum = currentDisplay.textContent;
}

// function set operation
function setOperation(operator) {
    if (currentDisplayNum === '') return
    haveDot = false
    operationName = operator
    if (currentDisplayNum && previousDisplayNum && lastOperation) {
        operate()
    } else {
        result = parseFloat(currentDisplayNum);
    }
    clearVar(operationName);
    lastOperation = operationName;
    currentDisplay.textContent = ''
}

function clearVar(operation) {
    previousDisplayNum += ` ${currentDisplayNum} ${operation}`
    previousDisplay.textContent = previousDisplayNum;
    currentDisplay.textContent = '';
    currentDisplayNum = ''
    currentDisplay.textContent = result;
}

// function to evaluate
function operate() {
    if (lastOperation === '+') {
        result = parseFloat(result) + parseFloat(currentDisplayNum);
    } else if (lastOperation === '-') {
        result = parseFloat(result) - parseFloat(currentDisplayNum);
    } else if (lastOperation === '×') {
        result = parseFloat(result) * parseFloat(currentDisplayNum);
    } else if (lastOperation === '÷') {
        result = parseFloat(result) / parseFloat(currentDisplayNum);
    }
}

function evaluate() {
    if (!previousDisplayNum || !currentDisplayNum) return
    haveDot = false;
    operate();
    lastOperation = '='
    clearVar(lastOperation);
    currentDisplay.textContent = result;
    currentDisplayNum = result;
    previousDisplayNum = '';
}

function deleteNumber() {
    if ((currentDisplay.textContent === '0' && currentDisplayNum === '') || currentDisplayNum === result) return

    currentDisplay.textContent = currentDisplay.textContent.toString().slice(0, -1)
    currentDisplayNum = currentDisplay.textContent;
}

// function to clear display
function allClear() {
    previousDisplay.textContent = '';
    currentDisplay.textContent = '0';
    previousDisplayNum = '';
    currentDisplayNum = '';
    result = '';
}

function handleKeyboardInput(e) {
    if ((e.key >= 0 && e.key <= 9) || e.key === '.') appendNumber(e.key)
    if (e.key === '=') evaluate()
    if (e.key === 'Backspace') deleteNumber()
    if (e.key === '%') getPercents()
    if (e.key === '_') getPlusMinus()
    if (e.key === 'Escape') allClear()
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/')
        setOperation(convertOperator(e.key))
}

function convertOperator(keyboardOperator) {
    if (keyboardOperator === '/') return '÷'
    if (keyboardOperator === '*') return '×'
    if (keyboardOperator === '-') return '-'
    if (keyboardOperator === '+') return '+'
}