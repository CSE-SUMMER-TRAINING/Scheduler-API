import express from "express";
import db from "./dataBase/connect.js";
import cookieParser from "cookie-parser";
import userRoute from './routes/userRoutes.js';
import superAdminRoute from './routes/superAdminRoutes.js';
import { notFound, errorHandler } from "./middleWare/ErrorHandling.js"
import { protect } from "./middleWare/authentication.js"
import { Server } from "socket.io"
import http from "http"
import cors from "cors"
import { Socket } from "dgram"

const app = express()
const Port = process.env.PORT

app.use(cors({ origin: "http://localhost:3000" }))
const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST"],
	},
})

app.use(express.json())
app.use(cookieParser())

app.get("/", async (req, res) => {
	const [data] = await db.query("select * from employees")
	res.send(data)
})

app.use("/api/user", userRoute)  // http://localhost:5000/api/user
app.use("/api/superAdmin", protect, superAdminRoute)
app.use(notFound)
app.use(errorHandler)

io.on("connection", (socket) => {
	console.log(`user connected: ${socket.id}`)
	socket.on("sendMessage", (data) => {
		console.log(data)
		// socket.to(data.room).emit("receiveMessage", data)
	})
	socket.on("chooseDay", (data) => {
		console.log(data)

		// dasfdfafda

		let ff = "ررgas"
		socket.emit("done", ff)
	})
})

const start = () => {
	if (!db) {
		console.log("ERROR : database is not connected")
		return
	}
	server.listen(Port, () => console.log(`app listening on port ${Port}...........`))
}

start();