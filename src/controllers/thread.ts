import { Request, Response, NextFunction } from "express";
import { createThreadSchema } from "../validations/thread";
import { CreateThreadModel } from "../models/thread";
import { verifyToken } from "../utils/jwt";
import { createThread } from "../services/thread";
import { prisma } from "../connections/prisma";
import { io } from "../app";

export async function handleGetThreads(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { pageSize, pageIndex } = req.query;

  const query: any = {
    where: {},
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
    orderBy: {
      created_at: "desc", // atau 'asc'
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
    const results = await prisma.thread.findMany(query);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Get threads successfully!",
      data: results,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleCreateThread(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);
    (req as any).user = decoded as any;

    const image = req.file?.filename;

    const payload: CreateThreadModel = {
      content: req?.body?.content,
      image,
      created_by: decoded?.id,
      updated_by: decoded?.id,
    };

    const result = await createThread(payload);

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Create thread succesfully!",
      data: result,
    });

    // 🔥 Emit event setelah sukses insert
    io.emit("thread:created", result);
  } catch (error) {
    next(error);
  }
}
