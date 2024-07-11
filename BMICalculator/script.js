const calculateButton = document.getElementById("calculatebmi");
const calculateAgainButton = document.getElementById("calculateagain");
const bmiResult = document.getElementById("bmiindex");

calculateButton.addEventListener("click", calculateBMI);
calculateAgainButton.addEventListener("click", showBMIResult);

function calculateBMI() {
    const height = parseFloat(document.getElementById("heightinput").value);
    const weight = parseFloat(document.getElementById("weightinput").value);
    
    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        alert("Enter Valid Height or Weight.");
        return;
    }

    const bmi = parseFloat((weight / (height ** 2)).toFixed(2));
    const bmiNumberText = document.getElementById("bminumber");
    const bmiClassificationText = document.getElementById("bmiclassification");
    let bmiClassification = {
        color : "",
        classification : "",
        newValues: function(color, classfication) { this.color = color; this.classification = classfication }
    }
    
    if (bmi < 18.5) bmiClassification.newValues("#FAD94C", "Underweight");
    else if (bmi < 24.9) bmiClassification.newValues("#2EB043", "Normal");
    else if (bmi < 29.9) bmiClassification.newValues("#FA7F3E", "Overweight");
    else if (bmi < 39.9) bmiClassification.newValues("#E05438", "Obese");
    else bmiClassification.newValues("#FA283E", "Morbidly Obese");
    
    bmiNumberText.innerHTML = bmi.toString();
    bmiClassificationText.innerHTML = bmiClassification.classification;
    bmiClassificationText.style.color = bmiClassification.color;
    bmiNumberText.style.color = bmiClassification.color;
    bmiResult.style.borderTopColor = bmiClassification.color;

    showBMIResult();
}

function showBMIResult() {
    bmiResult.classList.toggle("showup");
    calculateButton.toggleAttribute("disabled");
}