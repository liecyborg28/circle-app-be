import express from "express";
import { uploads } from "../utils/multer";
import { authenticate } from "../middlewares/auth";
import { handleGetProfile, handleUpdateProfile } from "../controllers/profile";

const router = express.Router();

router
  .route("/")
  .get(authenticate, handleGetProfile)
  .patch(authenticate, uploads.single("image"), handleUpdateProfile);

export { router as default, router };
