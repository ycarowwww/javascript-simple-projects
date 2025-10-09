const roomInput = document.getElementById("room-input");
const usernameInput = document.getElementById("username-input");
const hasPasswordInput = document.getElementById("checkbox-has-password");
const passwordInput = document.getElementById("password-input");
const joinChatForm = document.getElementById("join-chat-form");
const chatResultP = document.getElementById("submit-result");

function setChatResult(message, state) {
    // Funtion to change the "chatResultP" object.
    chatResultP.className = "";
    chatResultP.classList.add(state); // "state" : Esthetics of the Result Message.
    chatResultP.textContent = message;
}

if (sessionStorage.getItem("enter_failure") !== null) { // If something goes wrong on "room.html", the issue will be handle here.
    setChatResult(`Login failed: ${sessionStorage.getItem("enter_failure")}.`, "failure"); // Shows the error.
    sessionStorage.clear();
}

const serverIP = "ws://localhost:8080"; // Here is the "server.js" IP.
const socket = io(serverIP);
const loginData = {};

joinChatForm.addEventListener("submit", e => {
    e.preventDefault();
    
    loginData.username = usernameInput.value;
    loginData.roomname = roomInput.value;
    loginData.password = hasPasswordInput.checked ? passwordInput.value : "";

    socket.emit("check_room", loginData);
});

socket.on("check_result", verification => { // Checks if it's possible to join/create the room.
    if (!verification.result) {
        setChatResult(`Login failed: ${verification.issue}.`, "failure");
        return;
    }
    
    setChatResult("Login done with Success!", "success");
    sessionStorage.setItem("username", loginData.username);
    sessionStorage.setItem("roomname", loginData.roomname);
    sessionStorage.setItem("password", loginData.password);
    window.location.href = window.location.href.replace("login.html", "room.html");
});
