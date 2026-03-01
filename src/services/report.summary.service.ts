import { prisma } from "../prisma/index.js";
import { differenceInCalendarDays } from "date-fns";
import { ReportSummary } from "../types/report.js";
import { decimalToNumber } from "../utils/decimal.js";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

export const getReportSummary = async (
  userId: string,
  from: string,
  to: string,
  userTimeZone: string,
): Promise<ReportSummary> => {
  const startInUserZone = new Date(`${from}T00:00:00`);
  const endInUserZone = new Date(`${to}T23:59:59.999`);

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

  const incomeByDayRaw = await prisma.$queryRaw<{ day: Date; total: number }[]>`
SELECT 
  DATE_TRUNC(
    'day',
    date AT TIME ZONE 'UTC' AT TIME ZONE ${userTimeZone}
  ) AS day,
  SUM(amount) AS total
FROM "Ride"
WHERE "userId" = ${userId}
  AND date >= ${startUtc}
  AND date <= ${endUtc}
GROUP BY day
ORDER BY day ASC;
`;

  const incomeByDay = incomeByDayRaw.map((item) => ({
    date: item.day.toISOString().split("T")[0],
    amount: Number(item.total).toFixed(2),
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

  const expensesByCategoryFormatted = expensesByCategory.map((item) => ({
    ...item,
    amount: item.amount.toFixed(2),
  }));

  const expensesByCategoryPercentage = expensesByCategory.map((item) => ({
    category: item.category,
    percentage:
      expensesTotalForPercentage > 0
        ? ((item.amount / expensesTotalForPercentage) * 100).toFixed(2)
        : "0.00",
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
        ? (
            (decimalToNumber(item._sum.amount) / incomeTotalForPercentage) *
            100
          ).toFixed(2)
        : "0.00",
  }));

  return {
    period: {
      from: formatInTimeZone(startUtc, userTimeZone, "yyyy-MM-dd'T'HH:mm:ss"),
      to: formatInTimeZone(endUtc, userTimeZone, "yyyy-MM-dd'T'HH:mm:ss"),
      days,
      timezone: userTimeZone,
    },
    kpis: {
      totalIncome: totalIncome.toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
      totalRides,
      netIncome: netIncome.toFixed(2),
      avgIncomePerRide: avgIncomePerRide.toFixed(2),
    },
    charts: {
      incomeByDay,
      expensesByCategory: expensesByCategoryFormatted,
      expensesByCategoryPercentage,
      incomeByPlatformPercentage,
    },
  };
};
