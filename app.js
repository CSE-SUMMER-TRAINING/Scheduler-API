import express from "express";
import db from "./dataBase/connect.js";
import userRoute from './routes/userRoutes.js';
import { notFound, errorHandler } from "./middleWare/ErrorHandling.js"


const app = express();
const Port = process.env.PORT;
app.use(express.json())

app.get("/", async (req, res) => {
	// const [data] = await db.query(
	// 	"insert into employees values (2 ,'ahmed','doctor','electronics','b1','a@gmail','123',0)"
	// )
	const [data] = await db.query("select * from employees")
	res.send(data)
})

app.use("/api/user", userRoute)
app.use(notFound)
app.use(errorHandler)


const start = () => {
	if (!db) {
		console.log("ERROR : database is not connected");
		return;
	}
	app.listen(Port, () => console.log(`app listening on port ${Port}...........`));
};

start();