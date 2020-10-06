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
  let videoExt = [
    ".WEBM",
    ".MPG",
    ".MP2",
    ".MPEG",
    ".MPE",
    ".MPV",
    ".OGG",
    ".MP4",
    ".M4P",
    ".M4V",
    ".AVI",
    ".WMV",
    ".MOV",
    ".QT",
    ".FLV",
    ".SWF",
    ".AVCHD",
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
        if (dest === "Bazars-Ads/") imgExt = imgExt.concat(videoExt);
        if (!imgExt.includes(ext)) {
          return callback(boom.unauthorized("bad data"));
        }
        callback(null, true);
      },
    });
  return upload;
}
export { uploadHelper };
