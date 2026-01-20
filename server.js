import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import mongoose from "mongoose";
import app from "./app.js";

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("CONNECTED!"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port : ${PORT}...`);
});
