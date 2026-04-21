import { HealthError } from "../errors/HealthError.js";
import { prisma } from "../prisma/index.js";

export const healthQuery = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    throw new HealthError("Database connection failed");
  }
};
