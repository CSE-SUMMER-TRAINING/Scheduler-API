import express from "express"
import { createVote, isVote,fetchVotes} from "../controllers/superAdminControllers.js"

const router = express.Router()

router.route("/createVote").post(createVote)
router.route("/isVote").get(isVote)
router.route("/fetchVotes").get(fetchVotes)

export default router
