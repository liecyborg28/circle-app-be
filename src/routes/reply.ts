import express from "express";
import { uploads } from "../utils/multer";
import { authenticate } from "../middlewares/auth";
import { handleCreateReply, handleGetReplies } from "../controllers/reply";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Replies
 *   description: Endpoint untuk mengelola balasan (reply) pada thread
 */

/**
 * @swagger
 * /reply:
 *   post:
 *     summary: Buat reply baru pada thread
 *     tags: [Replies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - thread_id
 *               - content
 *             properties:
 *               thread_id:
 *                 type: number
 *                 example: 1
 *               content:
 *                 type: string
 *                 example: Ini adalah balasan saya
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Reply berhasil dibuat
 */
router
  .route("/")
  .post(authenticate, uploads.single("image"), handleCreateReply);

/**
 * @swagger
 * /reply/{id}:
 *   get:
 *     summary: Ambil semua reply dari sebuah thread
 *     tags: [Replies]
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
 *         description: Daftar reply berhasil diambil
 */
router.get("/:id", authenticate, handleGetReplies);

export { router as default, router };
