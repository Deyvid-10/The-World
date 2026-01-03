import express, {static as static_} from 'express';
import http from 'http'
import { createRouter } from './routes/route.js';
import cors from 'cors'
import cookieParser from "cookie-parser";
import webSocket from './sockets/socket.js';

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "DELETE", "PUT"],
    // allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}

const app = express()
const server = http.createServer(app)

app.disable('x-powered-by')
// Middleware for parse JSON
app.use(express.json())
app.use(static_('public'))
app.use(cookieParser())


app.use(cors(corsOptions))

// WebSocket
webSocket(server, corsOptions )

app.use('/', createRouter())

const PORT = process.env.PORT ?? 3000;

server.listen(PORT, () => {
    console.log(`Server listening on port  http://localhost:${PORT}`)
})