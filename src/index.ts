import express from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";

import authRouter from "./routers/authRouter";

const app = express();
const PORT = process.env.PORT || 8080;
app.use(
  cors({
    origin: "*",
    methods: "GET,POST",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);

app.listen(8080, "0.0.0.0", () => {
  console.log(`Server is running on http://192.168.1.10:${PORT}`);
});
