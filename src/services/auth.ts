import bcrypt from "bcrypt";
import { prisma } from "../connections/prisma";
import { signToken } from "../utils/jwt";
import { LoginModel, RegisterModel } from "../models/auth";
import { Request, Response } from "express";

export async function register(model: RegisterModel) {
  const hashed = await bcrypt.hash(model?.password, 10);

  const payload: any = {
    ...model,
    password: hashed,
  };

  const user = await prisma.user.create({ data: payload });

  return user;
}

export async function login(req: Request, res: Response, model: LoginModel) {
  const user: any = await prisma.user.findUnique({
    where: { email: model?.email },
  });

  if (!user) {
    res.status(404).json({
      code: 400,
      status: "error",
      message:
        "User not found! Please check your login details before submitting",
    });
  }

  const isMatch = await bcrypt.compare(model.password, user.password);
  if (!isMatch) throw new Error("Wrong password.");

  const token = signToken({ id: user?.id });
  return {
    user_id: user?.id,
    username: user?.username,
    name: user?.full_name,
    email: user?.email,
    token,
  };
}
