import prisma from "@prismaClient";

const getSingleUserByEmail = (email: string) => {
  const user = prisma.user.findFirst({
    where: {
      email,
    },
  });
  return user;
};

const getUserInfo = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
    include: {
      Profile: true,
    },
  });
  return user;
};

export { getSingleUserByEmail, getUserInfo };
