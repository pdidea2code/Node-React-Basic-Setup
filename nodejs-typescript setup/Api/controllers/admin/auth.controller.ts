import { NextFunction, Request, Response } from "express";
import { successResponse } from "../../helper/sendResponse";

const Login = async (req: Request, res: Response,next: NextFunction ) => {
    try {   
      successResponse(res, {
        message: "Admin login successful"
      });
    } catch (error) {
        next(error);
    }
}

export  {
    Login
}