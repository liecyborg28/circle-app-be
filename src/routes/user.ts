import express from "express";
import { authenticate } from "../middlewares/auth";
import { handleGetUsers } from "../controllers/user";

const router = express.Router();

router.route("/").get(authenticate, handleGetUsers);

export { router as default, router };
