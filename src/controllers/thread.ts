import { Request, Response, NextFunction } from "express";
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
  const { profile, pageSize, pageIndex } = req.query;

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
      _count: {
        select: {
          replies: true,
          // likes: true, // ✅ hitung likes juga
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  };

  const token = req.headers.authorization?.split(" ")[1];
  const decoded = verifyToken(token);
  (req as any).user = decoded as any;

  // filter
  if (profile) {
    query.where.created_by = decoded.id;
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

  try {
    const results = await prisma.thread.findMany(query);

    const threads = await Promise.all(
      results.map(async (thread: any) => {
        const likeResults = await prisma.like.findMany({
          where: {
            thread_id: thread.id,
          },
        });

        return {
          ...thread,
          number_of_replies: thread._count.replies,
          number_of_likes: likeResults.length,
          liked: {
            id: likeResults.find((e) => e.user_id === decoded.id)?.id,
            status:
              likeResults.filter((e) => e.user_id === decoded.id)?.length > 0,
          },
        };
      })
    );

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Get threads successfully!",
      data: threads,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetThreadDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);
    (req as any).user = decoded as any;

    const thread: any = await prisma.thread.findUnique({
      where: { id: Number(id) },
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
        _count: {
          select: {
            replies: true,
            // likes: true,
          },
        },
      },
    });

    if (!thread) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Thread not found",
      });
    }

    const likesResult = await prisma.like.findMany({
      where: { thread_id: Number(id) },
    });

    thread["number_of_likes"] = likesResult.length;

    // ambil replies (pakai include yg sama kayak handleGetReplies)
    const replies = await prisma.reply.findMany({
      where: { thread_id: Number(id) },
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
        created_at: "asc", // biar reply ditampilkan urut dari yg pertama
      },
    });

    // format response
    const result = {
      ...thread,
      number_of_replies: thread._count.replies,
      // number_of_likes: thread._count.likes,
      replies, // ✅ masukkan array replies
      liked: {
        status: likesResult.filter((e) => e.user_id === decoded.id).length > 0,
        id: likesResult.find((e) => e.user_id === decoded.id)?.id,
      },
    };

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Get thread details successfully!",
      data: result,
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
