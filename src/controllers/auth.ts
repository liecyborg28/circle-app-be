// import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { register, login } from "../services/auth";
// import { prisma } from "../connections/prisma";
import { loginSchema, registerSchema } from "../validations/auth";
import { LoginModel, RegisterModel, TokenModel } from "../models/auth";
import { signToken } from "../utils/jwt";

export async function handleRegister(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { error } = registerSchema.validate(req.body);

    if (error) {
      throw { code: 400, message: error.message };
    }

    const { username, name, email, password } = req.body;

    const payload: RegisterModel = {
      username,
      full_name: name,
      email,
      password,
    };

    const user: any = await register(payload);

    const tokenModel: TokenModel = {
      id: user?.id,
    };

    const token = signToken(tokenModel);

    const userData = {
      user_id: user?.id,
      username: user?.username,
      name: user?.full_name,
      email: user?.email,
      token,
    };

    res.status(201).json({
      code: 200,
      status: "success",
      message:
        "Registration successful. Account has been created successfully.",
      data: userData,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { error } = loginSchema.validate(req.body);

    if (error) {
      throw { code: 400, message: error.message };
    }

    const { email, password } = req.body;

    const payload: LoginModel = {
      email,
      password,
    };

    const user = await login(payload);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Login successful.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
