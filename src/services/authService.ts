import prisma from "@prismaClient";
import { randomOTP } from "@utils/randomNumber";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import { IRegister } from "types/interfaces";
import { sendMailRegister } from "@utils/sendMail";

const salt = bcrypt.genSaltSync(10);

const checkEmailExists = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  return user;
};
const checkUserNameExists = async (userName: string) => {
  const user = await prisma.user.findFirst({
    where: {
      userName,
    },
  });
  return user;
};
const createAccessToken = async (data: { id: string }) => {
  const accessToken = jwt.sign(data, process.env.PRIMARY_KEY_ACCESS_TOKEN as string, { expiresIn: "1h" });
  return accessToken;
};
const createRefreshToken = async (data: { id: string }) => {
  const refreshToken = jwt.sign(data, process.env.PRIMARY_KEY_REFRESH_TOKEN as string, { expiresIn: "7d" });
  return refreshToken;
};

const registerUser = async ({ email, userName, password }: IRegister) => {
  const errors: { email?: string; userName?: string } = {};

  if (await checkEmailExists(email)) {
    errors.email = "Email đã tồn tại!";
  }
  if (await checkUserNameExists(userName)) {
    errors.userName = "Tên tài khoản đã tồn tại!";
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  }
  const id = uuid();
  const hashPassword = bcrypt.hashSync(password, salt);
  const verifyCode = randomOTP();
  const verifyExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const user = await prisma.user.create({
    data: {
      id,
      email,
      userName,
      password: hashPassword,
      verifyCode,
      verifyExpiresAt,
    },
  });
  await sendMailRegister(email, verifyCode);
  return { user };
};

export { registerUser };
