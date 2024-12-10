import express from "express";
import userController from "@controllers/userController";
import { authenticateUser } from "middlewares/authenticateUser";

const router = express.Router();
router.get("/user-info", authenticateUser, userController.userInfo);

export default router;
