import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { rateLimit } from "express-rate-limit";

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);

app.get("/api/v1", (req, res) => {
  res.send("Real chat💬");
});

export default app;
