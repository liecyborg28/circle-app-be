import express from "express";
import authRouter from "./auth";
import threadRouter from "./thread";
import replyRouter from "./reply";
import likeRouter from "./like";
import profileRouter from "./profile";
import followsRouter from "./follows";
import userRouter from "./user";

const router = express.Router();
const version = "v1";

const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/thread", threadRouter);
apiRouter.use("/reply", replyRouter);
apiRouter.use("/like", likeRouter);
apiRouter.use("/profile", profileRouter);
apiRouter.use("/follows", followsRouter);
apiRouter.use("/user", userRouter);

router.use(`/api/${version}`, apiRouter);

export default router;
