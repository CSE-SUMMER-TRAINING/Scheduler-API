import mysql from "mysql2/promise"

let db
try {
	const pool = mysql.createPool({
		host: "db4free.net",
		user: "modessam",
		password: "YE!5D8#8R*tyeYR",
		database: "schedulerdb4",
	})
	db = await pool.getConnection()
} catch (err) {
	console.log(err)
}

export default db
