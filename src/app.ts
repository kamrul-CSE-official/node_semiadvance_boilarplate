import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";

import authRouters from "./app/routers/auth.routers";

const app = express();

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message:
    "Sorry, you have exceeded the request limit. Please try again later after some times.",
});

// Middleware setup
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/v1", (req, res) => {
  res.send("Real chat💬");
});

app.use("/api/v1/auth", limiter, authRouters);

export default app;
