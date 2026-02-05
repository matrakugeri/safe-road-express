import express from "express";
import {
  register,
  login,
  loginLimiter,
  protect,
  isLoggedIn,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(loginLimiter, login);
router.route("/logout").get(logout);
router.route("/me").get(protect, isLoggedIn);

export default router;
