import multer from "multer";
import { BaseHttpError } from "../error-handling-module/error-handler.js";
import file_type from "file-type";
import fs from "fs";
import path from "path";
export const uploadHelper = (dest) => {
  const fileFilter = (req, file, callback) => {
    try {
      callback(null, true);
    } catch (error) {
      callback(error, false);
    }
  };
  const filename = (req, file, cb) => {
    try {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    } catch (error) {
      cb(error);
    }
  };
  const storage = multer.diskStorage({
    destination: dest,
    filename,
  });
  const upload = multer({
    storage,
    fileFilter,
  });
  return upload;
};

export const fileValidationMiddleWare = async (req, res, next) => {
  // a security measure that allows checking the file type by the magic number and not only by the file name extension
  // have a look here
  // https://www.npmjs.com/package/file-type
  try {
    const imgExt = [
      "jpg",
      "png",
      "gif",
      "webp",
      "tiff",
      "psd",
      "raw",
      "bmp",
      "heif",
      "indd",
      "pdf",
      "svg",
      "jpeg",
    ];
    if (req.files) {
      Object.keys(req.files).forEach(async (file) => {
        const fileType = await file_type.fromFile(req.files[file][0].path);
        if (!imgExt.includes(fileType.ext)) {
          await fs.unlinkSync(req.files[file][0].path);
          throw new BaseHttpError(609);
        }
      });
    }
    if (req.file) {
      const fileType = await file_type.fromFile(req.file.path);
      if (!imgExt.includes(fileType.ext)) {
        await fs.unlinkSync(req.file.path);
        throw new BaseHttpError(609);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
