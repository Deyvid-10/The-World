import {Server} from "socket.io"
import jwt from "jsonwebtoken"

import fs from "fs/promises"
import dotenv from "dotenv";
import { Model } from "../models/mysql/model.js"; 

// environment variable source
const envFile = process.env.ENV_FILE || "./dev.env";
dotenv.config({ path: envFile });

// handling the sesions record (sesions.json)
 async function readSesions(){
    const data = await fs.readFile("data/sesions.json", "utf8");   
    
    return JSON.parse(data)
  } 

  async function writeSesions(idLogged, socketId){
    const data = await readSesions()
    const newData = data
    newData.push({"userLogged": idLogged, "socketId": socketId})
    
    await fs.writeFile('data/sesions.json', JSON.stringify(newData))
  } 

  async function deleteSesions(socketId){
    const data = await readSesions()
    
    let newData = data
    
    const newData2 = newData.filter(d=> d.socketId !== socketId)
    
    await fs.writeFile('data/sesions.json', JSON.stringify(newData2))
  } 

// handling the websocket logic, the chat logic
export default function webSocket(server, corsOptions){
  // creating the server
    const io = new Server(server, {
    cors:corsOptions,
})

// conecting with the server
io.on("connection", (socket) => {
    // catching token of the sesion for get de user id
    const cookieToken  = socket.handshake.headers.cookie; 
    let userTransmitter = 0
    if(cookieToken){
        const {users_id: id} = jwt.verify(cookieToken.substring(18), process.env.JWT_SECRET)
        userTransmitter = id
        console.log(id);
        
    }
    
    // Catching the socketid and the user connexted un that socket
    writeSesions(userTransmitter, socket.id)
    console.log("User conected:", socket.id); ////

      // Creating the chat room and notice the client for join
      socket.on("createChat",  async (data) => {
        // create the chat room and join
        const { userReceiver } = data;
        let chatId = [Number(userTransmitter), Number(userReceiver)]
        chatId.sort()
        const newChatId = chatId.join("*")
        socket.join(newChatId); 
        
        // notice the client
        const sesionData = await readSesions()
        const userConnection = sesionData.filter(d=>d.userLogged == userReceiver)
        if(userConnection && userConnection.length > 0)
        {
          io.to(userConnection[0].socketId).emit("chatCreated", {roomId: newChatId})
        }
        
    });

    // For join to the chat room
    socket.on("joinChat",  async (data) => {
        const { roomId } = data;
        
        socket.join(roomId);  
    });

    // Handling the messages
  socket.on("chatMessage", async (data) => {
    // Recibing the data
    const { userReceiver, message, userName, userProfilePhoto } = data;

    // Data permanence
    try {
        await Model.insertMessage(userTransmitter, userReceiver, message)
    } catch (err) {
        console.error("Error saving the message:", err);
    }


    // Sending message to the client in the room
    let chatId = [Number(userTransmitter), Number(userReceiver)]
    chatId.sort() 
    
    io.to(chatId.join("*")).emit("chatMessage", {userReceiver, message, roomId: chatId.join("*"), userName, userProfilePhoto, userTransmitter });
  });

  // Disconenting te socket
  socket.on("disconnect", () => {
    deleteSesions(socket.id)
    console.log("User disconected:", socket.id);
  });
});

return io
}