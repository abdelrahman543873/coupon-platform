import request from "supertest";
import { server } from "../src/server.js";
import { BaseHttpError } from "../src/_common/error-handling-module/error-handler.js";
import { HTTP_METHODS_ENUM } from "./request.methods.enum.js";

export const testRequest = async ({
  method,
  variables,
  token,
  headers,
  url,
  fileParam,
  filePath,
}) => {
  let req = request(server);
  method === HTTP_METHODS_ENUM.POST && (req = req.post(url));
  method === HTTP_METHODS_ENUM.GET && (req = req.get(url));
  method === HTTP_METHODS_ENUM.PUT && (req = req.put(url));
  method === HTTP_METHODS_ENUM.DELETE && (req = req.delete(url));
  if (!Object.values(HTTP_METHODS_ENUM).includes(method))
    throw new BaseHttpError(610);
  //only way to upload a file and send object values
  variables && filePath
    ? Object.keys(variables).forEach((key) => {
        typeof variables[key] === "string"
          ? req.field(key, variables[key])
          : req.field(key, `${variables[key]}`);
      })
    : variables;
  fileParam && filePath
    ? req.attach(fileParam, filePath)
    : req.send(variables).set("Content-Type", "application/json");
  if (token) req.set("Authorization", `Bearer ${token}`);
  if (headers) {
    if (headers.timezone) return req.set("timezone", headers.timezone);
    if (headers.lang) return req.set("lang", headers.lang);
  }
  return req;
};
