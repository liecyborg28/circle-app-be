import express from "express";
import { uploads } from "../utils/multer";
import { authenticate } from "../middlewares/auth";
import { handleCreateThread, handleGetThreads } from "../controllers/thread";

const router = express.Router();

router
  .route("/")
  .get(authenticate, handleGetThreads)
  .post(authenticate, uploads.single("image"), handleCreateThread);

export { router as default, router };
