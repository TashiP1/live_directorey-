// __tests__/app.test.js
const request = require("supertest");
const expressApp = require("../app"); // your app.js

describe("HTTP tests (No DB, CI-friendly)", () => {
  test("GET /login returns 200", async () => {
    const res = await request(expressApp).get("/login");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Login"); // basic check
  });

  test("GET /about redirects to /login if not logged in", async () => {
    const res = await request(expressApp).get("/about");
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/login");
  });

  test("GET /nonexistent returns 404", async () => {
    const res = await request(expressApp).get("/this-route-does-not-exist");
    expect(res.status).toBe(404);
  });
});
