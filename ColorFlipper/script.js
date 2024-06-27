document.addEventListener("DOMContentLoaded", () => {
    const color = document.getElementById("color");
    color.addEventListener("input", () => {
        document.body.style.backgroundColor = color.value;
    });
});