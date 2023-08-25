import asyncHandler from "express-async-handler"


function createToken(payload) { // payload ==> the object which will be encrypted as a token and then will be verified to get data for the logged in user from it
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFE_TIME })
}

export const login = asyncHandler(async (req, res) => {
	res.send("login")
})
