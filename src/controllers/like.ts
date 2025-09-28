import { NextFunction, Request, Response } from "express";
import { prisma } from "../connections/prisma";
import { CreateLikeModel } from "../models/like";
import { verifyToken } from "../utils/jwt";
import { createLike, deleteLike } from "../services/like";
import { io } from "../app";
import { DeleteLikeModel } from "../models/like";

export async function handleGetLikes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { pageSize, pageIndex } = req.query;

  const query: any = {
    where: {
      thread_id: parseFloat(id),
    },
    include: {
      createdBy: {
        select: {
          id: true,
          username: true,
          full_name: true,
          email: true,
          photo_profile: true,
        },
      },
      updatedBy: {
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

  // pagination
  if (pageIndex && pageSize) {
    const page = Number(pageIndex);
    const size = Number(pageSize);
    query.skip = (page - 1) * size;
    query.take = size;
  } else if (pageSize) {
    query.take = Number(pageSize);
  }

  try {
    const results = await prisma.like.findMany(query);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Get likes successfully!",
      data: results,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleCreateLike(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);
    (req as any).user = decoded as any;

    const payload: CreateLikeModel = {
      created_by: decoded?.id,
      updated_by: decoded?.id,
      thread_id: parseFloat(req?.body?.thread_id),
      user_id: decoded?.id,
    };

    const isLiked = await prisma.like.findFirst({
      where: {
        thread_id: payload?.thread_id,
        user_id: decoded?.id,
      },
    });

    if (isLiked) {
      throw {
        code: 500,
        status: "error",
        message: "Thread already liked",
      };
    } else {
      const result = await createLike(payload);

      res.status(201).json({
        code: 201,
        status: "success",
        message: "Create like successfully!",
        data: result,
      });

      // 🔥 Emit event setelah sukses insert
      io.emit("like:created", result);
    }
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteLike(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);
    (req as any).user = decoded as any;

    const { id } = req.params;

    const payload: DeleteLikeModel = {
      id: parseFloat(id),
    };

    const result = await deleteLike(payload);

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Delete like succesfully!",
      data: result,
    });

    // 🔥 Emit event setelah sukses insert
    io.emit("like:created", result);
  } catch (error) {
    next(error);
  }
}
