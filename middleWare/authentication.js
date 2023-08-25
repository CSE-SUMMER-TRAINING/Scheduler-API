import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const protect = asyncHandler(async (req, res, next) => {
	const token = req.cookies.jwt;

	if (!token) {
		res.locals.user = null;
		next();
	}

	jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
		if (err) {
			res.locals.user = null;
			next();
		}
		else {
			const { user, id } = decodedToken;
			res.locals.user = user;
			res.locals.id = id;
			next();
		}
	});
});