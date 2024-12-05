import { Request, Response } from "express";
import { getSingleUserByEmail } from "services/userService";

export default class userController {
  static async userVerify(req: Request, res: Response) {
    try {
      const { email } = req.query;
      const user = await getSingleUserByEmail(email as string);
      if (user) {
        res.status(200).json({ message: "Get single user success!", data: user });
      } else {
        res.status(404).json({ message: "No data available for the given query" });
      }
    } catch (e) {
      console.log(e);
    }
  }
}
