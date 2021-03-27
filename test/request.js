import request from "supertest";
import server from "../src/server.js";

export async function post({ variables, token, headers, url }) {
  const req = await request(server)
    .post(url)
    .send(variables)
    .set("Content-Type", "application/json");
  if (token) req.set("Authorization", `Bearer ${token}`);
  if (headers) {
    if (headers.timezone) return req.set("timezone", headers.timezone);
    if (headers.lang) return req.set("lang", headers.lang);
  }
  return req;
}

export async function get({ variables, token, headers, url }) {
  const req = await request(server)
    .get(url)
    .send(variables)
    .set("Content-Type", "application/json");
  if (token) req.set("Authorization", `Bearer ${token}`);
  if (headers) {
    if (headers.timezone) return req.set("timezone", headers.timezone);
    if (headers.lang) return req.set("lang", headers.lang);
  }
  return req;
}

export async function put({ variables, token, headers, url }) {
  const req = await request(server)
    .put(url)
    .send(variables)
    .set("Content-Type", "application/json");
  if (token) req.set("Authorization", `Bearer ${token}`);
  if (headers) {
    if (headers.timezone) return req.set("timezone", headers.timezone);
    if (headers.lang) return req.set("lang", headers.lang);
  }
  return req;
}

export async function remove({ variables, token, headers, url }) {
  const req = await request(server)
    .delete(url)
    .send(variables)
    .set("Content-Type", "application/json");
  if (token) req.set("Authorization", `Bearer ${token}`);
  if (headers) {
    if (headers.timezone) return req.set("timezone", headers.timezone);
    if (headers.lang) return req.set("lang", headers.lang);
  }
  return req;
}
