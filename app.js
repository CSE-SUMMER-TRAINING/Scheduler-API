import express from "express"
import dotenv from "dotenv"
dotenv.config()

const app = express()
const Port = process.env.PORT

app.use(express.json())

app.get("/", (req, res) => {
	res.send("start")
})

app.listen(Port, () => console.log(`app listening on port ${Port}`))
