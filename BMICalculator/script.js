let heightInput = document.getElementById("heightinput");
let weightInput = document.getElementById("weightinput");
let calculateButton = document.getElementById("calculatebmi");
const calculateAgain = document.getElementById("calculateagain");
let bmiDiv = document.getElementById("bmiindex");
let bmiNumber = document.getElementById("bminumber");
let bmiClassification = document.getElementById("bmiclassification");

calculateButton.addEventListener("click", () => {
    if (heightInput.value === "" || weightInput.value === "" || heightInput.value < 0 || weightInput.value < 0) return;

    bmiDiv.classList.toggle("showup");
    calculateButton.toggleAttribute("disabled");

    calculateBMI(parseFloat(heightInput.value), parseFloat(weightInput.value), bmiNumber, bmiClassification, bmiDiv);
});

calculateAgain.addEventListener("click", () => {
    bmiDiv.classList.toggle("showup");
    calculateButton.toggleAttribute("disabled");
});

function calculateBMI(height, weight, bmiNumberText, bmiClassificationText, bmiDiv) {
    const bmi = parseFloat((weight / (height ** 2)).toFixed(1));
    bmiNumberText.innerHTML = bmi.toString();
    
    let bmiColor = "";
    if (bmi < 18.5) {
        bmiColor = "#FAD94C";
        bmiClassificationText.innerHTML = "Underweight";
    } else if (bmi < 24.9) {
        bmiColor = "#2EB043";
        bmiClassificationText.innerHTML = "Normal";
    } else if (bmi < 29.9) {
        bmiColor = "#FA7F3E";
        bmiClassificationText.innerHTML = "Overweight";
    } else if (bmi < 39.9) {
        bmiColor = "#E05438";
        bmiClassificationText.innerHTML = "Obese";
    } else {
        bmiColor = "#FA283E";
        bmiClassificationText.innerHTML = "Morbidly Obese";
    }

    bmiNumberText.style.color = bmiColor;
    bmiClassificationText.style.color = bmiColor;
    bmiDiv.style.borderTopColor = bmiColor;
}