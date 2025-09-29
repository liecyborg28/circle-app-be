import express from "express";
import { authenticate } from "../middlewares/auth";
import {
  handleFollow,
  handleGetFollows,
  handleUnfollow,
} from "../controllers/follows";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Follows
 *   description: Endpoint untuk follow & unfollow user
 */

/**
 * @swagger
 * /follows:
 *   get:
 *     summary: Ambil daftar follow user yang sedang login
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []   # pakai JWT bearer token
 *     responses:
 *       200:
 *         description: Daftar follow berhasil diambil
 *
 *   post:
 *     summary: Follow user lain
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - following_id
 *             properties:
 *               following_id:
 *                 type: number
 *                 example: 2
 *     responses:
 *       201:
 *         description: Berhasil follow user
 *
 *   delete:
 *     summary: Unfollow user
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - following_id
 *             properties:
 *               following_id:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Berhasil unfollow user
 */
router
  .route("/")
  .get(authenticate, handleGetFollows)
  .post(authenticate, handleFollow)
  .delete(authenticate, handleUnfollow);

export { router as default, router };
