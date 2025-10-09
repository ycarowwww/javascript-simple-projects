const mainH1 = document.getElementById("main-h1");
const messageInput = document.getElementById("message-input");
const sendMessageBtn = document.getElementById("send-button");
const messagesList = document.getElementById("messages-list");
const usersList = document.getElementById("users-list");
const templateMsgUser = document.getElementById("template-msg-user");
const templateServerMsg = document.getElementById("template-server-msg");
const templateUserList = document.getElementById("template-user-list");

const loginData = {
    "username": sessionStorage.getItem("username"),
    "roomname": sessionStorage.getItem("roomname"),
    "password": sessionStorage.getItem("password")
};
const serverIP = "ws://localhost:8080"; // Here is the "server.js" IP.
const socket = io(serverIP);
socket.emit("join_room", loginData);

mainH1.textContent = `Disposable Chat - ${loginData["roomname"]}`;

sendMessageBtn.addEventListener("click", sendMessage);
document.addEventListener("keydown", e => {
    const isSendMsgInputFocused = document.activeElement === messageInput;
    
    if (isSendMsgInputFocused && e.key === "Enter") sendMessage();
});

function sendMessage() { // Sends the message to the server.
    const msg = messageInput.value;
    if (msg === "") return;

    messageInput.value = "";
    socket.emit("message", msg);
}

socket.on("message", msg => { // Receives the messages from the server, including those from the user himself.
    const newMsg = templateMsgUser.content.cloneNode(true);

    newMsg.querySelector(".msg-user").textContent = msg.username;
    newMsg.querySelector(".msg-span").textContent = msg.content;

    messagesList.appendChild(newMsg);
});

socket.on("current_users", users => { // When the user joins the room, he will receive a list of the current users in the room.
    usersList.innerHTML = "";

    users.forEach(user => {
        const newLi = templateUserList.content.cloneNode(true);

        newLi.querySelector("li").textContent = user;

        usersList.appendChild(newLi);
    });
});

socket.on("new_user", user => { // If someone joins the room, this will show a message in the chat and update the room's users list.
    const newUserMsg = templateServerMsg.content.cloneNode(true);
    newUserMsg.querySelector(".server-msg").textContent = `${user} has entered the chat.`;
    messagesList.appendChild(newUserMsg); // Chat Server Message.

    const newUserLi = templateUserList.content.cloneNode(true);
    newUserLi.querySelector("li").textContent = user;
    usersList.appendChild(newUserLi); // Users list updated.
});

socket.on("user_left", user => { // If someone leaves the room, this will show a message in the chat and update the room's users list.
    const newUserMsg = templateServerMsg.content.cloneNode(true);
    newUserMsg.querySelector(".server-msg").textContent = `${user} has left the chat.`;
    newUserMsg.querySelector(".server-msg").classList.add("red");
    messagesList.appendChild(newUserMsg); // Chat Server Message.

    const usersListLis = usersList.querySelectorAll("li");
    usersListLis.forEach(li => { // Searches the user who left.
        if (li.textContent === user) {
            li.remove();
        }
    });
});

socket.on("enter_failure", verification => { // If the joining process fails for some reason, returns to "login.html" and shows the issue there.
    sessionStorage.clear();
    sessionStorage.setItem("enter_failure", verification.issue);
    window.location.href = window.location.href.replace("room.html", "login.html");
});
