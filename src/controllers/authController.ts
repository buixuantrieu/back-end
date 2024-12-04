import { validateRegister } from "@utils/validates";
import { Request, Response } from "express";
import { registerUser } from "services/authService";
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
}
