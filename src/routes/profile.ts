import express from "express";
import { uploads } from "../utils/multer";
import { authenticate } from "../middlewares/auth";
import { handleGetProfile, handleUpdateProfile } from "../controllers/profile";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Endpoint untuk mengelola profil user
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Ambil profil user yang sedang login
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil user berhasil diambil
 *
 *   patch:
 *     summary: Update profil user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               bio:
 *                 type: string
 *                 example: Hello, I love coding!
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profil user berhasil diperbarui
 */
router
  .route("/")
  .get(authenticate, handleGetProfile)
  .patch(authenticate, uploads.single("image"), handleUpdateProfile);

export { router as default, router };
