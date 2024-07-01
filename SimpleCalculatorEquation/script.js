document.addEventListener("DOMContentLoaded", () => {
    const calculatorInput = document.getElementById("equationinput");
    const buttonClear = document.querySelector(".buttons--clear");
    const buttonParenthesis = document.querySelector(".buttons--parenthesis");
    const buttonPercentage = document.querySelector(".buttons--percentage");
    const buttonsOperations = document.querySelectorAll(".buttons button.buttons--operations:not(.buttons--parenthesis, .buttons--percent)");
    const buttonPlusOrMinus = document.querySelector(".buttons--plusorminus");
    const buttonsNumbers = document.querySelectorAll(".buttons--numbers");
    const buttonDot = document.querySelector(".buttons--dot");
    const buttonEquals = document.querySelector(".buttons--equals");

    buttonClear.addEventListener("click", () => {
        calculatorInput.value = "";
    });

    buttonParenthesis.addEventListener("click", () => {
        if (["+", "-", "×", "÷", "("].includes(calculatorInput.value.slice(-1))) {
            calculatorInput.value += "(";
        } else if (calculatorInput.value.includes("(") && (calculatorInput.value.match(/\(/g) || []).length > (calculatorInput.value.match(/\)/g) || []).length) {
            calculatorInput.value += ")";
        } else if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "%", ")"].includes(calculatorInput.value.slice(-1))) {
            calculatorInput.value += "×(";
        } else {
            calculatorInput.value += "(";
        }
    });

    buttonPercentage.addEventListener("click", () => {
        if (["+", "-", "×", "÷"].includes(calculatorInput.value.slice(-1))) {
            calculatorInput.value = calculatorInput.value.slice(0, -1);
        }
        calculatorInput.value += "%";
    });

    for (let i = 0; i < buttonsOperations.length; i++) {
        buttonsOperations[i].addEventListener("click", () => {
            if (["+", "-", "×", "÷"].includes(calculatorInput.value.slice(-1))) {
                calculatorInput.value = calculatorInput.value.slice(0, -1);
            }
            calculatorInput.value += buttonsOperations[i].innerHTML;
        });
    }

    buttonPlusOrMinus.addEventListener("click", () => {
        calculatorInput.value += "×-1";
    });

    for (let i = 0; i < buttonsNumbers.length; i++) {
        buttonsNumbers[i].addEventListener("click", () => {
            calculatorInput.value += buttonsNumbers[i].innerHTML;
        });
    }

    buttonDot.addEventListener("click", () => {
        if (calculatorInput.value.split(/\+|\-|\×|\÷/).at(-1).includes(".")) return;
        
        if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(calculatorInput.value.slice(-1))) {
            calculatorInput.value += ".";
        }
    });

    buttonEquals.addEventListener("click", () => {
        try {
            calculatorInput.value = eval(calculatorInput.value.replaceAll("%", "/100").replaceAll("÷", "/").replaceAll("×", "*"));
        } catch (error) {
            calculatorInput.value = "Error";
        }
    });
});