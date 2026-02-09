import { prisma } from "../prisma/index.js";
import { differenceInCalendarDays } from "date-fns";
import { decimalToNumber } from "../utils/decimal.js";
import { RidesReport } from "../types/ridesReport.js";

export const getRidesReport = async (
  userId: string,
  from: string,
  to: string
): Promise<RidesReport> => {
  /* =======================
     Normalizar fechas
     ======================= */
  const start = new Date(from);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(to);
  end.setUTCHours(23, 59, 59, 999);

  const days = differenceInCalendarDays(end, start);

  if (days <= 0 || days > 7) {
    throw new Error("Invalid date range");
  }

  const where = {
    userId,
    date: {
      gte: start,
      lte: end,
    },
  };

  /* =======================
     KPIs
     ======================= */
  const ridesAgg = await prisma.ride.aggregate({
    where,
    _sum: { amount: true },
    _count: { id: true },
  });

  const totalIncome = decimalToNumber(ridesAgg._sum.amount);
  const totalRides = ridesAgg._count.id ?? 0;
  const avgIncomePerRide =
    totalRides > 0 ? totalIncome / totalRides : 0;

  /* =======================
     Ingresos por día
     ======================= */
  const incomeByDayRaw = await prisma.ride.groupBy({
    by: ["date"],
    where,
    _sum: { amount: true },
    orderBy: { date: "asc" },
  });

  const incomeByDay = incomeByDayRaw.map((item) => ({
    date: item.date.toISOString().split("T")[0],
    amount: decimalToNumber(item._sum.amount),
  }));

  /* =======================
     Ingresos por plataforma
     ======================= */
  const incomeByPlatformRaw = await prisma.ride.groupBy({
    by: ["platform"],
    where,
    _sum: { amount: true },
  });

  const totalForPercentage = incomeByPlatformRaw.reduce(
    (sum, item) => sum + decimalToNumber(item._sum.amount),
    0
  );

  const incomeByPlatform = incomeByPlatformRaw.map((item) => {
    const amount = decimalToNumber(item._sum.amount);
    return {
      platform: item.platform,
      amount,
      percentage:
        totalForPercentage > 0
          ? Number(((amount / totalForPercentage) * 100).toFixed(2))
          : 0,
    };
  });

  /* =======================
     Respuesta
     ======================= */
  return {
    period: {
      from: start,
      to: end,
      days,
    },
    kpis: {
      totalIncome,
      totalRides,
      avgIncomePerRide,
    },
    charts: {
      incomeByDay,
      incomeByPlatform,
    },
  };
};
