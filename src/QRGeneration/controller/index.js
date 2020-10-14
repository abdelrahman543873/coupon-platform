import shortid from "shortid";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
let QRController = {
  generateCode(req, res, next) {
    var appDir = path.resolve("./QR-Images");
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir);
    } else {
      console.log("Directory already exist");
    }

    let code = shortid.generate();
    
    let fileName = code + Date.now() + ".png";
    let imagURL = QRCode.toFile("./QR-Images/" + fileName, code, function (
      err
    ) {
      if (err)
        return res.status(501).send({
          isSuccessed: false,
          data: null,
          error: err,
        });
      return res.status(201).send({
        isSuccessed: true,
        data:
          "http://api.bazar.alefsoftware.com/api/v1/QRCode/qr-images/" +
          fileName,
        error: null,
      });
    });
  },
};
export { QRController };
