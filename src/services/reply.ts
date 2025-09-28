import { prisma } from "../connections/prisma";
import { CreateReplyModel } from "../models/reply";

export async function createReply(payload: CreateReplyModel) {
  return await prisma.reply.create({
    data: payload,
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
  });
}
