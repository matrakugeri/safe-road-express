import express from "express";
import cors from "cors";
const app = express();
import userRouter from "./routes/userRoutes.js";

app.use(express.json());
app.use(cors());

app.use("/api/v1/users", userRouter);

export default app;
