document.addEventListener("DOMContentLoaded", () => {
    const calculatorInput = document.getElementById("equationinput");
    const buttonClear = document.querySelector(".buttons--clear");
    const buttonParentheses = document.querySelector(".buttons--parentheses");
    const buttonPercentage = document.querySelector(".buttons--percentage");
    const buttonsOperations = document.querySelectorAll(".buttons button.buttons--operations:not(.buttons--parentheses, .buttons--percentage)");
    const buttonPlusOrMinus = document.querySelector(".buttons--plusorminus");
    const buttonsNumbers = document.querySelectorAll(".buttons--numbers");
    const buttonDot = document.querySelector(".buttons--dot");
    const buttonEquals = document.querySelector(".buttons--equals");

    buttonClear.addEventListener("click", () => {
        calculatorInput.value = "";
    });

    buttonParentheses.addEventListener("click", () => {
        errorInCalculation();
        if (["+", "-", "×", "÷", "("].includes(calculatorInput.value.slice(-1))) {
            calculatorInput.value += "(";
        } else if ((calculatorInput.value.match(/\(/g) || []).length > (calculatorInput.value.match(/\)/g) || []).length) {
            calculatorInput.value += ")";
        } else if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "%", ")"].includes(calculatorInput.value.slice(-1))) {
            calculatorInput.value += "×(";
        } else {
            calculatorInput.value += "(";
        }
    });

    buttonPercentage.addEventListener("click", () => {
        errorInCalculation();
        if (["+", "-", "×", "÷"].includes(calculatorInput.value.slice(-1)) && (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "%", ")"].includes(calculatorInput.value.slice(-2, -1)))) {
            calculatorInput.value = calculatorInput.value.slice(0, -1);
        }
        if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "%", ")"].includes(calculatorInput.value.slice(-1))) {
            calculatorInput.value += "%";
        }
    });

    for (let i = 0; i < buttonsOperations.length; i++) {
        buttonsOperations[i].addEventListener("click", () => {
            errorInCalculation();
            if (calculatorInput.value.slice(-1) === "" || ((calculatorInput.value.slice(-1) === "(" || (calculatorInput.value.slice(-2, -1) === "(")) && !["+", "-"].includes(buttonsOperations[i].innerHTML))) return;
            else if (["+", "-", "×", "÷"].includes(calculatorInput.value.slice(-1))) {
                calculatorInput.value = calculatorInput.value.slice(0, -1);
            }
            calculatorInput.value += buttonsOperations[i].innerHTML;
        });
    }

    buttonPlusOrMinus.addEventListener("click", () => {
        errorInCalculation();
        const number = calculatorInput.value.split(/\+|\-|\×|\÷/).at(-1).replaceAll("(", "");
        const numberStartIndex = calculatorInput.value.length - number.length;

        if ([")", "%"].includes(calculatorInput.value.slice(-1))) {
            calculatorInput.value += "×(-";
        } else {
            if (calculatorInput.value.slice(numberStartIndex - 2, numberStartIndex) === "(-") {
                calculatorInput.value = calculatorInput.value.slice(0, numberStartIndex - 2) + calculatorInput.value.slice(numberStartIndex);
            } else {
                calculatorInput.value = calculatorInput.value.slice(0, numberStartIndex) + "(-" + calculatorInput.value.slice(numberStartIndex);
            }
        }
    });

    for (let i = 0; i < buttonsNumbers.length; i++) {
        buttonsNumbers[i].addEventListener("click", () => {
            errorInCalculation();
            if ([")", "%"].includes(calculatorInput.value.slice(-1))) {
                calculatorInput.value += "×";
            }
            
            calculatorInput.value += buttonsNumbers[i].innerHTML;
        });
    }

    buttonDot.addEventListener("click", () => {
        errorInCalculation();
        if (calculatorInput.value.split(/\+|\-|\×|\÷/).at(-1).includes(".")) return;
        
        if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(calculatorInput.value.slice(-1))) {
            calculatorInput.value += ".";
        }
    });

    buttonEquals.addEventListener("click", () => {
        completeParentheses();
        try {
            calculatorInput.value = eval(calculatorInput.value.replaceAll("%", "/100").replaceAll("÷", "/").replaceAll("×", "*"));
            if (isNaN(calculatorInput.value)) throw "Error";
        } catch (error) {
            calculatorInput.value = "Error";
        }
    });

    function completeParentheses() {
        let amountOfOpenParentheses = (calculatorInput.value.match(/\(/g) || []).length;
        let amountOfClosedParentheses = (calculatorInput.value.match(/\)/g) || []).length;
        
        if (amountOfOpenParentheses > amountOfClosedParentheses) {
            calculatorInput.value += ")".repeat(amountOfOpenParentheses - amountOfClosedParentheses);
        }
    }

    function errorInCalculation() {
        if (calculatorInput.value === "Error") {
            calculatorInput.value = "";
        }
    }
});