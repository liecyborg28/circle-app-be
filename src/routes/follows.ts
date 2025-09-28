import express from "express";
import { authenticate } from "../middlewares/auth";
import {
  handleFollow,
  handleGetFollows,
  handleUnfollow,
} from "../controllers/follows";

const router = express.Router();

router
  .route("/")
  .get(authenticate, handleGetFollows)
  .post(authenticate, handleFollow)
  .delete(authenticate, handleUnfollow);

export { router as default, router };
