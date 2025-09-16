import express from "express";
import { default as authRouter } from "./auth";

const app = express();

// bikin router utama untuk versi API
const router = express.Router();
const version = "v1";

router.use("/auth", authRouter);

router.use(`/api/${version}`, router);

export default router;
