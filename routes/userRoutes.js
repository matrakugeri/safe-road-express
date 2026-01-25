import express from "express";
import {
  register,
  login,
  loginLimiter,
} from "../controllers/authController.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(loginLimiter, login);

export default router;
