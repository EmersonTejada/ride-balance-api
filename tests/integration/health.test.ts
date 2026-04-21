import request from "supertest";
import { app } from "../../src/app.js";
import {afterAll, describe, expect, it} from '@jest/globals'
import { prisma } from "../../src/prisma/index.js";

describe("Health Check", () => {
  it("should return status 200 and Healthy", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "healthy");
    expect(response.body).toHaveProperty("database", "connected");
    expect(response.body).toHaveProperty("timestamp");
  });
});

afterAll(async () => {
  await prisma.$disconnect();
})