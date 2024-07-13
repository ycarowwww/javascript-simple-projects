let div = document.getElementById("div");
let input = document.getElementById("divstyle");

input.addEventListener("input", () => {
    div.style.backgroundColor = input.value;
    div.style.borderRadius = input.value;
    div.style.boxShadow = input.value;
});