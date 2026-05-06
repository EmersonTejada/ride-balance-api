import { prisma } from "../prisma/index.js";
import { differenceInCalendarDays } from "date-fns";
import { decimalToNumber } from "../utils/decimal.js";
import { RidesReport } from "../types/ridesReport.js";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

export const getRidesReport = async (
  userId: string,
  from: string,
  to: string,
  userTimeZone: string,
): Promise<RidesReport> => {
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

  const ridesAgg = await prisma.ride.aggregate({
    where,
    _sum: { amount: true },
    _count: { id: true },
  });

  const totalIncome = decimalToNumber(ridesAgg._sum.amount);
  const totalRides = ridesAgg._count.id ?? 0;
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

  const incomeByPlatformRaw = await prisma.ride.groupBy({
    by: ["platform"],
    where,
    _sum: { amount: true },
  });

  const totalForPercentage = incomeByPlatformRaw.reduce(
    (sum, item) => sum + decimalToNumber(item._sum.amount),
    0,
  );

  const incomeByPlatform = incomeByPlatformRaw.map((item) => {
    const amount = decimalToNumber(item._sum.amount);
    return {
      platform: item.platform,
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
      totalIncome: totalIncome.toFixed(2),
      totalRides,
      avgIncomePerRide: avgIncomePerRide.toFixed(2),
    },
    charts: {
      incomeByDay,
      incomeByPlatform,
    },
  };
};
