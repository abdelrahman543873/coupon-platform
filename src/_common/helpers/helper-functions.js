export const multiPartToJsonParser = (object) => {
  Object.keys(JSON.parse(JSON.stringify(object))).forEach((key) => {
    JSON.parse(JSON.stringify(object[key]));
  });
  return object;
};
