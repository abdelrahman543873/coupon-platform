import multer from "multer";
import path from "path";
import boom from "@hapi/boom";

function uploadHelper(dest) {
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
    ".JPEG"
  ];
  let storage = multer.diskStorage({
      destination: dest,
      filename: function (req, file, cb) {
        cb(
          null,
          file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
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
}
export { uploadHelper };
