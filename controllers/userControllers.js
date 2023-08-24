import asyncHandler from "express-async-handler"

export const login = asyncHandler(async (req, res) => {
	res.send("login")
})
