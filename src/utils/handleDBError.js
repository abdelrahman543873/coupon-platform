function getErrorMessage(err, lang = "ar") {
  console.log(err);
  if (err.name == "MongoError") {
    if (err.code == 11000) {
      let errorProp = Object.keys(err.keyValue)[0];
      return lang == "ar"
        ? `محجوزه من مستخدم اخر ${errorProp} البيانات `
        : `The ${errorProp} value has been taken before!`;
    } else {
      return lang == "ar"
        ? "خطأ بقاعدة البيانات"
        : "Its not you, its us :( we are working on fixing it";
    }
  } else if (err.name == "ValidationError") {
    return lang == "ar"
      ? "البيانات غير مكتمله"
      : "Some data is missing or wrong!";
  } else return err;
}

export { getErrorMessage };
