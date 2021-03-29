import multer from "multer";
import path from "path";
import boom from "@hapi/boom";

export const uploadHelper = (dest) => {
  let imgExt = [
    ".JPG",
    ".PNG",
    ".GIF",
    ".WEBP",
    ".TIFF",
    ".PSD",
    ".RAW",
    ".BMP",
    ".HEIF",
    ".INDD",
    ".JPEG 2000",
    ".PDF",
    ".SVG",
    ".JPEG",
  ];
  let storage = multer.diskStorage({
      destination: dest,
      filename: function (req, file, cb) {
        console.log("file: ", file);
        console.log("req: ", req.body);
        cb(
          null,
          file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
        console.log("cb: ", cb);
      },
    }),
    upload = multer({
      storage,
      fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname).toUpperCase();
        console.log(ext);
        console.log(dest);
        if (!imgExt.includes(ext)) {
          return callback(boom.unauthorized("bad data"));
        }
        callback(null, true);
      },
    });
  return upload;
};
