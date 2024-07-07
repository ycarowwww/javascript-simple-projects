document.addEventListener("DOMContentLoaded", () => {
    let buttonVisibleHiddenPassword = document.getElementById("imgpassword");
    let inputPassword = document.getElementById("ipassword");

    // Password Validation
    let passwordValidatorImage = document.getElementById("passwordvalidationimg");
    let passwordValidatorText = document.getElementById("passwordvalidationspan");
    const passwordCopyButton = document.getElementById("passwordcopybutton");

    // Password Generator
    let passwordLength = document.getElementById("pgalength");
    let passwordLengthText = document.getElementById("pgalengthspan");
    let includeLowercase = document.getElementById("pgaa-z");
    let includeUppercase = document.getElementById("pgaa-zu");
    let includeNumbers = document.getElementById("pga0-9");
    let includeSymbols = document.getElementById("pgasyb");
    const passwordGenerateButton = document.getElementById("generate-button");

    buttonVisibleHiddenPassword.addEventListener("click", visibleHiddenPassword);
    inputPassword.addEventListener("input", validatePassword);
    passwordCopyButton.addEventListener("click", copyPassword);
    passwordLength.addEventListener("input", () => { passwordLengthText.innerHTML = `${passwordLength.value}`; });
    passwordGenerateButton.addEventListener("click", () => { generatePassword(parseInt(passwordLength.value), includeLowercase.checked, includeUppercase.checked, includeNumbers.checked, includeSymbols.checked) });

    function visibleHiddenPassword() {
        if (inputPassword.type === "password") {
            buttonVisibleHiddenPassword.src = "images/hidden.png";
            inputPassword.type = "text";
        } else {
            buttonVisibleHiddenPassword.src = "images/visible.png";
            inputPassword.type = "password";
        }
    }

    function validatePassword() {
        let passwordLevel = calculatePasswordLevel();
        
        if (passwordLevel <= 0) {
            passwordValidationMessage("images/password_unknown.svg", "Unknown Password");
        } else if (passwordLevel <= 2) {
            passwordValidationMessage("images/password_weak.svg", "Weak Password");
        } else if (passwordLevel <= 4) {
            passwordValidationMessage("images/password_moderate.svg", "Moderate Password");
        } else {
            passwordValidationMessage("images/password_strong.svg", "Strong Password");
        }
        return passwordLevel;
    }

    function passwordValidationMessage(srcImg, textSpan) {
        passwordValidatorImage.src = srcImg;
        passwordValidatorText.innerHTML = textSpan;
    }

    function calculatePasswordLevel() {
        let passwordLevel = 0;
        passwordLevel += (inputPassword.value.match(/[a-z]/g) || []).length > 0 ? 1 : 0;
        passwordLevel += (inputPassword.value.match(/[A-Z]/g) || []).length > 0 ? 1 : 0;
        passwordLevel += (inputPassword.value.match(/[0-9]/g) || []).length > 0 ? 1 : 0;
        passwordLevel += (inputPassword.value.match(/[!@#$%&*()\-_=+\[\]{}~\^;:.>,<`\/\|]/g) || []).length > 0 ? 1 : 0;
        passwordLevel += inputPassword.value.length > 7 ? 1 : 0;
        return passwordLevel;
    }

    function copyPassword() {
        inputPassword.select();
        inputPassword.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(inputPassword.value);
    }

    function generatePassword(length, includeLowercase, includeUppercase, includeNumbers, includeSymbols) {
        if (!(includeLowercase || includeUppercase || includeNumbers || includeSymbols) || length < 1) {
            alert("Enter Valid Parameters.");
            return;
        }
        
        let allowedChars = "";
        allowedChars += includeLowercase ? "abcdefghijklmnopqrstuvwxyz" : "";
        allowedChars += includeUppercase ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "";
        allowedChars += includeNumbers ? "0123456789" : "";
        allowedChars += includeSymbols ? "!@#$%&*()-_=+[]{}~^;:.>,<`/|" : "";

        let passwordRequirements = 0;
        passwordRequirements += includeLowercase ? 1 : 0;
        passwordRequirements += includeUppercase ? 1 : 0;
        passwordRequirements += includeNumbers ? 1 : 0;
        passwordRequirements += includeSymbols ? 1 : 0;
        passwordRequirements += length > 7 ? 1 : 0;
        
        inputPassword.value = "";
        for (let i = 0; i < length; i++) {
            inputPassword.value += allowedChars[Math.floor(Math.random() * allowedChars.length)];
        }

        while (passwordRequirements != validatePassword()) {
            inputPassword.value = "";
            for (let i = 0; i < length; i++) {
                inputPassword.value += allowedChars[Math.floor(Math.random() * allowedChars.length)];
            }
        }
    }
});