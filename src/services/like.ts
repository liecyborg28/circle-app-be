import { prisma } from "../connections/prisma";
import { CreateLikeModel, DeleteLikeModel } from "../models/like";

export async function createLike(payload: CreateLikeModel) {
  return await prisma.like.create({
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

export async function deleteLike(payload: DeleteLikeModel) {
  return await prisma.like.delete({
    where: payload,
  });
}
