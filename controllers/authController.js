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

  const existingUser = User.findOne({ email: user.email });
  if (existingUser)
    return next(new AppError("User with this email already exists", 403));

  const newUser = await User.create(user);
  const token = signToken(newUser.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000,
    ),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  };

  const hintCookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000,
    ),
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
  };

  res.cookie("jwt", token, cookieOptions);
  res.cookie("auth_hint", true);

  newUser.password = undefined;
  res.status(201).json({
    data: {
      user: newUser,
    },
    status: "success",
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
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000,
    ),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(new AppError(`You are not logged in ,Please log in!`, 401));

  // Verify the token signature.
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Check if the user still exist after the token was issued
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(`The token belonging to user does no longer exist`, 401),
    );
  }
  req.user = currentUser;
  next();
});

export const isLoggedIn = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError(`You are not logged in`, 401));
  return res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const logout = catchAsync(async (req, res, next) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.clearCookie("auth_hint", {
    httpOnly: false,
    secure: process.env.NODE_env === "production",
    path: "/",
  });

  res.status(200).json({
    message: "Successfully logged out",
  });
});
