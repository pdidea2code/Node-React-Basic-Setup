import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";
import { queryErrorRelatedResponse } from "./sendResponse";

interface VerifiedToken {
  email: string;
}
declare global {
    namespace Express {
      interface Request {
        admin?: any; // You can replace Admin with your actual type
        token?: string;
      }
    }
  }

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let token: string | undefined = req.header("Authorization");

  if (token) {
    token = token.replace("Bearer ", "");
  }

  if (!token) {
    return queryErrorRelatedResponse(res, 402, "Access Denied.");
  }

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as VerifiedToken;

    const admin = await Admin.findOne({ email: verified.email });
    if (!admin) {
      return queryErrorRelatedResponse(res, 402, "Access Denied.");
    }

    req.admin = admin;
    req.token = token;
    next();
  } catch (error) {
    queryErrorRelatedResponse(res, 402, "Invalid Token.");
  }
}
