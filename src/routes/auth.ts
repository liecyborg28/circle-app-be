import express from "express";
import { handleRegister, handleLogin } from "../controllers/auth";
import { uploads } from "../utils/multer";

const router = express.Router();

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.get("/me", (_, res) => {
  res.json({ message: "Hello World!" });
});

export { router as default, router };
