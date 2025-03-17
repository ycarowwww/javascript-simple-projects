class Calculator {
    constructor(inputElement, historyElement) {
        this.inputElement = inputElement;
        this.historyElement = historyElement;
        this.clearAll(); // Using this method to create the properties.
    }

    appendNumber(number) {
        if (this.cleanNextMove) this.currentOperand = "0"; // If an operation was used previously, clear the current input number and enter the new number.
        if (number === ".") { // If the number already includes a "." or doesn't exist (length 0), then do nothing.
            if (this.currentOperand.includes(".") || this.currentOperand.length === 0) return;
        } else if (this.currentOperand === "0") { // If the current input number is just a "0", then just replace it (and the "number" isn't a ".").
            this.currentOperand = number;
            this.updateDisplay();
            this.cleanNextMove = false;
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
        this.cleanNextMove = false; // If a number is entered after using an operation, the number that is there will be automatically deleted.
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
            prev = Number(this.previousOperand);
            current = Number(this.currentOperand);
        } else {
            prev = Number(this.currentOperand);
            current = Number(this.lastOperand);
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

        if (!isFinite(computation)) { // If the result is some "error", like "NaN" or "Infinity", then just clear all and display an Error message.
            this.clearAll();
            this.inputElement.value = "Error";
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
        if (current !== "") {
            this.historyElement.value = `${prev} ${operation} ${current} =`;
        } else if (prev !== "") {
            this.historyElement.value = `${prev} ${operation}`;
        } else {
            this.historyElement.value = "";
        }
    }
}

const themeSwitcherButton = document.getElementById("theme-switcher");
const buttons = document.getElementById("buttons");
const historyElement = document.getElementById("operation-history");
const currentNumber = document.getElementById("current-number");
const calculator = new Calculator(currentNumber, historyElement);

themeSwitcherButton.addEventListener("click", switchTheme);
buttons.addEventListener("click", buttonSelector);

function switchTheme() {
    document.body.classList.toggle("dark-theme");
    saveThemeOnStorage(document.body.classList.contains("dark-theme"));
}

function saveThemeOnStorage(isDarkTheme) {
    localStorage.setItem("theme", isDarkTheme ? "dark" : "white");
}

function loadSavedTheme() {
    const isDarkTheme = localStorage.getItem("theme");

    if (isDarkTheme === "dark") {
        document.body.classList.add("dark-theme");
    } else if (isDarkTheme === "white") {
        document.body.classList.remove("dark-theme");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) { // Check the user's default color theme
        document.body.classList.add("dark-theme");
    }
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

loadSavedTheme();
