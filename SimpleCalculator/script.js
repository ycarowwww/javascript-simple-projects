let numberForOperation = NaN;
let signal = null;
let numberInput = document.getElementById("number");
const numbersButtons = document.querySelectorAll('button[id$="buttonnb"]');
const dotButton = document.getElementById("dotbutton");
const pomButton = document.getElementById("pombutton");
const invButton = document.getElementById("invbutton");
const xsqButton = document.getElementById("xsqbutton");
const sqrtButton = document.getElementById("sqrtbutton");
const percButton = document.getElementById("percbutton");
const ceButton = document.getElementById("cebutton");
const cButton = document.getElementById("cbutton");
const clButton = document.getElementById("clbutton");
const divButton = document.getElementById("divbutton");
const mulButton = document.getElementById("mulbutton");
const minButton = document.getElementById("minbutton");
const pluButton = document.getElementById("plubutton");
const equButton = document.getElementById("equbutton");
let previousOperation = document.getElementById("previous-operation"); 
let lastSignal = null;
let lastNumberForOperation = NaN;
let result = false;
let signals = new Map();
signals.set("plu", "+");
signals.set("min", "-");
signals.set("mul", "&#x00D7;");
signals.set("div", "&#x00F7;");

for (let i = 0; i < numbersButtons.length; i++) {
    numbersButtons[i].addEventListener("click", () => {
        if (result) {
            numberInput.value = "";
            result = false;
        }
        numberInput.value += numbersButtons[i].innerHTML;
    });
}

dotButton.addEventListener("click", () => {
    if (!numberInput.value.includes('.') && numberInput.value.length > 0) {
        numberInput.value += '.';
    }
});

pomButton.addEventListener("click", () => {
    previousOperation.innerHTML = `${numberInput.value} ${signals.get("mul")} -1 =`;
    numberInput.value = parseFloat(numberInput.value) * -1;
});

invButton.addEventListener("click", () => {
    previousOperation.innerHTML = `1 ${signals.get("div")} ${numberInput.value} =`;
    numberInput.value = 1 / parseFloat(numberInput.value);
    signal = null;
});

xsqButton.addEventListener("click", () => {
    previousOperation.innerHTML = `${numberInput.value}² =`;
    numberInput.value = parseFloat(numberInput.value) ** 2;
    signal = null;
});

sqrtButton.addEventListener("click", () => {
    previousOperation.innerHTML = `√${numberInput.value} =`;
    numberInput.value = Math.sqrt(parseFloat(numberInput.value));
    signal = null;
});

percButton.addEventListener("click", () => {
    previousOperation.innerHTML = `${numberInput.value} ${signals.get("div")} 100 =`;
    numberInput.value = parseFloat(numberInput.value) / 100;
    signal = null;
});

ceButton.addEventListener("click", () => {
    numberInput.value = "";
});

cButton.addEventListener("click", () => {
    numberInput.value = "";
    numberForOperation = NaN;
    lastNumberForOperation = NaN;
    signal = null;
    lastSignal = null;
    previousOperation.innerHTML = "";
});

clButton.addEventListener("click", () => {
    numberInput.value = numberInput.value.slice(0, -1);
});

pluButton.addEventListener("click", () => { operationFunctions("plu"); });
minButton.addEventListener("click", () => { operationFunctions("min"); });
mulButton.addEventListener("click", () => { operationFunctions("mul"); });
divButton.addEventListener("click", () => { operationFunctions("div"); });
equButton.addEventListener("click", () => {
    result = true;
    if (!isNaN(numberForOperation)) {
        lastNumberForOperation = parseFloat(numberInput.value);
        previousOperation.innerHTML = `${numberForOperation} ${signals.get(signal)} ${numberInput.value} =`;
        calculate();
        signal = null;
        numberForOperation = NaN;
    } else if (lastSignal && !isNaN(lastNumberForOperation)) {
        signal = lastSignal;
        numberForOperation = lastNumberForOperation;
        previousOperation.innerHTML = `${numberForOperation} ${signals.get(signal)} ${numberInput.value} =`;
        calculate();
        signal = null;
        numberForOperation = NaN;
    }
});

function operationFunctions(operationSignal) {
    result = true;
    if (!numberInput.value) {
        alert("Enter some Number to Calculate!");
        return;
    }

    if (isNaN(numberForOperation)) {
        numberForOperation = parseFloat(numberInput.value);
        previousOperation.innerHTML = `${numberForOperation}`;
    } else {
        if (!signal) {
            signal = operationSignal;
        }
        previousOperation.innerHTML = `${numberForOperation} ${signals.get(signal)} ${numberInput.value} =`;
        calculate();
    }
    signal = operationSignal;
    lastSignal = operationSignal;
}

function calculate() {
    switch (signal) {
        case "plu":
            numberInput.value = numberForOperation + parseFloat(numberInput.value);
            break;
        case "min":
            numberInput.value = numberForOperation - parseFloat(numberInput.value);
            break;
        case "mul":
            numberInput.value = numberForOperation * parseFloat(numberInput.value);
            break;
        case "div":
            numberInput.value = numberForOperation / parseFloat(numberInput.value);
            break;
        default:
            break;
    }
    numberForOperation = parseFloat(numberInput.value);
    signal = null;
}