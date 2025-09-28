import express, { Request, Response, NextFunction } from "express";
import { corsMiddleware } from "./middlewares/cors";
import path from "path";
import limiter from "./middlewares/limiter";
import router from "./routes/routes";
import { AppError } from "./models/error";
import http from "http";
import { Server } from "socket.io";

const app = express();

app.use(limiter);

app.use(corsMiddleware);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use(router);

app.use((req, res, next) => {
  res.status(404).json({
    code: 404,
    status: "error",
    message: "Route not found",
  });
});

// middleware error handler (paling bawah)
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error("Error middleware:", err);

  res.status(err.code || 500).json({
    code: err.code || 500,
    status: "error",
    message: err.message || "Internal server error.",
  });
});

// app.listen(process.env.PORT, () => {
//   console.log(`server is running on ${process.env.PORT}`);
// });

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on ${process.env.PORT}`);
});

export { io }; // <--- ini penting
export { server };
export default app;
