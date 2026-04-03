import request from "supertest";
import { app } from "../../src/app";

describe("Health Check", () => {
  it("should return status 200 and UP", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "UP");
    expect(response.body).toHaveProperty("environment");
  });
});
