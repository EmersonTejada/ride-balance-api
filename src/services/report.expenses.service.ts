import { prisma } from "../prisma/index.js";
import { differenceInCalendarDays } from "date-fns";
import { decimalToNumber } from "../utils/decimal.js";
import { ExpensesReport } from "../types/expensesReport.js";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

export const getExpensesReport = async (
  userId: string,
  from: string,
  to: string,
  userTimeZone: string,
): Promise<ExpensesReport> => {
  const startInUserZone = new Date(`${from}T00:00:00`);
  const endInUserZone = new Date(`${to}T23:59:59.999`);

  const days = differenceInCalendarDays(endInUserZone, startInUserZone) + 1;

  if (days <= 0 || days > 7) {
    throw new Error("Invalid date range");
  }

  const startUtc = fromZonedTime(startInUserZone, userTimeZone);
  const endUtc = fromZonedTime(endInUserZone, userTimeZone);

  const where = {
    userId,
    date: {
      gte: startUtc,
      lte: endUtc,
    },
  };

  const expensesAgg = await prisma.expense.aggregate({
    where,
    _sum: { amount: true },
  });

  const totalExpenses = decimalToNumber(expensesAgg._sum.amount);

  const expensesByDayRaw = await prisma.$queryRaw<
    { day: Date; total: number }[]
  >`
SELECT 
  DATE_TRUNC(
    'day',
    date AT TIME ZONE 'UTC' AT TIME ZONE ${userTimeZone}
  ) AS day,
  SUM(amount) AS total
FROM "Expense"
WHERE "userId" = ${userId}
  AND date >= ${startUtc}
  AND date <= ${endUtc}
GROUP BY day
ORDER BY day ASC;
`;

  const expensesByDay = expensesByDayRaw.map((item) => ({
    date: item.day.toISOString().split("T")[0],
    amount: Number(item.total).toFixed(2),
  }));

  const expensesByCategoryRaw = await prisma.expense.groupBy({
    by: ["category"],
    where,
    _sum: { amount: true },
  });

  const totalForPercentage = expensesByCategoryRaw.reduce(
    (sum, item) => sum + decimalToNumber(item._sum.amount),
    0,
  );

  const expensesByCategory = expensesByCategoryRaw.map((item) => {
    const amount = decimalToNumber(item._sum.amount);
    return {
      category: item.category,
      amount: amount.toFixed(2),
      percentage:
        totalForPercentage > 0
          ? ((amount / totalForPercentage) * 100).toFixed(2)
          : "0.00",
    };
  });

  return {
    period: {
      from: formatInTimeZone(startUtc, userTimeZone, "yyyy-MM-dd'T'HH:mm:ss"),
      to: formatInTimeZone(endUtc, userTimeZone, "yyyy-MM-dd'T'HH:mm:ss"),
      days,
      timezone: userTimeZone,
    },
    kpis: {
      totalExpenses: totalExpenses.toFixed(2),
    },
    charts: {
      expensesByDay,
      expensesByCategory,
    },
  };
};
