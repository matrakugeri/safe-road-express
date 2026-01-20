import express from "express";
import User from "../models/userModel";

export const register = (req, res, next) => {
  const user = req.body;
  console.log(user);
};
