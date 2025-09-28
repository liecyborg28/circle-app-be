import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../connections/prisma";

export async function handleGetProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);
    (req as any).user = decoded as any;

    // cari user by id
    const profile = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!profile) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "User not found",
      });
    }

    // hitung followers dan following
    const [followerCount, followingCount] = await Promise.all([
      prisma.following.count({
        where: { following_id: decoded.id }, // orang lain yang follow saya
      }),
      prisma.following.count({
        where: { follower_id: decoded.id }, // saya follow orang lain
      }),
    ]);

    const profileResponse = {
      username: profile.username,
      name: profile.full_name,
      avatar: "http://localhost:8081" + "/uploads/" + profile.photo_profile,
      bio: profile.bio,
      follower_count: followerCount,
      following_count: followingCount,
    };

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Get profile successfully!",
      data: profileResponse,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);
    (req as any).user = decoded as any;

    const photo_profile = req.file?.filename;

    const { full_name = null, username = null, bio = null } = req.body;

    const updatedProfile = await prisma.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        photo_profile,
        full_name,
        username,
        bio,
      },
    });

    // hitung followers dan following
    const [followerCount, followingCount] = await Promise.all([
      prisma.following.count({
        where: { following_id: decoded.id }, // orang lain yang follow saya
      }),
      prisma.following.count({
        where: { follower_id: decoded.id }, // saya follow orang lain
      }),
    ]);

    const profileResponse = {
      username: updatedProfile.username,
      name: updatedProfile.full_name,
      avatar: updatedProfile.photo_profile,
      bio: updatedProfile.bio,
      follower_count: followerCount,
      following_count: followingCount,
    };

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Update profile successfully!",
      data: profileResponse,
    });
  } catch (error) {
    next(error);
  }
}
