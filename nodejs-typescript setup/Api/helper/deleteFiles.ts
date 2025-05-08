import fs from "fs";
import path from "path";

const deleteFiles = (files: string | string[]): void => {
  try {
    if (Array.isArray(files)) {
      // Handle multiple deletions
      files.forEach((file: string) => {
        const filePath = path.join(__dirname, "../public", file);
        if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        } else {
          console.error(`Path is not a file: ${filePath}`);
        }
      });
    } else {
      // Handle single file deletion
      const filePath = path.join(__dirname, "../public", files);
      if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      } else {
        console.error(`Path is not a file: ${filePath}`);
      }
    }
  } catch (error) {
    console.error("Error deleting files:", error);
  }
};

export default deleteFiles;
