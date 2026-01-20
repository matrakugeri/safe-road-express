import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "An user must have a first name"],
  },
  lastName: {
    type: String,
    required: [true, "An user must have a last name"],
  },
  email: {
    type: String,
    required: [true, "An user must have an email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
