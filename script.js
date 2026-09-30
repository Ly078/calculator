function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "Sigh....You know you can't divide by zero.";
    }
    return a / b;
}

function operate(operator, a, b) {
    switch (operator) {
        case "add":
            return add(a, b);
        case "subtract":
            return subtract(a, b);
        case "multiply":
            return multiply(a, b);
        case "divide":
            return divide(a, b);
        default:
            return b;
    }
}

let currentInput = "0";   
let previousValue = null;
let operator = null;
let shouldResetDisplay = false;

const display = document.querySelector("#display");

function updateDisplay(value) {
    display.textContent = value;
}

function formatNumber(num) {
    if (typeof num === "string") return num; 
    if (!isFinite(num)) return "Error";

    let rounded = Math.round((num + Number.EPSILON) * 1e9) / 1e9;
    let str = rounded.toString();

    if (str.replace("-", "").replace(".", "").length > 11) {
        str = parseFloat(rounded.toPrecision(10)).toString();
    }
    if (str.length > 14) {
        str = rounded.toExponential(5);
    }
    return str;
}

function setActiveOperatorButton(action) {
    document.querySelectorAll(".operator").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.action === action);
    });
}

function inputDigit(digit) {
    if (shouldResetDisplay) {
        currentInput = digit;
        shouldResetDisplay = false;
    } else {
        currentInput = currentInput === "0" ? digit : currentInput + digit;
    }
    updateDisplay(currentInput);
}

function inputDecimal() {
    if (shouldResetDisplay) {
        currentInput = "0.";
        shouldResetDisplay = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }
    updateDisplay(currentInput);
}

function backspace() {
    if (shouldResetDisplay) return;
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
    updateDisplay(currentInput);
}

function clearAll() {
    currentInput = "0";
    previousValue = null;
    operator = null;
    shouldResetDisplay = false;
    setActiveOperatorButton(null);
    updateDisplay(currentInput);
}

function showError(message) {
    updateDisplay(message);
    previousValue = null;
    operator = null;
    shouldResetDisplay = true;
    setActiveOperatorButton(null);
}

function chooseOperator(action) {
    const inputValue = parseFloat(currentInput);

    if (operator !== null && !shouldResetDisplay) {
        
        const result = operate(operator, previousValue, inputValue);
        if (typeof result === "string") {
            showError(result);
            return;
        }
        previousValue = result;
        updateDisplay(formatNumber(result));
    } else if (previousValue === null) {
        
        previousValue = inputValue;
    }
    
    operator = action;
    shouldResetDisplay = true;
    setActiveOperatorButton(action);
}

function equals() {
    if (operator === null || shouldResetDisplay) {
        return; 
    }

    const inputValue = parseFloat(currentInput);
    const result = operate(operator, previousValue, inputValue);

    if (typeof result === "string") {
        showError(result);
        return;
    }

    updateDisplay(formatNumber(result));
    currentInput = formatNumber(result);
    previousValue = null;
    operator = null;
    shouldResetDisplay = true;
    setActiveOperatorButton(null);
}

document.querySelectorAll(".digit").forEach((btn) => {
    btn.addEventListener("click", () => {
        if (btn.dataset.action === "decimal") {
            inputDecimal();
        } else {
            inputDigit(btn.dataset.digit);
        }
    });
});

document.querySelectorAll(".operator").forEach((btn) => {
    btn.addEventListener("click", () => chooseOperator(btn.dataset.action));
});

document.querySelector(".equals").addEventListener("click", equals);
document.querySelector(".clear").addEventListener("click", clearAll);
document.querySelector(".backspace").addEventListener("click", backspace);
