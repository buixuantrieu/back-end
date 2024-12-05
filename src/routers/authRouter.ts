import express from "express";
import authController from "@controllers/authController";

const router = express.Router();

router.post("/register", authController.register);
router.get("/expiry-time", authController.getExpiryTime);
router.post("/verify", authController.verify);

export default router;
