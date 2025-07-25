const calculateBtn = document.getElementById("calculate-btn");
const bmiResultContainer = document.getElementById("bmi-result-container");
const bmiResultData = document.getElementById("bmi-result-data");
const bmiValue = document.getElementById("bmi-value");
const bmiClassification = document.getElementById("bmi-classification");
const errorText = document.getElementById("error-text");
const heightInput = document.getElementById("height-input");
const heightSelect = document.getElementById("height-select");
const weightInput = document.getElementById("weight-input");
const weightSelect = document.getElementById("weight-select");
const sizeFactors = { // x * factor = x value in meters.
    "cm" : 0.01,
    "feet" : 0.3048,
    "inches" : 0.0254,
    "yard" : 0.9144
};
const massFactors = { // x * factor = x value in kg.
    "kg" : 1,
    "lbs" : 1 / 2.205,
    "oz" : 1 / 35.274
};
const bmiCategories = [ // List of the BMI classifications' max value, name and CSSClassName.
    { max: 18.5, label: "underweight", className: "classification-1" },
    { max: 25, label: "normal", className: "classification-2" },
    { max: 30, label: "overweight", className: "classification-3" },
    { max: 40, label: "obese", className: "classification-4" },
    { max: Infinity, label: "morbidly obese", className: "classification-5" }
];

calculateBtn.addEventListener("click", calculateBMIEvent);

function calculateBMIEvent() {
    if (calculateBtn.classList.contains("recalculate")) { 
        removeRecalculateState();
        return;
    }
    
    setRecalculateState();
    const height = convertInputValue(heightInput, heightSelect, sizeFactors);
    const weight = convertInputValue(weightInput, weightSelect, massFactors);
    const bmi = Number(calculateBMI(weight, height).toFixed(2));
    const [ classification, cssClassName ] = getBMIClassification(bmi);

    if (bmi <= 0) {
        errorText.classList.add("showup");
        return;
    }
    
    bmiValue.textContent = bmi;
    bmiClassification.textContent = capitalizeFirstLetter(classification);
    bmiResultData.classList.add(cssClassName);
}

function convertInputValue(input, select, factors) { // Multiplies the input value by its corresponding factor.
    const val = Number(input.value);
    if (val <= 0) return 0;
    const selectedOption = select.options[select.options.selectedIndex].value;
    return val * factors[selectedOption];
}

function calculateBMI(weight, height) { // weight in kg and height in m.
    if (weight <= 0 || height <= 0) return 0;

    return weight / height ** 2;
}

function getBMIClassification(bmi) { // Returns a list [ name | CSS Class name ].
    const category = bmiCategories.find(cat => bmi < cat.max);
    return category ? [ category.label, category.className ] : [ "unknown", "" ];
}

function capitalizeFirstLetter(val) { // Capitalize the first letter. "hello" -> "Hello".
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function setRecalculateState() {
    calculateBtn.classList.add("recalculate");
    calculateBtn.textContent = "Recalculate";
    bmiResultContainer.classList.add("showup");
    calculateBtn.ariaExpanded = "true";
}

function removeRecalculateState() {
    calculateBtn.className = "";
    calculateBtn.textContent = "Calculate";
    bmiResultContainer.classList.remove("showup");
    calculateBtn.ariaExpanded = "false";
    bmiResultData.className = "";
    bmiValue.textContent = "";
    bmiClassification.textContent = "";
    errorText.classList.remove("showup");
}
