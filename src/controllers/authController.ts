import { validateRegister } from "@utils/validates";
import { Request, Response } from "express";
import { fetchExpiryTime, registerUser, verifyAccount } from "services/authService";
import { sendVerifySuccess } from "sockets/socket";
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
      res.status(201).json({ message: "Register user successfully!", data: result.user });
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
}
