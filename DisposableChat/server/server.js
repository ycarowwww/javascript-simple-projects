import { createServer } from "http";
import { networkInterfaces } from "os";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: { origin: "*" }
});

const currentRooms = {};

io.on("connection", socket => {
    socket.on("check_room", data => { // Checks the state of a room and if somebody can join.
        const verification = {
            result: false,
            issue: null
        };

        if (data.roomname === null || data.username === null) { // Checks if data was sent.
            verification.issue = "Invalid Data";
        } else if (Object.hasOwn(currentRooms, data.roomname)) { // Room already exists
            if (currentRooms[data.roomname].password !== "" && currentRooms[data.roomname].password !== data.password) { // Room has password && password is wrong
                verification.issue = "Invalid Password";
            } else {
                if (currentRooms[data.roomname].users.includes(data.username)) { // There's anyone with this username already
                    verification.issue = "Username already Taken";
                } else {
                    verification.result = true;
                }
            }
        } else {
            verification.result = true;
        }

        socket.emit("check_result", verification);
    });

    socket.on("join_room", data => { // Tries to join a room.
        const verification = {
            result: false,
            issue: null
        };

        if (data.roomname === null || data.username === null) { // Checks if data was sent.
            verification.issue = "Invalid Data";
            
            socket.emit("enter_failure", verification);
            return;
        } else if (Object.hasOwn(currentRooms, data.roomname)) { // Room already exists
            if (currentRooms[data.roomname].password !== "" && currentRooms[data.roomname].password !== data.password) { // Room has password && password is wrong
                verification.issue = "Invalid Password";
            
                socket.emit("enter_failure", verification);
                return;
            } else if (currentRooms[data.roomname].users.includes(data.username)) { // There's anyone with this username already
                verification.issue = "Username already Taken";
            
                socket.emit("enter_failure", verification);
                return;
            }
        } else {
            currentRooms[data.roomname] = { password: data.password, users: [] }; // Creates the room.
        }

        socket.emit("current_users", currentRooms[data.roomname].users); // Sends the current users to this user
        socket.join(data.roomname); // Joins socket.io's room
        currentRooms[data.roomname].users.push(data.username); // Adds the user
        socket.data.username = data.username; // Saves some user's data
        socket.data.roomname = data.roomname;
        io.to(data.roomname).emit("new_user", data.username); // Warns everybody that somebody has joined the room
    });

    socket.on("message", msg => {
        const { username, roomname } = socket.data;

        io.to(roomname).emit("message", { // Sends to everybody in the room the message
            username: username,
            content: msg
        });
    });

    socket.on("disconnect", () => {
        const { username, roomname } = socket.data;

        if (!Object.hasOwn(currentRooms, roomname)) return;

        const userIndex = currentRooms[roomname].users.indexOf(username);
        currentRooms[roomname].users.splice(userIndex, 1); // Removes the user from the list

        if (currentRooms[roomname].users.length <= 0) { // If there's any user on the room
            delete currentRooms[roomname];
        } else {
            io.to(roomname).emit("user_left", username); // Warns everybody that someone has left the room
        }
    });
});

function getLocalIPAddress() { // Function that returns the Local/LAN IPv4 Address through the NodeJS's built-in "os" module.
    const interfaces = networkInterfaces();

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === "IPv4" && !iface.internal) { // Gets only the IPv4 and "external" ones.
                return iface.address;
            }
        }
    }

    return "localhost";
}

httpServer.listen(8080, () => {
    console.log("Server is running:")
    console.log("- Listening on http://localhost:8080");
    console.log(`- Listening on http://${getLocalIPAddress()}:8080`);
    console.log("- Listening on ws://localhost:8080");
    console.log(`- Listening on ws://${getLocalIPAddress()}:8080`);
});
