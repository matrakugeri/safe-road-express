import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { rateLimit } from "express-rate-limit";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      message: "Too many requests, try again later",
    });
  },
});

export const register = catchAsync(async (req, res, next) => {
  if (!req.body) return next(new AppError("No request body was provided", 400));

  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  };

  const newUser = await User.create(user);
  const jwt = signToken(newUser.id);
  console.log(newUser, jwt);

  newUser.password = undefined;
  res.status(201).json({
    data: newUser,
    token: jwt,
    status: "success",
    message: "User was successfully created",
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  const jwt = signToken(user.id);
  user.password = undefined;
  res.status(200).json({
    status: "success",
    token: jwt,
    data: {
      user,
    },
  });
});

export const protect = catchAsync(async (req, res, next) => {
  const authorization = req.headers.authorization;
});
