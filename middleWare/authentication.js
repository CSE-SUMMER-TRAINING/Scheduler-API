import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const protect = asyncHandler(async (req, res, next) => {
	const token = req.cookies.jwt;

	if (!token) {
		req.user = null;
		next();
	}

	jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
		if (err) {
			req.user = null;
			next();
		}
		else {
			const { user, id } = decodedToken;
			req.user = user;
			req.id = id;
			next();
		}
	});
});