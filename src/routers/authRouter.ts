import express from "express";
import authController from "@controllers/authController";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/expiry-time", authController.getExpiryTime);
router.post("/verify", authController.verify);
router.post("/refresh", authController.refreshToken);

export default router;
