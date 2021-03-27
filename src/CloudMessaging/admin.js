import * as admin from "firebase-admin";
var serviceAccount = require("../../service-account-file.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://coupouns-1f184.firebaseio.com",
});

export { admin };
