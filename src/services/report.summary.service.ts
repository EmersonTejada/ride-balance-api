import { prisma } from "../prisma/index.js";
import { differenceInCalendarDays, endOfDay, endOfISOWeek, startOfDay, startOfISOWeek } from "date-fns";
import { ReportSummary } from "../types/report.js";
import { decimalToNumber } from "../utils/decimal.js";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

export const getReportSummary = async (
  userId: string,
  from: string,
  to: string,
  userTimeZone: string
): Promise<ReportSummary> => {
  // 1. Obtener "ahora" en zona del usuario
  const fromUTC = new Date(from);
  const toUTC = new Date(to);
  const fromInUserZone = toZonedTime(fromUTC, userTimeZone);
  const toInUserZone = toZonedTime(toUTC, userTimeZone);

  
  const startInUserZone = startOfDay(fromInUserZone);
  const endInUserZone = endOfDay(toInUserZone);

  const days = differenceInCalendarDays(endInUserZone, startInUserZone) + 1;

  if (days <= 0 || days > 7) {
    throw new Error("Invalid date range");
  }

  const startUtc = fromZonedTime(startInUserZone, userTimeZone);
  const endUtc = fromZonedTime(endInUserZone, userTimeZone);
  const ridesWhere = {
    userId,
    date: {
      gte: startUtc,
      lte: endUtc,
    },
  };

  const expensesWhere = {
    userId,
    date: {
      gte: startUtc,
      lte: endUtc,
    },
  };


  const [ridesAgg, expensesAgg] = await Promise.all([
    prisma.ride.aggregate({
      where: ridesWhere,
      _sum: { amount: true },
      _count: { id: true },
    }),

    prisma.expense.aggregate({
      where: expensesWhere,
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = decimalToNumber(ridesAgg._sum.amount);
  const totalExpenses = decimalToNumber(expensesAgg._sum.amount);
  const totalRides = ridesAgg._count.id ?? 0;

  const netIncome = totalIncome - totalExpenses;
  const avgIncomePerRide = totalRides > 0 ? totalIncome / totalRides : 0;

  
  const incomeByDayRaw = await prisma.ride.groupBy({
    by: ["date"],
    where: ridesWhere,
    _sum: { amount: true },
    orderBy: { date: "asc" },
  });

  const incomeByDay = incomeByDayRaw.map((item) => ({
    date: item.date.toISOString(), // yyyy-mm-dd
    amount: decimalToNumber(item._sum.amount),
  }));

 
  const expensesByCategoryRaw = await prisma.expense.groupBy({
    by: ["category"],
    where: expensesWhere,
    _sum: { amount: true },
  });

  const expensesByCategory = expensesByCategoryRaw.map((item) => ({
    category: item.category,
    amount: decimalToNumber(item._sum.amount),
  }));

  const expensesTotalForPercentage = expensesByCategory.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  const expensesByCategoryPercentage = expensesByCategory.map((item) => ({
    category: item.category,
    percentage:
      expensesTotalForPercentage > 0
        ? Number(((item.amount / expensesTotalForPercentage) * 100).toFixed(2))
        : 0,
  }));

 
  const incomeByPlatformRaw = await prisma.ride.groupBy({
    by: ["platform"],
    where: ridesWhere,
    _sum: { amount: true },
  });

  const incomeTotalForPercentage = incomeByPlatformRaw.reduce(
    (sum, item) => sum + decimalToNumber(item._sum.amount),
    0,
  );

  const incomeByPlatformPercentage = incomeByPlatformRaw.map((item) => ({
    platform: item.platform,
    percentage:
      incomeTotalForPercentage > 0
        ? Number(
            (
              (decimalToNumber(item._sum.amount) / incomeTotalForPercentage) *
              100
            ).toFixed(2),
          )
        : 0,
  }));

 
  return {
    period: {
      from: formatInTimeZone(startUtc, userTimeZone, "yyyy-MM-dd'T'HH:mm:ss"),
      to: formatInTimeZone(endUtc, userTimeZone, "yyyy-MM-dd'T'HH:mm:ss"),
      days,
      timezone: userTimeZone
    },
    kpis: {
      totalIncome,
      totalExpenses,
      totalRides,
      netIncome,
      avgIncomePerRide,
    },
    charts: {
      incomeByDay,
      expensesByCategory,
      expensesByCategoryPercentage,
      incomeByPlatformPercentage,
    },
  };
};
