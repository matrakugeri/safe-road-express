import express from "express";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

export const register = async (req, res, next) => {
  try {
    if (!req.body)
      res.status(404).json({
        status: "fail",
        message: "No request body was sent",
      });
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
  } catch (err) {
    console.log(err);
  }
};

export const login = (req, res, next) => {
  const user = req.body;
  console.log(user);
};
