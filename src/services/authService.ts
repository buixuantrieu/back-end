import prisma from "@prismaClient";
import { randomOTP } from "@utils/randomNumber";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import { IRegister, IUpdateStatusUser, IVerifyAccount } from "types/interfaces";
import { sendMailRegister } from "@utils/sendMail";
import { STATUS_USER } from "types/enum";

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
const updateStatusUser = async ({ id, status }: IUpdateStatusUser) => {
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
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

const fetchExpiryTime = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      status: STATUS_USER.UNVERIFIED,
    },
  });
  if (user) {
    return {
      expiryTime: user.verifyExpiresAt,
      userId: user.id,
    };
  }
  return false;
};

const verifyAccount = async ({ email, verifyCode }: IVerifyAccount) => {
  const user = await checkEmailExists(email);
  if (user) {
    if (user.verifyCode === verifyCode) {
      await updateStatusUser({ id: user.id, status: STATUS_USER.ACTIVATED });
      await prisma.profile.create({
        data: {
          userId: user.id,
        },
      });
      const accessToken = await createAccessToken({ id: user.id });
      const refreshToken = await createRefreshToken({ id: user.id });
      return {
        accessToken,
        refreshToken,
        user,
      };
    } else {
      return false;
    }
  } else {
    return false;
  }
};
const deleteUserUnVerify = async () => {
  await prisma.user.deleteMany({
    where: {
      verifyExpiresAt: {
        lt: new Date(),
      },
      status: STATUS_USER.UNVERIFIED,
    },
  });
};
export { registerUser, fetchExpiryTime, verifyAccount, deleteUserUnVerify };
