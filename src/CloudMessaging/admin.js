import * as admin from "firebase-admin";
var serviceAccount = require("../../service-account-file.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bazar-8057c.firebaseio.com",
});

export { admin };
