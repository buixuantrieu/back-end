export interface IRegister {
  userName: string;
  password: string;
  email: string;
}
export interface IVerifyAccount {
  email: string;
  verifyCode: number;
}
export interface IUpdateStatusUser {
  id: string;
  status: number;
}
