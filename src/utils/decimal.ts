import { Prisma } from "../generated/prisma/client";

export const decimalToNumber = (
  value: Prisma.Decimal | null | undefined
): number => {
  if (!value) return 0;
  return value.toNumber();
};