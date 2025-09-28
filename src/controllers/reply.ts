import { NextFunction, Request, Response } from "express";
import { prisma } from "../connections/prisma";
import { verifyToken } from "../utils/jwt";
import { CreateReplyModel } from "../models/reply";
import { createReply } from "../services/reply";
import { io } from "../app";

export async function handleGetReplies(
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
    const results = await prisma.reply.findMany(query);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Get replies successfully!",
      data: results,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleCreateReply(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);
    (req as any).user = decoded as any;

    const image = req.file?.filename;

    const payload: CreateReplyModel = {
      content: req?.body?.content,
      image,
      created_by: decoded?.id,
      updated_by: decoded?.id,
      thread_id: parseFloat(req?.body?.thread_id),
      user_id: decoded?.id,
    };

    const result = await createReply(payload);

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Create reply successfully!",
      data: result,
    });

    // 🔥 Emit event setelah sukses insert
    io.emit("reply:created", result);
  } catch (error) {
    next(error);
  }
}
