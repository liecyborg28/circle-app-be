import express, { Request, Response } from "express";
import { handleRegister, handleLogin } from "../controllers/auth";
import { uploads } from "../utils/multer";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoint untuk autentikasi user
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@mail.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: User berhasil diregistrasi
 */
router.post("/register", handleRegister);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@mail.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login berhasil
 */
router.post("/login", handleLogin);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user (cek token/session)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Info user berhasil diambil
 */
router.get("/me", (_: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

export { router as default, router };
