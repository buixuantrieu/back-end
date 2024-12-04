import { z } from "zod";

const schemaRegister = z.object({
  userName: z
    .string()
    .trim()
    .min(5)
    .max(20)
    .regex(/^\S*$/, "Tên đăng nhập không được chứa khoảng trắng!")
    .regex(/^[a-z0-9]*$/, "Tên đăng nhập gồm chữ thường và số!"),
  email: z.string().min(1).max(100).email(),
  password: z
    .string()
    .min(8)
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, "Mật khẩu yếu!"),
});

const validateRegister = (data: any) => {
  try {
    const validatedRegister = schemaRegister.parse(data);
    return validatedRegister;
  } catch (error) {
    return false;
  }
};

export { validateRegister };
