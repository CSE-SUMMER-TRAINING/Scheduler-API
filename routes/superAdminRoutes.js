import express from "express"
import { createVote, isVote } from "../controllers/superAdminControllers.js"

const router = express.Router()

router.route("/createVote").post(createVote)
router.route("/isVote").get(isVote)

export default router
