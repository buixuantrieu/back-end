import prisma from "@prismaClient";

const getSingleUserByEmail = (email: string) => {
  const user = prisma.user.findFirst({
    where: {
      email,
    },
  });
  return user;
};


export { getSingleUserByEmail };
