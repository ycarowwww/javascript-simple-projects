document.addEventListener("DOMContentLoaded", () => {
    const calculatorInput = document.getElementById("equationinput");
    const buttonClear = document.querySelector(".buttons--clear");
    const buttonParenthesis = document.querySelector(".buttons--parenthesis");
    const buttonPercent = document.querySelector(".buttons--percent");
    const buttonsOperations = document.querySelectorAll(".buttons button.buttons--operations:not(.buttons--parenthesis, .buttons--percent)");
    const buttonPlusOrMinus = document.querySelector(".buttons--plusorminus");
    const buttonsNumbers = document.querySelectorAll(".buttons--numbers");
    const buttonDot = document.querySelector(".buttons--dot");
    const buttonEquals = document.querySelector(".buttons--equals");

    buttonClear.addEventListener("click", () => {
        calculatorInput.value = "";
    });

    buttonParenthesis.addEventListener("click", () => {
        calculatorInput.value += "()";
    });

    buttonPercent.addEventListener("click", () => {
        calculatorInput.value += "%";
    });

    for (let i = 0; i < buttonsOperations.length; i++) {
        buttonsOperations[i].addEventListener("click", () => {
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
        if (calculatorInput.value.length > 0) {
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