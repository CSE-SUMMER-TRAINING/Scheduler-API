import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"

export const protect = asyncHandler(async (req, res, next) => {
	const authHeader = req.headers["authorization"]
	const token = authHeader && authHeader.split(" ")[1]
	if (!token) throw new Error("No Token provided, authentication faild")
	if (!authHeader.startsWith("Bearer ")) throw new Error("authentication faild")
	try {
		const load = jwt.verify(token, process.env.JWT_SECRET)
		req.body.user = load;
		next()
	} catch (err) {
		res.status(401)
		throw new Error(`Authentication faild error : ${err.message}`)
	}
})
