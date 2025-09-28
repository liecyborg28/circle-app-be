import { Request, Response, NextFunction } from "express";
import { prisma } from "../connections/prisma";
import { verifyToken } from "../utils/jwt";

export async function handleGetUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);
    (req as any).user = decoded as any;

    const { keyword, pageIndex, pageSize } = req.query;

    // base query
    const query: any = {
      where: {
        NOT: { id: decoded.id }, // 🚫 exclude diri sendiri
      },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        username: true,
        full_name: true,
        email: true,
        photo_profile: true,
        bio: true,
        created_at: true,
      },
    };

    // filter keyword
    if (keyword && String(keyword).trim() !== "") {
      query.where.OR = [
        { username: { contains: String(keyword), mode: "insensitive" } },
        { full_name: { contains: String(keyword), mode: "insensitive" } },
        { email: { contains: String(keyword), mode: "insensitive" } },
      ];
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

    // ambil semua user (selain diri sendiri)
    const users = await prisma.user.findMany(query);

    // ambil semua following yang user login lakukan
    const myFollowings = await prisma.following.findMany({
      where: { follower_id: decoded.id },
    });

    // mapping user + status follow
    const results = users.map((u) => {
      const follow = myFollowings.find((f) => f.following_id === u.id);

      return {
        ...u,
        follows: {
          id: follow?.id ?? null,
          following: !!follow,
        },
      };
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Get users successfully!",
      data: results,
    });
  } catch (error) {
    next(error);
  }
}
