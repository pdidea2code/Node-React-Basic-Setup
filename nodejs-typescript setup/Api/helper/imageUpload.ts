import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

interface FieldConfig {
  name: string;
  maxCount: number;
  allowedMimes: string[];
  path?: string; // optional for multiDiffFileAndPathUpload
}

// Single file upload
export function singleFileUpload(
  uploadPath: string,
  allowedMimes: string[],
  fileSize: number,
  fieldName: string
) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "-").toLowerCase());
    },
  });

  const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error: any = new Error("Invalid file type.");
      error.httpStatusCode = 422;
      error.errorMessage = "Invalid file type.";
      return cb(error);
    }
  };

  return multer({
    storage,
    limits: { fileSize },
    fileFilter,
  }).single(fieldName);
}

// Multiple file upload (same field)
export function multiFileUpload(
  uploadPath: string,
  allowedMimes: string[],
  fileSize: number,
  fieldName: string
) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "-").toLowerCase());
    },
  });

  const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error: any = new Error("Invalid file type.");
      error.httpStatusCode = 422;
      error.errorMessage = "Invalid file type.";
      return cb(error);
    }
  };

  return multer({
    storage,
    limits: { fileSize },
    fileFilter,
  }).array(fieldName);
}

// Multiple file upload (different fields, same path)
export function multiDiffFileUpload(uploadPath: string, fieldConfigurations: FieldConfig[]) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "-").toLowerCase());
    },
  });

  const uploadFields = fieldConfigurations.map(({ name, maxCount }) => ({
    name,
    maxCount,
  }));

  const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const config = fieldConfigurations.find((c) => c.name === file.fieldname);
    if (config?.allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error: any = new Error("Invalid file type.");
      error.httpStatusCode = 422;
      error.errorMessage = "Invalid file type.";
      cb(error);
    }
  };

  return multer({
    storage,
    fileFilter,
  }).fields(uploadFields);
}

// Multiple file upload (different fields, different paths)
export function multiDiffFileAndPathUpload(fieldConfigurations: FieldConfig[]) {
  const baseUploadsPath = path.join(__dirname, "../public");

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const config = fieldConfigurations.find((c) => c.name === file.fieldname);
      if (config?.path) {
        const fullPath = path.join(baseUploadsPath, config.path);
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
        }
        cb(null, fullPath);
      } else {
        const error: any = new Error("No path specified for this field");
        error.httpStatusCode = 400;
        cb(error, "" as string);
      }
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "-").toLowerCase());
    },
  });

  const uploadFields = fieldConfigurations.map(({ name, maxCount }) => ({
    name,
    maxCount,
  }));

  const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedMimes = fieldConfigurations.find((c) => c.name === file.fieldname)?.allowedMimes;
    if (!allowedMimes || allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error: any = new Error("Invalid file type.");
      error.httpStatusCode = 422;
      error.errorMessage = "Invalid file type.";
      cb(error);
    }
  };

  return multer({
    storage,
    fileFilter,
  }).fields(uploadFields);
}
