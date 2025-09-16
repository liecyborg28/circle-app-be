import jwt from "jsonwebtoken";
import { LoginModel } from "../models/auth";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function signToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1w" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as LoginModel;
}
