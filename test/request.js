import request from "supertest";
import { server } from "../src/server.js";

export async function post({
  variables,
  token,
  headers,
  url,
  fileParam,
  filePath,
}) {
  const req = request(server)
    .post(url)
    .send(variables)
    .set("Content-Type", "application/json");
  if (token) req.set("Authorization", `Bearer ${token}`);
  if (fileParam && filePath) req.attach(fileParam, filePath);
  if (headers) {
    if (headers.timezone) return req.set("timezone", headers.timezone);
    if (headers.lang) return req.set("lang", headers.lang);
  }
  return req;
}

export async function get({
  variables,
  token,
  headers,
  url,
  fileParam,
  filePath,
}) {
  const req = request(server)
    .get(url)
    .send(variables)
    .set("Content-Type", "application/json");
  if (token) req.set("Authorization", `Bearer ${token}`);
  if (fileParam && filePath) req.attach(fileParam, filePath);
  if (headers) {
    if (headers.timezone) return req.set("timezone", headers.timezone);
    if (headers.lang) return req.set("lang", headers.lang);
  }
  return req;
}

export const put = async ({
  variables,
  token,
  headers,
  url,
  fileParam,
  filePath,
}) => {
  const req = request(server).put(url).set("Content-Type", "application/json");
  if (variables) req.send(variables);
  if (token) req.set("Authorization", `Bearer ${token}`);
  if (fileParam && filePath) req.attach(fileParam, filePath);
  if (headers) {
    if (headers.timezone) return req.set("timezone", headers.timezone);
    if (headers.lang) return req.set("lang", headers.lang);
  }
  return req;
};

export async function remove({
  variables,
  token,
  headers,
  url,
  fileParam,
  filePath,
}) {
  const req = request(server)
    .delete(url)
    .send(variables)
    .set("Content-Type", "application/json");
  if (token) req.set("Authorization", `Bearer ${token}`);
  if (fileParam && filePath) req.attach(fileParam, filePath);
  if (headers) {
    if (headers.timezone) return req.set("timezone", headers.timezone);
    if (headers.lang) return req.set("lang", headers.lang);
  }
  return req;
}
