const converter = document.getElementById("converter");
const selectedSelectors = document.getElementsByClassName("selected");
const selectedImgSelectors = document.getElementsByClassName("selected__image");
const selectedNameSelectors = document.getElementsByClassName("selected__name");
const selectedIdSelectors = document.getElementsByClassName("selected__id");
const currencyLists = document.getElementsByClassName("currency-list");
const currencyElementTemplate = document.getElementById("currency-element-template");
const currencySwapButton = document.getElementById("currency__swap");
const currencySearcher1 = document.getElementById("currency-search-1");
const currencySearcher2 = document.getElementById("currency-search-2");
const currencyRate1 = document.getElementById("normal-currency-rate-1");
const currencyRate2 = document.getElementById("normal-currency-rate-2");
const currencyInput1 = document.getElementById("currency-input-1");
const currencyInput2 = document.getElementById("currency-input-2");
const themeSwitcherButton = document.getElementById("theme-switcher");
const currentCurrenciesCodes = [ "any", "any" ];
const apiLink = "https://economia.awesomeapi.com.br/last/";
let bid = null;

for (const code in codes) {
    for (const list of currencyLists) {
        const elementList = currencyElementTemplate.content.cloneNode(true);

        const elementImg = elementList.querySelector(".currency-element__image");
        elementImg.src = `./images/${code}.png`;
        const elementName = elementList.querySelector(".currency-element__name");
        elementName.innerHTML = codes[code];
        const elementId = elementList.querySelector(".currency-element__id");
        elementId.innerHTML = code;

        list.appendChild(elementList);
    }
}

for (let i = 0; i < selectedSelectors.length; i++) {
    selectedSelectors[i].addEventListener("click", showCurrencyList(i));
    currencyLists[i].addEventListener("click", changeSelected(i));
}

document.body.addEventListener("click", checkClick);
currencySwapButton.addEventListener("click", swapCurrencies);
currencySearcher1.addEventListener("input", searchCurrencies(0));
currencySearcher2.addEventListener("input", searchCurrencies(1));
currencyInput1.addEventListener("input", validateCurrencyProcess(0));
currencyInput2.addEventListener("input", validateCurrencyProcess(1));
window.addEventListener('load', limitCurrencyListSize);
window.addEventListener('scroll', limitCurrencyListSize);
window.addEventListener('resize', limitCurrencyListSize);
themeSwitcherButton.addEventListener("click", switchTheme);

function showCurrencyList(index) {
    return () => {
        currencyLists[index].classList.toggle("active");
        currencyLists[index === 0 ? 1 : 0].classList.remove("active"); // Removes the "active" from the other List.
    };
}

function changeSelected(index) {
    return event => {
        const listElement = event.target.closest("li:not(.search-currencies)");

        if (!listElement) return;

        const newCode = listElement.querySelector(".currency-element__id").innerHTML;
        setSelected(index, newCode);
        calculateBid();
        currencyLists[index].classList.remove("active");
    };
}

function checkClick(event) { // Hides the selectors if the click was outside.
    const selector = event.target.closest(".currency-selector");

    if (!selector) {
        for (const list of currencyLists) {
            list.classList.remove("active");
        }
    }
}

function swapCurrencies() {
    if (currentCurrenciesCodes.includes("any")) return;

    currentCurrenciesCodes.reverse();
    setSelected(0, currentCurrenciesCodes[0]);
    setSelected(1, currentCurrenciesCodes[1]);
    calculateBid();
    const temp = currencyInput1.value;
    currencyInput1.value = currencyInput2.value;
    currencyInput2.value = temp;
}

function searchCurrencies(indexSelector) {
    return event => {
        const toSearch = event.target.value;
        const elements = currencyLists[indexSelector].querySelectorAll("li:not(.search-currencies)");
        const codesEntries = Object.entries(codes);

        for (let i = 0; i < codesEntries.length; i++) {
            let hide = codesEntries[i][0].includes(toSearch) || codesEntries[i][1].toLowerCase().includes(toSearch);
            elements[i].classList.toggle("hide", !hide);
        }
    };
}

