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
        if (inputPassword.value.length === 0) {
            passwordValidationMessage("images/password_unknown.svg", "Unknown Password");
        } else if (inputPassword.value.length <= 6) {
            passwordValidationMessage("images/password_weak.svg", "Weak Password");
        } else if (inputPassword.value.length <= 14) {
            passwordValidationMessage("images/password_moderate.svg", "Moderate Password");
        } else {
            passwordValidationMessage("images/password_strong.svg", "Strong Password");
        }
    }

    function passwordValidationMessage(srcImg, textSpan) {
        passwordValidatorImage.src = srcImg;
        passwordValidatorText.innerHTML = textSpan;
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
        
        inputPassword.value = "";
        for (let i = 0; i < length; i++) {
            inputPassword.value += allowedChars[Math.floor(Math.random() * allowedChars.length)];
        }

        validatePassword();
    }
});