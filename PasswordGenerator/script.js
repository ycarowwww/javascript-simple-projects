document.addEventListener("DOMContentLoaded", () => {
    let buttonVisibleHiddenPassword = document.getElementById("imgpassword");
    let inputPassword = document.getElementById("ipassword");
    let buttonVHPState = true;

    // Password Validation
    let passwordValidatorImage = document.getElementById("passwordvalidationimg");
    let passwordValidatorText = document.getElementById("passwordvalidationspan");
    let passwordCopyButton = document.getElementById("passwordcopybutton");

    // Password Generator
    let passwordLength = document.getElementById("pgalength");
    let passwordLengthText = document.getElementById("pgalengthspan");
    let includeLowercase = document.getElementById("pgaa-z").checked;
    let includeUppercase = document.getElementById("pgaa-zu").checked;
    let includeNumbers = document.getElementById("pga0-9").checked;
    let includeSymbols = document.getElementById("pgasyb").checked;
    let passwordGenerateButton = document.getElementById("generate-button");

    buttonVisibleHiddenPassword.addEventListener("click", visibleHiddenPassword);
    inputPassword.addEventListener("input", validatePassword);
    passwordCopyButton.addEventListener("click", copyPassword);
    passwordLength.addEventListener("input", changePasswordLengthText);
    document.getElementById("pgaa-z").addEventListener("input", () => { includeLowercase = document.getElementById("pgaa-z").checked; });
    document.getElementById("pgaa-zu").addEventListener("input", () => { includeUppercase = document.getElementById("pgaa-zu").checked; });
    document.getElementById("pga0-9").addEventListener("input", () => { includeNumbers = document.getElementById("pga0-9").checked; });
    document.getElementById("pgasyb").addEventListener("input", () => { includeSymbols = document.getElementById("pgasyb").checked; });
    passwordGenerateButton.addEventListener("click", () => { generatePassword(parseInt(passwordLength.value), includeLowercase, includeUppercase, includeNumbers, includeSymbols) });

    function visibleHiddenPassword() {
        if (buttonVHPState) {
            buttonVisibleHiddenPassword.src = "images/hidden.png";
            inputPassword.type = "text";
        } else {
            buttonVisibleHiddenPassword.src = "images/visible.png";
            inputPassword.type = "password";
        }
        buttonVHPState = !buttonVHPState;
    }

    function validatePassword() {
        if (inputPassword.value.length === 0) {
            passwordValidatorImage.src = "images/password_unknown.png";
            passwordValidatorText.innerHTML = "Unknown Password";
        } else if (inputPassword.value.length <= 6) {
            passwordValidatorImage.src = "images/password_horrible.png";
            passwordValidatorText.innerHTML = "Horrible Password";
        } else if (inputPassword.value.length <= 14) {
            passwordValidatorImage.src = "images/password_moderate.png";
            passwordValidatorText.innerHTML = "Moderate Password";
        } else {
            passwordValidatorImage.src = "images/password_great.png";
            passwordValidatorText.innerHTML = "Great Password";
        }
    }

    function copyPassword() {
        inputPassword.select();
        inputPassword.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(inputPassword.value);
    }

    function changePasswordLengthText() {
        passwordLengthText.innerHTML = `${passwordLength.value}`;
    }

    function generatePassword(length, includeLowercase, includeUppercase, includeNumbers, includeSymbols) {
        console.log(length)
        console.log(length < 1)
        console.log(includeLowercase)
        console.log(includeUppercase)
        console.log(includeNumbers)
        console.log(includeSymbols)
        console.log(!(includeLowercase || includeUppercase || includeNumbers || includeSymbols) || length < 1)
        if (!(includeLowercase || includeUppercase || includeNumbers || includeSymbols) || length < 1) {
            alert("Enter Valid Parameters.");
            return;
        }
        
        let allowedCharaters = "";
        if (includeLowercase) {
            allowedCharaters += "abcdefghijklmnopqrstuvwxyz";
        }
        if (includeUppercase) {
            allowedCharaters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        }
        if (includeNumbers) {
            allowedCharaters += "0123456789";
        }
        if (includeSymbols) {
            allowedCharaters += "!@#$%&*()-_=+[]{}~^;:.>,<`/|"
        }
        
        let password = "";
        for (let i = 0; i < length; i++) {
            let letter = allowedCharaters[Math.floor(Math.random() * allowedCharaters.length)];
            password += letter;
        }

        inputPassword.value = password;
        validatePassword();
    }
});