let buttonVisibleHiddenPassword = document.getElementById("imgpassword");
let inputPassword = document.getElementById("ipassword");
let passwordLength = document.getElementById("pgalength");
let passwordLengthText = document.getElementById("pgalengthspan");
const passwordCopyButton = document.getElementById("passwordcopybutton");
const passwordGenerateButton = document.getElementById("generate-button");

buttonVisibleHiddenPassword.addEventListener("click", toggleVisibleHiddenPassword);
inputPassword.addEventListener("input", showPasswordValidation);
passwordCopyButton.addEventListener("click", copyPassword);
passwordLength.addEventListener("input", () => { passwordLengthText.innerHTML = passwordLength.value.toString(); });
passwordGenerateButton.addEventListener("click", generatePassword);

function toggleVisibleHiddenPassword() {
    if (inputPassword.type === "password") {
        buttonVisibleHiddenPassword.src = "images/hidden.png";
        inputPassword.type = "text";
        return;
    }
    buttonVisibleHiddenPassword.src = "images/visible.png";
    inputPassword.type = "password";
}

function showPasswordValidation() {
    let passwordLevel = getPasswordLevel();
    let passwordClassification = { srcImg : "", textSpan : "" };
    let passwordValidatorImage = document.getElementById("passwordvalidationimg");
    let passwordValidatorText = document.getElementById("passwordvalidationspan");
    
    if (passwordLevel <= 0) passwordClassification = { srcImg : "images/password_unknown.svg", textSpan : "Unknown Password" } 
    else if (passwordLevel <= 2) passwordClassification = { srcImg : "images/password_weak.svg", textSpan : "Weak Password" } 
    else if (passwordLevel <= 4) passwordClassification = { srcImg : "images/password_moderate.svg", textSpan : "Moderate Password" } 
    else passwordClassification = { srcImg : "images/password_strong.svg", textSpan : "Strong Password" }

    passwordValidatorImage.src = passwordClassification.srcImg;
    passwordValidatorText.innerHTML = passwordClassification.textSpan;
}

function getPasswordLevel() {
    let passwordLevel = 0;
    passwordLevel += (inputPassword.value.match(/[a-z]/g) || []).length > 0 ? 1 : 0;
    passwordLevel += (inputPassword.value.match(/[A-Z]/g) || []).length > 0 ? 1 : 0;
    passwordLevel += (inputPassword.value.match(/[0-9]/g) || []).length > 0 ? 1 : 0;
    passwordLevel += (inputPassword.value.match(/[!@#$%&*()\-_=+\[\]{}~\^;:.>,<`\/\|]/g) || []).length > 0 ? 1 : 0;
    passwordLevel += inputPassword.value.length >= 8 ? 1 : 0;
    return passwordLevel;
}

function copyPassword() {
    inputPassword.select();
    inputPassword.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(inputPassword.value);
}

function generatePassword() {
    const includeLowercase = document.getElementById("pgaa-z").checked;
    const includeUppercase = document.getElementById("pgaa-zu").checked;
    const includeNumbers = document.getElementById("pga0-9").checked;
    const includeSymbols = document.getElementById("pgasyb").checked;
    const length = parseInt(passwordLength.value);
    
    if (!(includeLowercase || includeUppercase || includeNumbers || includeSymbols) || length < [includeLowercase, includeUppercase, includeNumbers, includeSymbols].filter((x) => x).length) {
        alert("Enter Valid Parameters.");
        return;
    }
    
    let requiredPassword = { allowedChars : "", level : 0, addRequirements : function(chars, level) { this.allowedChars += chars; this.level += level; } };
    if (includeLowercase) requiredPassword.addRequirements("abcdefghijklmnopqrstuvwxyz", 1);
    if (includeUppercase) requiredPassword.addRequirements("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 1);
    if (includeNumbers) requiredPassword.addRequirements("0123456789", 1);
    if (includeSymbols) requiredPassword.addRequirements("!@#$%&*()-_=+[]{}~^;:.>,<`/|", 1);
    requiredPassword.level += length >= 8 ? 1 : 0;
    
    inputPassword.value = "";
    for (let i = 0; i < length; i++) {
        inputPassword.value += requiredPassword.allowedChars[Math.floor(Math.random() * requiredPassword.allowedChars.length)];
    }

    while (requiredPassword.level != getPasswordLevel()) {
        inputPassword.value = "";
        for (let i = 0; i < length; i++) {
            inputPassword.value += requiredPassword.allowedChars[Math.floor(Math.random() * requiredPassword.allowedChars.length)];
        }
    }

    showPasswordValidation()
}