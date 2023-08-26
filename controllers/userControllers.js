import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import db from "../dataBase/connect.js";
import bycrpt from "bcryptjs";
import { loginCheck } from "../middleWare/validate.js";
import { isPositiveInteger, isString } from "validate-datatypes";
import validator from "email-validator";

const createToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFE_TIME });
};

export const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await loginCheck(email, password);

		const id = new Date().getDate();
		const token = createToken({ user, id });

		res.cookie("jwt", token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
		if (user.priority == 0) {
			res.cookie("key", password, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
		}
		else {
			res.cookie("key", null, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
		}

		res.status(200).json({ user, token });
	}
	catch (err) {
		res.status(400).json({ error: err.message });
	}
});

export const register = asyncHandler(async (req, res) => {
	const user = {};
	user.employeeId = req.body.employeeId;
	user.empoyeeName = req.body.empoyeeName;
	user.jobTitle = req.body.jobTitle;
	user.department = req.body.department;
	user.building = req.body.building;
	user.email = req.body.email;
	user.password = await bycrpt.hash(req.body.password, 10);
	user.priority = req.body.priority;

	// validation
	if (!isPositiveInteger(+user.employeeId)) {
		throw Error("Invalid employee ID");
	}
	if (!isString(user.empoyeeName)) {
		throw Error("Employee name must be string");
	}
	if (!validator.validate(user.email)) {
		throw Error('Invalid email');
	}

	const [emp] = await db.query('SELECT * FROM employees WHERE email = ?', user.email);
	if (emp.length) {
		throw Error("Email is used");
	}

	if (+user.priority < 0 || +user.priority > 3) {
		throw Error("Invalid priority");
	}

	try {
		const [data] = await db.query(`insert into employees values (?, ? ,?, ?, ?,? , ?, ? )`, [
			user.employeeId,
			user.empoyeeName,
			user.jobTitle,
			user.department,
			user.building,
			user.email,
			user.password,
			user.priority,
		]);
		
		res.status(200).json({ user });
	}
	catch (err) {
		throw new Error(`registration failed ${err}`);
	}
});

export const main = (req, res) => {
	res.send('main page');
};