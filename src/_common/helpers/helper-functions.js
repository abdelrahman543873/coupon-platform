export const multiPartToJsonParser = (object) => {
  Object.keys(JSON.parse(JSON.stringify(object))).forEach((key) => {
    if (typeof object[key] === "object")
      JSON.parse(JSON.stringify(object[key]));
  });
  return object;
};
