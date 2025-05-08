import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";

// Handle email or username duplicates
const handleDuplicateKeyError = (err: any, res: Response): any => {
  const field = Object.keys(err.keyValue);
  const status = 409;
  const error = `${field} already exist.`;

  let myarr: { [key: string]: string } = {};
  Object.keys(err.keyValue).forEach((field) => {
    myarr[field] = `${field} ${error}`; // Assign error to each field
  });


  res.status(status).send({ isSuccess: false, status, message: myarr });
};

// Handle field formatting, empty fields, and mismatched passwords
const handleValidationError = (err: any, res: Response): any => {
  let myarr: { [key: string]: string } = {};
  Object.keys(err.errors).forEach((key) => {
    myarr[key] = err.errors[key].message;
  });

  const status = 400;
  res.status(status).send({ isSuccess: false, status, message: myarr });
};

// Handle multer-related errors
const handleMulterError = (err: MulterError, res: Response): any => {
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res
      .status(400)
      .json({
        isSuccess: false,
        status: 400,
        message: "Too many files, You can only select three files.",
      });
  } else if (err.code === "LIMIT_FILE_SIZE" || err.message === "File too large") {
    return res
      .status(400)
      .json({ isSuccess: false, status: 400, message: "File is too large." });
  } else {
    console.error(err);
    return res
      .status(400)
      .json({
        isSuccess: false,
        status: 400,
        message: "Something went wrong in file uploading.",
      });
  }
};

// Handle file type-related errors
const handleMulterFileTypeError = (err: any, res: Response): any => {
  return res.status(400).json({
    isSuccess: false,
    status: 400,
    message: "File type is not supported.",
    Note: "File type is not supported.",
  });
};

// Error controller function
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (err.name === "MulterError") {
      return handleMulterError(err, res);
    }
    if (err.message === "Invalid file type.") {
      return handleMulterFileTypeError(err, res);
    }
    if (err.name === "ValidationError") {
      return handleValidationError(err, res);
    }
    if (err.code && err.code === 11000) {
      return handleDuplicateKeyError(err, res);
    }
    if (!res.headersSent) {
      next(err);
    }
    next();
  } catch (err) {
    res
      .status(500)
      .json({
        isSuccess: false,
        status: 500,
        message: "Internal server error.",
      });
  }
};
