import asyncHandler from "express-async-handler";
import db from "../dataBase/connect.js";
import { isPositiveInteger, isArray } from "validate-datatypes";
import isValidDate from "validate-date";
import nodemailer from "nodemailer";

export const createVote = asyncHandler(async (req, res, next) => {
	// req ==> list of days ====> days table in the database
	const loggedInUsr = req.user;

	if (req.user.priority != 0) throw new Error("You are not authorized to create votes");

	const {
		neededHallObservers, // عدد الملاحظين لليوم
		neededFloorObservers, // عدد مراقبى الدور لليوم
		neededBuildingObservers, // عدد مراقبى المبنى لليوم
		hallObserversWorkDays, // عدد الايام المطلوبة للملاحظين
		floorObserversWorkDays, //عدد الايام المطلوبة لمراقب الدور
		buildingObserversWorkDays, // عدد الايام المطلوبة لمراقب
		daysList,
		duration,
	} = req.body;

	if (!isPositiveInteger(+neededHallObservers) || !isPositiveInteger(+neededFloorObservers) || !isPositiveInteger(+neededBuildingObservers)) {
		throw Error("Number of observers must be an integer > 0");
	}
	if (!isPositiveInteger(+floorObserversWorkDays) || !isPositiveInteger(+buildingObserversWorkDays)) {
		throw Error("Number of work days must be an integer > 0");
	}
	if (!isPositiveInteger(+duration)) {
		throw Error("Vote duration must be an integer > 0");
	}
	if (!isArray(daysList)) {
		throw Error("The list of days is required");
	}
	daysList.forEach(date => {
		if (!isValidDate(date, "boolean")) {
			throw Error("Invalid dates");
		}
	});

	const [vote] = await db.query('SELECT * FROM vote');
	if (vote.length) {
		throw Error("The current voting is not over yet");
	}

	try {
		// days for each priority selection
		const [data] = await db.query(
			`INSERT INTO vote (vote_id,hall_observers_work_days,floor_observers_work_days,building_observers_work_days,duration_in_hours) VALUES (? ,? ,? ,?,?)`,
			[
				8865, //just dummy id
				hallObserversWorkDays,
				floorObserversWorkDays,
				buildingObserversWorkDays,
				duration,
			]
		);
		let id = 200; // just dummy id
		// insert each day in the list with the specified data
		// we need to make the id auto increment
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
			service: 'hotmail',
			auth: {
				user: '',
				pass: ''
			}
		});

		const mailOptions = {
			from: '',
			to: '',
			subject: '',
			text: ''
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				throw Error("Email is not sent");
			}
			else {
				res.json({ msg: 'Email is sent', data });
			}
		});

	}
	catch (err) {
		throw new Error(`vote creation falid ${err}`);
	}
});