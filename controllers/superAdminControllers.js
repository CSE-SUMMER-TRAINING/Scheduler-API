import asyncHandler from "express-async-handler"
import db from "../dataBase/connect.js"
export const createVote = asyncHandler(async (req, res, next) => {
	// req ==> list of days ====> days table in the database
	const loggedInUsr = req.user

	if (req.user.priority != 0) throw new Error("You are not authorized to create votes")

	const {
		neededHallObservers, // عدد الملاحظين لليوم
		neededFloorObservers, // عدد مراقبى الدور لليوم
		neededBuildingObservers, // عدد مراقبى المبنى لليوم
		hallObserversWorkDays, // عدد الايام المطلوبة للملاحظين
		floorObserversWorkDays, //عدد الايام المطلوبة لمراقب الدور
		buildingObserversWorkDays, // عدد الايام المطلوبة لمراقب
		daysList,
		start
	} = req.body
	// validate each item here and make sure there is no already any vote is running
	//...
	// continue coding

	try {
		// days for each priority selection
		const [data] = await db.query(`INSERT INTO vote VALUES (? ,? ,? ,?)`, [
			8849, //just dummy id
			hallObserversWorkDays,
			floorObserversWorkDays,
			buildingObserversWorkDays,
		])
		let id = 99 // just dummy id
		// insert each day in the list with the specified data
		// we need to make the id auto increment
		for (let dayDate of daysList) {
			console.log(dayDate)
			await db.query(`INSERT INTO days VALUES (? ,? ,? ,? ,?)`, [
				id++,
				dayDate,
				neededHallObservers,
				neededFloorObservers,
				neededBuildingObservers,
			])
		}
		// send notification to all taskers about this vote
		res.json(data)
	} catch (err) {
		throw new Error(`vote creation falid ${err}`)
	}
})
/**
 * 
 * 
 * 1- database
 * 2- notification
 * 3- validation
 * 
 */