function setSelected(index, newCode) {
    const otherCode = currentCurrenciesCodes[index === 0 ? 1 : 0];
    if (newCode === otherCode) { // Swap the selecteds if they are equal.
        swapCurrencies();
        return;
    }

    currentCurrenciesCodes[index] = newCode;

    const selectedImg = selectedImgSelectors[index];
    const selectedName = selectedNameSelectors[index];
    const selectedId = selectedIdSelectors[index];

    selectedImg.src = `./images/${currentCurrenciesCodes[index]}.png`;
    selectedName.innerHTML = codes[currentCurrenciesCodes[index]];
    selectedId.innerHTML = currentCurrenciesCodes[index];
}

function validateCurrencyProcess(indexInput) {
    return event => {
        event.target.value = event.target.value.replace(/[^0-9.]/g, ''); // Keeps only numbers and "." on the input's value
        const parts = event.target.value.split(".");
        if (parts.length > 2) { /* Doesn't allow more than one dot. */
            event.target.value = parts[0] + "." + parts.slice(1).join("");
        }
        convertCurrency(indexInput);
    };
}

function convertCurrency(indexInput) {
    if (currentCurrenciesCodes.includes("any")) return;
    
    if (indexInput === 0) {
        currencyInput2.value = currencyInput1.value * bid;
    } else {
        currencyInput1.value = currencyInput2.value / bid;
    }
}

function limitCurrencyListSize() { /* Limits the list size */
    const viewportHeight = window.innerHeight;
    const bottomPadding = 10;
    const listNormalHeight = 200; // 200px

    for (const list of currencyLists) {
        const bottomPos = list.getBoundingClientRect().top + listNormalHeight;
        const spaceBelow = viewportHeight - bottomPadding - bottomPos;

        if (spaceBelow < 0) {
            const newHeight = (listNormalHeight - (Math.abs(spaceBelow) + bottomPadding)) / 16; // Converting to rem
            list.style.maxHeight = `${newHeight}rem`;
        } else {
            list.style.maxHeight = "12.5rem"; // 200px in rem
        }
    }
}

function calculateBid() {
    if (currentCurrenciesCodes.includes("any")) return;

    converter.classList.add("loading"); // "Loading effect"
    const currencies = currentCurrenciesCodes.map(cur => cur.toUpperCase());
    let link = apiLink;
    let bidFunction = null;
    if (!currencies.includes("USD")) { // Due to API limitations, we convert currencies to USD and then to each other.
        link += `USD-${currencies[0]},USD-${currencies[1]}`;
        bidFunction = data => {
            const values = Object.keys(data).map(v => data[v]["bid"]);
            bid = Number(values[1] / values[0]);
        };
    } else if (currencies[0] === "USD") {
        link += `USD-${currencies[1]}`;
        bidFunction = data => {
            bid = Number(data[`USD${currencies[1]}`]["bid"]);
        };
    } else {
        link += `USD-${currencies[0]}`;
        bidFunction = data => {
            bid = Number(1 / data[`USD${currencies[0]}`]["bid"]);
        };
    }

    fetch(link)
        .then(response => response.json())
        .then(data => {
            converter.classList.remove("loading");
            bidFunction(data);
            displayNormalCurrencyRate();
            convertCurrency(0);
        })
        .catch(error => console.error(`bid's calculation failed: ${error}`));
}

function displayNormalCurrencyRate() {
    const codes = currentCurrenciesCodes.map(v => v.toUpperCase());
    currencyRate1.innerHTML = `1 ${codes[0]} = ${bid.toPrecision(5)} ${codes[1]}`;
    currencyRate2.innerHTML = `1 ${codes[1]} = ${(1 / bid).toPrecision(5)} ${codes[0]}`;
}

function switchTheme() {
    document.body.classList.toggle("dark-theme");
    saveThemeOnStorage(document.body.classList.contains("dark-theme"));
}

function saveThemeOnStorage(isDarkTheme) {
    localStorage.setItem("theme", isDarkTheme ? "dark" : "white");
}

function loadSavedTheme() {
    const isDarkTheme = localStorage.getItem("theme");

    if (isDarkTheme === "dark") {
        document.body.classList.add("dark-theme");
    } else if (isDarkTheme === "white") {
        document.body.classList.remove("dark-theme");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) { // Check the user's default color theme
        document.body.classList.add("dark-theme");
    }
}

loadSavedTheme();
