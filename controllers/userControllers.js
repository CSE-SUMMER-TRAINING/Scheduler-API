import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { loginCheck } from "../middleWare/validate.js";

const createToken = (payload) => {
	// payload ==> the object which will be encrypted as a token and then will be verified to get data for the logged in user from it
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFE_TIME });
};

export const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await loginCheck(email, password);

		const id = new Date().getDate();
        const token = createToken({ user, id });
		res.cookie('jwt', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

        res.status(200).json({ user, token });
	}
	catch (err) {
		res.status(400).json({ error: err.message });
	}
});

export const main = (req, res) => {
	res.send('main page');
};