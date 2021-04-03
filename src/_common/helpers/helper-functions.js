export const multiPartToJsonParser = (object) => {
  Object.keys(JSON.parse(JSON.stringify(object))).forEach((key) => {
    object[key] = JSON.parse(object[key]);
  });
  return object;
};
