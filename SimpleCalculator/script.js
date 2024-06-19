document.addEventListener("DOMContentLoaded", () => {
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
    let lastSignal = null;
    let lastNumberForOperation = NaN;

    for (let i = 0; i < numbersButtons.length; i++) {
        numbersButtons[i].addEventListener("click", () => {
            numberInput.value += numbersButtons[i].innerHTML;
        });
    }

    dotButton.addEventListener("click", () => {
        if (!numberInput.value.includes('.') && numberInput.value.length > 0) {
            numberInput.value += '.';
        }
    });

    pomButton.addEventListener("click", () => {
        numberInput.value = parseFloat(numberInput.value) * -1;
    });

    invButton.addEventListener("click", () => {
        numberInput.value = 1 / parseFloat(numberInput.value);
    });

    xsqButton.addEventListener("click", () => {
        numberInput.value = parseFloat(numberInput.value) ** 2;
    });

    sqrtButton.addEventListener("click", () => {
        numberInput.value = Math.sqrt(parseFloat(numberInput.value));
    });

    percButton.addEventListener("click", () => {
        numberInput.value = parseFloat(numberInput.value) / 100;
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
    });

    clButton.addEventListener("click", () => {
        numberInput.value = numberInput.value.slice(0, -1);
    });

    pluButton.addEventListener("click", () => { operationFunctions("plu"); });
    minButton.addEventListener("click", () => { operationFunctions("min"); });
    mulButton.addEventListener("click", () => { operationFunctions("mul"); });
    divButton.addEventListener("click", () => { operationFunctions("div"); });
    equButton.addEventListener("click", () => {
        if (!isNaN(numberForOperation)) {
            lastNumberForOperation = parseFloat(numberInput.value);
            calculate();
            signal = null;
            numberForOperation = NaN;
        } else if (lastSignal && !isNaN(lastNumberForOperation)) {
            signal = lastSignal;
            numberForOperation = lastNumberForOperation;
            calculate();
            signal = null;
            numberForOperation = NaN;
        }
    });

    function operationFunctions(operationSignal) {
        if (!numberInput.value) {
            alert("Enter some Number to Calculate!");
            return;
        }

        if (isNaN(numberForOperation)) {
            numberForOperation = parseFloat(numberInput.value);
        } else {
            if (!signal) {
                signal = operationSignal;
            }
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
});