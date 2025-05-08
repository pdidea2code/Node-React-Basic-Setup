import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { queryErrorRelatedResponse } from "./sendResponse";

// Interface for the decoded JWT token
interface VerifiedToken {
  _id: string;
}

declare global {
    namespace Express {
      interface Request {
        user?: any; // You can replace Admin with your actual type
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

    const user = await User.findOne({ _id: verified._id });
    if (!user) {
      return queryErrorRelatedResponse(res, 402, "Access Denied.");
    }

    if (user.status === false) {
      return queryErrorRelatedResponse(
        res,
        403,
        "User is blocked please contact admin"
      );
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    queryErrorRelatedResponse(res, 402, "Invalid Token.");
  }
}
