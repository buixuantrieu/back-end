import { validateRegister } from "@utils/validates";
import { Request, Response } from "express";
import { fetchExpiryTime, loginUser, registerUser, updateAccessToken, verifyAccount } from "services/authService";
import { sendVerifySuccess } from "sockets/socket";
import jwt from "jsonwebtoken";
export default class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, userName } = req.body;
      const validate = validateRegister({ email, password, userName });
      if (!validate) {
        res.status(400).json({ message: "Invalid data" });
        return;
      }
      const result = await registerUser({ email, password, userName });
      if (result.errors) {
        res.status(409).json({ message: result.errors });
        return;
      }
      res.status(201).json({ message: "Register user successfully!", data: { email: result.user.email } });
    } catch (e) {
      console.log(e);
    }
  }
  static async login(req: Request, res: Response) {
    try {
      const { password, userName } = req.body;
      const isLogin = await loginUser({ userName, password });

      if (isLogin) {
        res.status(201).json({ message: "Login user successfully!", data: isLogin });
      } else {
        res.status(404).json({ message: "Sai tài khoản hoặc mật khẩu!" });
      }
    } catch (e) {
      console.log(e);
    }
  }
  static async getExpiryTime(req: Request, res: Response) {
    try {
      const { email } = req.query;
      const result = await fetchExpiryTime(email as string);
      if (result) {
        res.status(200).json({ message: "Get single user success!", data: { ...result } });
        return;
      } else {
        res.status(404).json({ message: "No data available for the given query" });
        return;
      }
    } catch (e) {}
  }
  static async verify(req: Request, res: Response) {
    try {
      const { email, verifyCode } = req.body;
      const result = await verifyAccount({ email, verifyCode });
      if (!result) {
        res.status(400).json({ message: "Mã OTP sai!" });
        return;
      } else {
        sendVerifySuccess(result.user.id, {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          role: result.user.role,
        });
        res.status(201).json({
          message: "Verification account successfully!",
          data: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            role: result.user.role,
          },
        });
        return;
      }
    } catch (e) {}
  }
  static async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token is required" });
      return;
    }
    try {
      const refresh = await updateAccessToken(refreshToken);
      if (refresh) {
        res.status(201).json({ accessToken: refresh.accessToken });
      } else {
        res.status(400).json({ message: "Refresh token is required" });
      }
    } catch (error) {
      res.status(403).json({ message: "Invalid or expired refresh token" });
      return;
    }
  }
}
