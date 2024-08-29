const buttonVisibleHiddenPassword = document.getElementById("imgshowpassword");
const inputPassword = document.getElementById("inputpassword");
const passwordLength = document.getElementById("passwordlengthinput");
const passwordLengthCount = document.getElementById("passwordlengthcount");
const passwordCopyButton = document.getElementById("passwordcopybutton");
const passwordGenerateButton = document.getElementById("generate-button");

buttonVisibleHiddenPassword.addEventListener("click", toggleVisibleHiddenPassword);
inputPassword.addEventListener("input", validatePassword);
passwordCopyButton.addEventListener("click", copyPassword);
passwordLength.addEventListener("input", () => { passwordLengthCount.innerHTML = passwordLength.value.toString(); });
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

function validatePassword() {
    let passwordLevel = getPasswordLevel(inputPassword.value);
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

function getPasswordLevel(password) {
    let passwordLevel = 0;
    passwordLevel += (password.match(/[a-z]/g) || []).length > 0 ? 1 : 0;
    passwordLevel += (password.match(/[A-Z]/g) || []).length > 0 ? 1 : 0;
    passwordLevel += (password.match(/[0-9]/g) || []).length > 0 ? 1 : 0;
    passwordLevel += (password.match(/[!@#$%&*()\-_=+\[\]{}~\^;:.>,<`\/\|]/g) || []).length > 0 ? 1 : 0;
    passwordLevel += password.length >= 8 ? 1 : 0;
    return passwordLevel;
}

function copyPassword() {
    inputPassword.select();
    inputPassword.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(inputPassword.value);
}

function generatePassword() {
    const includeLowercase = document.getElementById("includelowercase").checked;
    const includeUppercase = document.getElementById("includeuppercase").checked;
    const includeNumbers = document.getElementById("includenumbers").checked;
    const includeSymbols = document.getElementById("includesymbols").checked;
    const length = parseInt(passwordLength.value);
    const minimumLength = [includeLowercase, includeUppercase, includeNumbers, includeSymbols].filter((x) => x).length;
    
    if (!(includeLowercase || includeUppercase || includeNumbers || includeSymbols) || length < minimumLength) {
        alert("Enter Valid Parameters.");
        return;
    }
    
    const requiredPassword = { chars : "", level : 0};
    if (includeLowercase) requiredPassword.chars += "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) requiredPassword.chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) requiredPassword.chars += "0123456789";
    if (includeSymbols) requiredPassword.chars += "!@#$%&*()-_=+[]{}~^;:.>,<`/|";
    requiredPassword.level = getPasswordLevel(requiredPassword.chars);
    requiredPassword.level -= length < 8 ? 1 : 0;
    
    inputPassword.value = "";
    for (let i = 0; i < length; i++) {
        inputPassword.value += requiredPassword.chars[Math.floor(Math.random() * requiredPassword.chars.length)];
    }

    while (requiredPassword.level != getPasswordLevel(inputPassword.value)) {
        inputPassword.value = "";
        for (let i = 0; i < length; i++) {
            inputPassword.value += requiredPassword.chars[Math.floor(Math.random() * requiredPassword.chars.length)];
        }
    }

    validatePassword()
}