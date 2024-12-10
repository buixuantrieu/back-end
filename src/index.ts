import express from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";

import authRouter from "@routers/authRouter";
import userRouter from "@routers/userRouter";
import { setupSocketServer } from "sockets/socket";
import cron from "node-cron";
import { deleteUserUnVerify } from "services/authService";

const app = express();
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
setupSocketServer(server);
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
app.use("/api/v1/user", userRouter);

cron.schedule("*/3 * * * *", async () => {
  try {
    await deleteUserUnVerify();
  } catch (error) {
    console.log(error);
  }
});

server.listen(8080, "0.0.0.0", () => {
  console.log(`Server is running on http://192.168.1.10:${PORT}`);
});
