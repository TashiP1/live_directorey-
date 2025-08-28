const { spawn } = require("child_process");
const fetch = require("node-fetch"); // v2

let serverProcess;
const BASE_URL = "http://localhost:3000";

beforeAll((done) => {
  serverProcess = spawn("node", ["app.js"], { stdio: ["ignore", "pipe", "pipe"] });

  serverProcess.stdout.on("data", (data) => {
    if (data.toString().includes("Server running")) done();
  });

  serverProcess.stderr.on("data", (data) => console.error(`Server error: ${data}`));
});

afterAll(() => {
  if (serverProcess) serverProcess.kill();
});

describe("HTTP tests (No DB modification)", () => {
  test("GET /login returns 200 with CSRF input", async () => {
    const res = await fetch(`${BASE_URL}/login`);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toMatch(/name="_csrf"/);
  });

  test("GET /about redirects to /login if not logged in", async () => {
    const res = await fetch(`${BASE_URL}/about`, { redirect: "manual" });
    expect(res.status).toBe(302);
    const location = res.headers.get("location");
    expect(location.endsWith("/login")).toBe(true);
  });

  test("GET /nonexistent redirects to /login if not logged in", async () => {
    const res = await fetch(`${BASE_URL}/this-route-does-not-exist`, { redirect: "manual" });
    expect(res.status).toBe(302);
    const location = res.headers.get("location");
    expect(location.endsWith("/login")).toBe(true);
  });
});

