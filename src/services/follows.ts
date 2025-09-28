import { prisma } from "../connections/prisma";
import { FollowModel, UnfollowModel } from "../models/follows";

export async function follow(payload: FollowModel) {
  return await prisma.following.create({
    data: payload,
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
  });
}

export async function unfollow(payload: UnfollowModel) {
  return await prisma.following.delete({ where: payload });
}
