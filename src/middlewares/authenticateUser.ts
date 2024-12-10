import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  userId?: string;
}
export const authenticateUser = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access token is missing" });
    return;
  }
  try {
    const user = jwt.verify(token, process.env.PRIMARY_KEY_ACCESS_TOKEN as string);
    if (typeof user !== "string" && user.id) {
      req.userId = user.id;
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Access token is invalid or expired" });
  }
};
