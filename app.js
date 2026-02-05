import express from "express";
import cors from "cors";
const app = express();
import userRouter from "./routes/userRoutes.js";
import globalErrorHandler from "./controllers/errorController.js";
import cookieParser from "cookie-parser";

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  }),
);
app.use("/api/v1/users", userRouter);
app.use(globalErrorHandler);

export default app;
