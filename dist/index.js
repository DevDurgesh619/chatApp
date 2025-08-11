import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });
let userCount = 0;
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type === "chat") {
            const currentUserRoom = allSockets.find((x) => x.socket == socket)?.room;
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i]?.room == currentUserRoom) {
                    allSockets[i]?.socket.send(parsedMessage.payload.message);
                }
            }
        }
    });
});
//# sourceMappingURL=index.js.map