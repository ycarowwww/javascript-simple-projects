class Calculator {
    constructor(inputElement, historyElement) {
        this.inputElement = inputElement;
        this.historyElement = historyElement;
        this.currentOperation = "";
        this.currentOperand = "";
        this.previousOperation = "";
        this.previousOperand = "";
        this.lastOperand = "";
        this.cleanNextMove = false;
    }

    appendNumber(number) {
        if (this.cleanNextMove) this.currentOperand = "";
        if (number === "0" && this.currentOperand === "0") return;
        if (number === ".") {
            if (this.currentOperand.includes(".") || this.currentOperand.length === 0) return;
        } else if (this.currentOperand === "0") {
            this.currentOperand = number;
            return;
        }

        this.currentOperand += number;
        this.updateDisplay();
        this.cleanNextMove = false;
    }

    toggleSignal() {
        if (this.currentOperand) {
            this.currentOperand = (this.currentOperand * -1).toString();
            this.updateDisplay();
        }
    }

    clearEntry() {
        this.currentOperand = "";
        this.updateDisplay();
        this.cleanNextMove = false;
    }

    clearAll() {
        this.currentOperation = "";
        this.currentOperand = "";
        this.previousOperation = "";
        this.previousOperand = "";
        this.lastOperand = "";
        this.updateDisplay();
        this.updateHistory();
        this.cleanNextMove = false;
    }

    clearLastCharacter() {
        this.currentOperand = this.currentOperand.slice(0, -1);
        if (this.currentOperand === "-") this.currentOperand = "";
        this.updateDisplay();
        this.cleanNextMove = false;
    }

    chooseOperation(operation) {
        if (isNaN(this.currentOperand)) return;
        if (this.previousOperand !== "" && !this.cleanNextMove) this.compute();
        
        this.currentOperation = operation;
        this.previousOperand = this.currentOperand;
        this.updateDisplay();
        this.updateHistory(this.previousOperand, "", this.currentOperation);
        this.cleanNextMove = true;
    }

    compute() {
        let computation, prev, current;
        if (this.previousOperand) {
            prev = parseFloat(this.previousOperand);
            current = parseFloat(this.currentOperand);
        } else {
            prev = parseFloat(this.currentOperand);
            current = parseFloat(this.lastOperand);
        }
        if (!this.currentOperation) this.currentOperation = this.previousOperation;

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.currentOperation) {
            case "+":
                computation = prev + current;
                break;
            case "-":
                computation = prev - current;
                break;
            case "×":
                computation = prev * current;
                break;
            case "÷":
                computation = prev / current;
                break;
            default:
                return;
        }

        this.updateHistory(prev, current, this.currentOperation);
        this.currentOperand = computation.toString();
        this.previousOperation = this.currentOperation;
        this.currentOperation = "";
        this.lastOperand = current;
        this.previousOperand = "";
        this.updateDisplay();
        this.cleanNextMove = true;
    }

    updateDisplay() {
        this.inputElement.value = this.currentOperand;
    }

    updateHistory(prev = "", current = "", operation = "") {
        if (current) {
            this.historyElement.value = `${prev} ${operation} ${current} =`;
        } else if (prev) {
            this.historyElement.value = `${prev} ${operation}`;
        } else {
            this.historyElement.value = "";
        }
    }
}

const themeSwitcherButton = document.getElementById("theme-switcher");
const buttons = document.getElementsByClassName("buttons")[0];
const historyElement = document.getElementById("operation-history");
const currentNumber = document.getElementById("current-number");
const calculator = new Calculator(currentNumber, historyElement);

themeSwitcherButton.addEventListener("click", switchTheme);
buttons.addEventListener("click", (event) => { buttonSelector(event) });

function switchTheme() {
    document.body.classList.toggle("dark-theme");
}

function buttonSelector(event) {
    const button = event.target.closest("button");

    if (!button) return; // Check if the click was on a button

    if (button.classList.contains("number-buttons")) {
        calculator.appendNumber(button.innerText);
    } else if (button.id === "toggle-signal-button") {
        calculator.toggleSignal();
    } else if (button.classList.contains("clear-buttons")) {
        switch (button.dataset.clearType) {
            case "ce":
                calculator.clearEntry();
                break;
            case "c":
                calculator.clearAll();
                break;
            case "backspace":
                calculator.clearLastCharacter();
                break;
        }
    } else {
        if (button.innerText === "=") calculator.compute();
        else calculator.chooseOperation(button.innerText);
    }
}
