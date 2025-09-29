import express from "express";
import { authenticate } from "../middlewares/auth";
import { handleGetUsers } from "../controllers/user";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoint untuk mengelola user
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Ambil daftar semua user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar user berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: johndoe
 *                   email:
 *                     type: string
 *                     example: johndoe@mail.com
 */
router.route("/").get(authenticate, handleGetUsers);

export { router as default, router };
