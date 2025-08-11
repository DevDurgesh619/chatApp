import { WebSocketServer ,WebSocket} from "ws";
const wss = new WebSocketServer({port:8080});
let userCount = 0;
//allSockets without room logic
/*
let allSocket :WebSocket[]= [];
wss.on("connection",(socket)=>{
    allSocket.push(socket);
    userCount++
    console.log("user connected #" + userCount)
    socket.on("message",(event)=>{
        console.log("msg recived " + event.toString());
        for(let i =0 ;i < allSocket.length;i++){
            const s:any = allSocket[i];
            s.send(event.toString() + ":sent from the server")
        }
       
    })
    socket.on("disconnect",()=>{
        allSocket= allSocket.filter(x=> x !=socket);
    })
})
)*/
//all sockets with room logic msg only send to same room users
interface User{
    socket:WebSocket,
    room:String
}
let allSockets :User[]=[]
wss.on("connection",(socket)=>{
    socket.on("message",(message)=>{
        const parsedMessage= JSON.parse(message as unknown as string);
        if(parsedMessage.type==="join"){
            allSockets.push({
                socket,
                room:parsedMessage.payload.roomId
            })
        }
        if(parsedMessage.type==="chat"){
            const currentUserRoom = allSockets.find((x)=>x.socket == socket )?.room
            for(let i=0;i<allSockets.length;i++){
                if(allSockets[i]?.room==currentUserRoom){
                    allSockets[i]?.socket.send(parsedMessage.payload.message)
                }
            }
        }
    })
})