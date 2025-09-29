import express from "express";
import { uploads } from "../utils/multer";
import { authenticate } from "../middlewares/auth";
import {
  handleCreateThread,
  handleGetThreadDetails,
  handleGetThreads,
} from "../controllers/thread";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Threads
 *   description: Endpoint untuk mengelola thread (post utama)
 */

/**
 * @swagger
 * /thread:
 *   get:
 *     summary: Ambil semua thread
 *     tags: [Threads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar thread berhasil diambil
 *
 *   post:
 *     summary: Buat thread baru
 *     tags: [Threads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Ini thread pertama saya 🚀
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Thread berhasil dibuat
 */
router
  .route("/")
  .get(authenticate, handleGetThreads)
  .post(authenticate, uploads.single("image"), handleCreateThread);

/**
 * @swagger
 * /thread/{id}:
 *   get:
 *     summary: Ambil detail thread berdasarkan ID
 *     tags: [Threads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: ID thread
 *     responses:
 *       200:
 *         description: Detail thread berhasil diambil
 */
router.get("/:id", authenticate, handleGetThreadDetails);

export { router as default, router };
