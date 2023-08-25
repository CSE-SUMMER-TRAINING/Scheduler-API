import express from "express";
import { login, main } from "../controllers/userControllers.js";
import { protect } from "../middleWare/authentication.js";

const router = express.Router();

router.route('/login').post(login);
router.route('/main').get(protect, main);

export default router;