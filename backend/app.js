import express, {static as static_} from 'express';
import http from 'http'
import { createRouter } from './routes/route.js';
import cors from 'cors'
import cookieParser from "cookie-parser";
import webSocket from './sockets/socket.js';

// instance for express app
const app = express()
// creating server for chat live
const server = http.createServer(app)

// Configuring the cors for permisions
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "DELETE", "PUT"],
    // allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}

app.use(cors(corsOptions))

// Disabled that this API is created by express
app.disable('x-powered-by')
// Middleware for parse JSON
app.use(express.json())

// serving the public file for multimedia
app.use(static_('public'))

// Use cookie from the cliente
app.use(cookieParser())

// All the routes and logic for de api
app.use('/', createRouter())


// logic por webSocket
webSocket(server, corsOptions )



const PORT = process.env.PORT ?? 3000;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})