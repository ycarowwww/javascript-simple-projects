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
    const bmiValueParagraph = document.getElementById("bmivalue");
    const bmiClassificationParagraph = document.getElementById("bmiclassificationp");
    let bmiClassification = "";
    
    bmiDiv.className = '';
    if (bmiValue < 18.5) bmiClassification = "underweight";
    else if (bmiValue < 24.9) bmiClassification = "normal";
    else if (bmiValue < 29.9) bmiClassification = "overweight";
    else if (bmiValue < 39.9) bmiClassification = "obese";
    else bmiClassification = "morbidly obese";
    
    bmiValueParagraph.innerHTML = bmiValue.toString();
    bmiClassificationParagraph.innerHTML = bmiClassification;
    bmiDiv.classList.add(bmiClassification.replace(' ', ''));

    toggleBMIResultVisibility();
}

function toggleBMIResultVisibility() {
    bmiDiv.classList.toggle("showup");
    calculateButton.toggleAttribute("disabled");
}