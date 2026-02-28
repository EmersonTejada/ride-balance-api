import { Prisma } from "../generated/prisma/client";

export const decimalToNumber = (
  value: Prisma.Decimal | string | null | undefined,
): number => {
  if (!value) return 0;
  if (typeof value === "string") return Number(value);
  return value.toNumber();
};
