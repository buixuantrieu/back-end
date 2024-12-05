import { Server } from "socket.io";

let io: Server;
const userSocket: { [userId: string]: string[] } = {};
export function setupSocketServer(server: any): Server {
  io = new Server(server, {
    cors: {
      origin: process.env.URL_FRONTEND_SOCKET,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
  });

  io.on("connection", (socket: any) => {
    socket.on("login", (userId: string) => {
      if (!userSocket[userId]) {
        userSocket[userId] = [];
      }
      userSocket[userId].push(socket.id);
    });
    socket.on("disconnect", () => {
      for (const userId in userSocket) {
        const index = userSocket[userId].indexOf(socket.id);
        if (index !== -1) {
          userSocket[userId].splice(index, 1);
          return;
        }
      }
    });
  });
  return io;
}
export const sendVerifySuccess = (
  userId: string,
  data: { accessToken: string; refreshToken: string; role: number }
) => {
  const socketIds = userSocket[userId];
  if (socketIds && socketIds.length > 0) {
    socketIds.forEach((socketId) => {
      io.to(socketId).emit("verifySuccess", data);
    });
  }
};
