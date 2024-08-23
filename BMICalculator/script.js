const calculateButton = document.getElementById("calculatebmibutton");
const calculateAgainButton = document.getElementById("calculatebmiagain");
const bmiDiv = document.getElementById("bmidiv");

calculateButton.addEventListener("click", calculateBMI);
calculateAgainButton.addEventListener("click", toggleBMIResultVisibility);

function calculateBMI() {
    const height = parseFloat(document.getElementById("heightinput").value);
    const weight = parseFloat(document.getElementById("weightinput").value);
    
    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        alert("Enter Valid Height or Weight.");
        return;
    }

    const bmiValue = parseFloat((weight / (height ** 2)).toFixed(2));
    const bmiValueText = document.getElementById("bmivalue");
    const bmiClassificationText = document.getElementById("bmiclassification");
    const bmiClassification = getBMIClassification(bmiValue);
    
    bmiValueText.innerHTML = bmiValue.toString();
    bmiClassificationText.innerHTML = bmiClassification;
    bmiDiv.className = bmiClassification.replace(' ', '');

    toggleBMIResultVisibility();
}

function getBMIClassification(bmiValue) {
    if (bmiValue < 18.5) return "underweight";
    else if (bmiValue < 24.9) return "normal";
    else if (bmiValue < 29.9) return "overweight";
    else if (bmiValue < 39.9) return "obese";
    else return "morbidly obese";
}

function toggleBMIResultVisibility() {
    bmiDiv.classList.toggle("showup");
    calculateButton.toggleAttribute("disabled");
}