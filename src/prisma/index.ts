import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({ connectionString });
const prismaClient = new PrismaClient({ adapter });

const prisma = prismaClient.$extends({
  result: {
    ride: {
      amount: {
        needs: { amount: true },
        compute(ride) {
          return Number(ride.amount).toFixed(2);
        },
      },
    },
    expense: {
      amount: {
        needs: { amount: true },
        compute(expense) {
          return Number(expense.amount).toFixed(2);
        },
      },
    },
  },
});

export { prisma };
