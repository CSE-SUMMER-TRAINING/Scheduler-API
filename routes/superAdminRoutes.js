import express from "express"
import { createVote } from "../controllers/superAdminControllers.js"

const router = express.Router()

router.route("/createVote").post(createVote)

export default router
