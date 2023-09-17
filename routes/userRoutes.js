import express from "express";
import { login, main, register } from "../controllers/userControllers.js"
import { protect } from "../middleWare/authentication.js";

const router = express.Router();
 // axios.post("http://localhost:5000/api/user/login",data)
router.route('/login').post(login);
router.route("/register").post(register)
router.route('/main').get(protect, main);

export default router;