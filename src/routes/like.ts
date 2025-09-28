import express from "express";
import { uploads } from "../utils/multer";
import { authenticate } from "../middlewares/auth";
import {
  handleCreateLike,
  handleDeleteLike,
  handleGetLikes,
} from "../controllers/like";

const router = express.Router();

router.post("/", authenticate, uploads.single("image"), handleCreateLike);
router.get("/:id", authenticate, handleGetLikes);
router.delete("/:id/delete", authenticate, handleDeleteLike);

export { router as default, router };
