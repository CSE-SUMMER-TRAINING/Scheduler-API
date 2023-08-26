import asyncHandler from "express-async-handler";
import db from "../dataBase/connect.js";
import { isPositiveInteger, isArray } from "validate-datatypes";
import isValidDate from "validate-date";
import nodemailer from "nodemailer";

export const createVote = asyncHandler(async (req, res, next) => {
	// req ==> list of days ====> days table in the database
	const loggedInUsr = req.user;

	if (loggedInUsr.priority != 0) throw new Error("You are not authorized to create votes");

	const {
		voteName,
		neededHallObservers, // عدد الملاحظين لليوم
		neededFloorObservers, // عدد مراقبى الدور لليوم
		neededBuildingObservers, // عدد مراقبى المبنى لليوم
		hallObserversWorkDays, // عدد الايام المطلوبة للملاحظين
		floorObserversWorkDays, //عدد الايام المطلوبة لمراقب الدور
		buildingObserversWorkDays, // عدد الايام المطلوبة لمراقب
		daysList,
		duration,
	} = req.body;

	if (
		!isPositiveInteger(+neededHallObservers) ||
		!isPositiveInteger(+neededFloorObservers) ||
		!isPositiveInteger(+neededBuildingObservers)
	) {
		throw Error("Number of observers must be an integer > 0");
	}
	if (
		!isPositiveInteger(+floorObserversWorkDays) ||
		!isPositiveInteger(+buildingObserversWorkDays)
	) {
		throw Error("Number of work days must be an integer > 0");
	}
	if (!isPositiveInteger(+duration)) {
		throw Error("Vote duration must be an integer > 0");
	}
	if (!isArray(daysList)) {
		throw Error("The list of days is required");
	}
	daysList.forEach((date) => {
		if (!isValidDate(date, "boolean")) {
			throw Error("Invalid dates");
		}
	});

	const [vote] = await db.query("SELECT * FROM vote");
	if (vote.length) {
		return res.json({
			hasVote: true,
			startTime: vote[0].start_time,
			duration: vote[0].duration_in_hours,
		});
	}

	try {
		// days for each priority selection
		const [data] = await db.query(
			`INSERT INTO vote (vote_id,hall_observers_work_days,floor_observers_work_days,building_observers_work_days,duration_in_hours, vote_title ) VALUES (? ,? ,? ,?,?, ?)`,
			[
				5, //just dummy id
				hallObserversWorkDays,
				floorObserversWorkDays,
				buildingObserversWorkDays,
				duration,
				voteName,
			]
		);

		let id = 6; // just dummy id

		// insert each day in the list with the specified data
		for (let dayDate of daysList) {
			await db.query(`INSERT INTO days VALUES (? ,? ,? ,? ,?)`, [
				id++,
				dayDate,
				neededHallObservers,
				neededFloorObservers,
				neededBuildingObservers,
			]);
		}

		// send notification to all taskers about this vote
		const transporter = nodemailer.createTransport({
			service: "hotmail",
			auth: {
				user: loggedInUsr.email,
				pass: req.cookies.key,
			},
		});

		const [employees] = await db.query("SELECT * FROM employees");
		employees.forEach(employee => {
			if (employee.email !== loggedInUsr.email) {
				const mailOptions = {
					from: loggedInUsr.email,
					to: employee.email,
					subject: voteName,
					text: "New vote is created",
				};

				transporter.sendMail(mailOptions, (error) => {
					if (error) {
						throw Error("Email is not sent");
					}
					else {
						res.json({ msg: "Email is sent", data });
					}
				});
			}
		});
	}
	catch (err) {
		throw new Error(`vote creation falid ${err}`);
	}
});

function hoursBetweenDates(startDate, endDate) {
	const millisecondsPerHour = 1000 * 60 * 60;
	const elapsedTime = endDate - startDate;
	const hours = elapsedTime / millisecondsPerHour;
	return hours;
}
export const isVote = asyncHandler(async (req, res, next) => {
	const [vote] = await db.query("SELECT * FROM vote");
	console.log(vote);
	if (vote.length) {
		const currentDateTime = new Date();
		console.log(currentDateTime);
		let x = hoursBetweenDates(vote[0].start_time, currentDateTime);
		console.log(x);
		if (x > vote[0].duration_in_hours) {
			db.query("DELETE FROM vote");
			return res.json({ hasVote: false });
		}
		return res.json({
			hasVote: true,
			startTime: vote[0].start_time,
			duration: vote[0].duration_in_hours,
		});
	} else res.json({ hasVote: false });
});

export const fetchVotes = asyncHandler(async (req, res, next) => {



});
