# Disposable Chat

A simple disposable chat app built with Socket.io. Each chat room is deleted automatically once all users leave.

## Installation

1. After Navigate into this project folder:
    ```bash
    cd DisposableChat
    ```
2. Navigate to the **server** folder:
    ```bash
    cd server
    ```
3. install dependencies from `package.json`:
    ```bash
    npm install
    ```
4. Start the server:
    ```bash
    node server.js
    ```
    The server will start at **http://localhost:8080** by default. If you need to connect another device in your room, you will have to replace the **serverIP** variable of the client JS files to your public IP, which **server.js** will show you in the terminal. The value needs to be like: **ws://IP:8080**.
5. Navigate to the **client pages** folder:
    ```bash
    cd ../client/pages
    ```
6. Open `login.html` in your browser. 
    If you encounter a **CORS** issue, run a simple local web server (for example, using the VS Code **Live Server** extension) in the folder.
