import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../connections/prisma";
import { FollowModel, UnfollowModel } from "../models/follows";
import { follow, unfollow } from "../services/follows";

export async function handleFollow(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);
    (req as any).user = decoded as any;

    const { followed_user_id } = req.body;

    const payload: FollowModel = {
      following_id: Number(followed_user_id),
      follower_id: decoded.id,
    };

    const isFollowed = await prisma.following.findFirst({
      where: payload,
    });

    if (isFollowed) {
      throw {
        code: 500,
        status: "error",
        message: "User already followed",
      };
    } else {
      const result = await follow(payload);

      res.status(201).json({
        code: 201,
        status: "success",
        message: "You have successfully followed the user.",
        data: {
          user_id: result.id,
          is_following: true,
        },
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function handleUnfollow(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { followed_id } = req.body;

    const payload: UnfollowModel = {
      id: Number(followed_id),
    };

    const result = await unfollow(payload);

    res.status(201).json({
      code: 201,
      status: "success",
      message: "You have successfully unfollowed the user.",
      data: {
        user_id: result.id,
        is_following: false,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetFollows(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);
    (req as any).user = decoded as any;

    const query: any = {
      where: {},
      include: {
        following: {
          select: {
            id: true,
            username: true,
            full_name: true,
            email: true,
            photo_profile: true,
          },
        },
        follower: {
          select: {
            id: true,
            username: true,
            full_name: true,
            email: true,
            photo_profile: true,
          },
        },
      },
    };

    const { type, pageSize, pageIndex } = req.query;

    if (type === "followers") {
      query.where.following_id = decoded.id;
    } else {
      query.where.follower_id = decoded.id;
    }

    // pagination
    if (pageIndex && pageSize) {
      const page = Number(pageIndex);
      const size = Number(pageSize);
      query.skip = (page - 1) * size;
      query.take = size;
    } else if (pageSize) {
      query.take = Number(pageSize);
    }

    const results = await prisma.following.findMany(query);

    // ambil semua followings user login untuk cek status
    const myFollowings = await prisma.following.findMany({
      where: { follower_id: decoded.id },
    });

    const dataResponse =
      type === "followers"
        ? {
            followers: results.map((e: any) => {
              const isFollowing = myFollowings.some(
                (f) => f.following_id === e.follower.id
              );
              return {
                ...e.follower,
                follow_id: e.id,
                following: isFollowing, // ✅ status apakah user login follow dia
              };
            }),
          }
        : {
            followings: results.map((e: any) => {
              const isFollowing = myFollowings.some(
                (f) => f.following_id === e.following.id
              );
              return {
                ...e.following,
                follow_id: e.id,
                following: isFollowing, // ✅ status apakah user login follow dia
              };
            }),
          };

    res.status(200).json({
      code: 200,
      status: "success",
      data: dataResponse,
    });
  } catch (error) {
    next(error);
  }
}
