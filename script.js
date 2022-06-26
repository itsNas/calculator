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

// set the default variables
let previousDisplayNum = '';
let currentDisplayNum = '';
let result = null;
let lastOperation = '';
let haveDot = false;

//DOM manipulation section. This will run the function that we want after button "click"
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
    if (currentDisplayNum === result) allClear() // this will prevent from number to be  added to the final result and start new calculation seamlessly after getting the final result
    if (currentDisplayNum.length === 10) return //only allow 10 digits to be added
    if (number === '.' && !haveDot) { // only allow one  '.' to be added
        haveDot = true
    } else if (number === '.' && haveDot) {
        return
    }
    currentDisplayNum += number;
    currentDisplay.textContent = currentDisplayNum;
}

// function to set  and print percent values
function getPercents() {
    if (currentDisplayNum === '') return //prevent user from trying to press '%' before number input
    let newNumber = parseFloat(currentDisplay.textContent) / 100;
    currentDisplay.textContent = newNumber
    currentDisplayNum = currentDisplay.textContent;
}

// function to set  and print negative/positive values
function getPlusMinus() {
    if (currentDisplayNum === '') return //prevent user from trying to press '+/-' button before number input
    let newNumber = parseFloat(currentDisplayNum) * -1;
    currentDisplay.textContent = newNumber
    currentDisplayNum = currentDisplay.textContent;
}

// function set operation
function setOperation(operator) {
    if (currentDisplayNum === '' || currentDisplayNum === '.') return //prevent user from trying to press operation button without valid number input
    haveDot = false //allow user to press '.' button again after pressing operation button 
    operationName = operator
    if (currentDisplayNum && previousDisplayNum && lastOperation) {
        operate()
    } else {
        result = parseFloat(currentDisplayNum); // calculate the result when there are currentDisplayNum and previousDisplayNum and lastOperation without need to press the '=' button
    }
    clearVar(operationName);
    lastOperation = operationName;
    currentDisplay.textContent = '' // clear the current display after pressing the operation button
}

// print the previous operand on previous display and display the result on current display
function clearVar(operation) {
    previousDisplayNum += ` ${currentDisplayNum} ${operation}`
    previousDisplay.textContent = previousDisplayNum;
    currentDisplay.textContent = '';
    currentDisplayNum = ''
    currentDisplay.textContent = result;
}

// function to calculate the result
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

// this function will run after user  press the '=' button and show the result with '=' on previous display
function evaluate() {
    if (!previousDisplayNum || !currentDisplayNum || currentDisplayNum === '.') return //prevent user from trying to press the '=' button without valid number
    haveDot = false; //allow user to press the '.' button after 
    operate();
    lastOperation = '='
    clearVar(lastOperation);
    currentDisplay.textContent = result;
    currentDisplayNum = result;
    previousDisplayNum = '';
}

// delete the number string
function deleteNumber() {
    if ((currentDisplay.textContent === '0' && currentDisplayNum === '') || currentDisplayNum === result) return //prevent user from pressing 'del' btn with this condition
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
    haveDot = false
}

// allow keyboard input
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