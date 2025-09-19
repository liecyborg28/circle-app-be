import { prisma } from "../connections/prisma";
import { CreateThreadModel } from "../models/thread";

export async function createThread(payload: CreateThreadModel) {
  return await prisma.thread.create({
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
