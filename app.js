import express from "express";
import cors from "cors";
const app = express();
import userRouter from "./routes/userRoutes.js";
import globalErrorHandler from "./controllers/errorController.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  }),
);
app.use(
  session({
    secret: "safe-road-security-app-secret-for-better-security",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://matrakugeri_db_user:9rJicVuUW99mXwZm@safe-road.tdwnayc.mongodb.net/safe-road?appName=safe-road",
      collectionName: "sessions",
      ttl: 24 * 60 * 60,
    }),
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
  }),
);
app.use("/api/v1/users", userRouter);
app.use(globalErrorHandler);

export default app;
