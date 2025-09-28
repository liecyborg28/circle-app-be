import express from "express";
import { uploads } from "../utils/multer";
import { authenticate } from "../middlewares/auth";
import {
  handleCreateThread,
  handleGetThreadDetails,
  handleGetThreads,
} from "../controllers/thread";

const router = express.Router();

router
  .route("/")
  .get(authenticate, handleGetThreads)
  .post(authenticate, uploads.single("image"), handleCreateThread);

router.get("/:id", authenticate, handleGetThreadDetails);

export { router as default, router };
