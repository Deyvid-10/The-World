import {Server} from "socket.io"
import jwt from "jsonwebtoken"

import { Model } from "../models/mysql/model.js"; 

export default function webSocket(server, corsOptions){
    const io = new Server(server, {
    cors:corsOptions,
})

io.on("connection", (socket) => {
    const cookieToken  = socket.handshake.headers.cookie; 
    let userTransmitter = 0
    if(cookieToken){
        const {users_id: id} = jwt.verify(cookieToken.substring(18), "SECRET_PASSWORD")
        userTransmitter = id
    }

    socket.on("joinChat",  (data) => {
        const { userReceiver } = data;
        let chatId = userTransmitter + "*" + userReceiver
        
        socket.join(chatId); 
    });

    
  console.log("User conected:", socket.id);

  socket.on("chatMessage", async (data) => {
    const { userReceiver, message } = data;
    let chatId = userTransmitter + "*" + userReceiver
    
    try {
        await Model.insertMessage(userTransmitter, userReceiver, message)
    } catch (err) {
        console.error("Error saving the message:", err);
    }
    io.to(chatId).emit("chatMessage", {userReceiver, message});
  });

  socket.on("disconnect", () => {
    console.log("User disconected:", socket.id);
  });
});

return io
}