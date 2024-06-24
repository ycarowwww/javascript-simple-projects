document.addEventListener("DOMContentLoaded", () => {
    let calculateButton = document.getElementById("calculatebmi");

    calculateButton.onclick = function() { calculateBMI() };

    function calculateBMI() {
        let weight = parseFloat(document.getElementById("weightinput").value);
        let height = parseFloat(document.getElementById("heightinput").value);

        let bmi = weight / (height ** 2);

        let bmiText = document.getElementById("yourbmi");
        bmiText.innerHTML = `Your BMI: ${bmi}`;

        document.querySelectorAll("main table tbody tr").forEach(element => {
            element.style.backgroundColor = "transparent";
        });
        
        if (bmi < 18.5) {
            document.querySelector("main table tbody tr:nth-child(1)").style.backgroundColor = "red";
        } else if (bmi < 24.9) {
            document.querySelector("main table tbody tr:nth-child(2)").style.backgroundColor = "red";
        } else if (bmi < 29.9) {
            document.querySelector("main table tbody tr:nth-child(3)").style.backgroundColor = "red";
        } else if (bmi < 39.9) {
            document.querySelector("main table tbody tr:nth-child(4)").style.backgroundColor = "red";
        } else {
            document.querySelector("main table tbody tr:nth-child(5)").style.backgroundColor = "red";
        }
    }
});