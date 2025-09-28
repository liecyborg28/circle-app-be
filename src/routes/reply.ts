import express from "express";
import { uploads } from "../utils/multer";
import { authenticate } from "../middlewares/auth";
import { handleCreateReply, handleGetReplies } from "../controllers/reply";

const router = express.Router();

router
  .route("/")
  .post(authenticate, uploads.single("image"), handleCreateReply);

router.get("/:id", authenticate, handleGetReplies);

export { router as default, router };
