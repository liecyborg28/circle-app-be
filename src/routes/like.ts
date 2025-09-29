import express from "express";
import { uploads } from "../utils/multer";
import { authenticate } from "../middlewares/auth";
import {
  handleCreateLike,
  handleDeleteLike,
  handleGetLikes,
} from "../controllers/like";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Endpoint untuk like & unlike thread/reply
 */

/**
 * @swagger
 * /like:
 *   post:
 *     summary: Buat like baru
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thread_id:
 *                 type: number
 *                 example: 1
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Berhasil menambahkan like
 */
router.post("/", authenticate, uploads.single("image"), handleCreateLike);

/**
 * @swagger
 * /like/{id}:
 *   get:
 *     summary: Ambil semua like untuk thread/reply tertentu
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: ID thread/reply
 *     responses:
 *       200:
 *         description: Daftar like berhasil diambil
 */
router.get("/:id", authenticate, handleGetLikes);

/**
 * @swagger
 * /like/{id}/delete:
 *   delete:
 *     summary: Hapus like
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: ID like yang akan dihapus
 *     responses:
 *       200:
 *         description: Like berhasil dihapus
 */
router.delete("/:id/delete", authenticate, handleDeleteLike);

export { router as default, router };
