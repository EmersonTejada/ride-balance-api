import {
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfISOWeek,
  format,
  startOfISOWeek,
} from "date-fns";
import { prisma } from "../prisma/index.js";
import { WeeklyDashboard } from "../types/weeklyDashboard";
import { decimalToNumber } from "../utils/decimal.js";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

export const getWeeklyDashboard = async (
  userId: string,
  userTimeZone: string,
): Promise<WeeklyDashboard> => {
  // 1. Obtener "ahora" en zona del usuario
  const nowUtc = new Date();
  const nowInUserZone = toZonedTime(nowUtc, userTimeZone);

  // 2. Calcular inicio y fin de semana en esa zona
  const startInUserZone = startOfISOWeek(nowInUserZone);
  const endInUserZone = endOfISOWeek(nowInUserZone);

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

  // Crear mapa de ingresos por día
  const incomeMap = new Map<string, number>();
  incomeByDayRaw.forEach((item) => {
    const dateKey = item.day.toISOString().split("T")[0];
    incomeMap.set(dateKey, Number(item.total));
  });

  // Generar todos los días de la semana con 0 para los que no tienen ingresos
  const allDays = eachDayOfInterval({
    start: startInUserZone,
    end: endInUserZone,
  });
  const incomeByDay = allDays.map((day) => {
    const dateKey = format(day, "yyyy-MM-dd");
    return {
      date: dateKey,
      amount: Number(incomeMap.get(dateKey) ?? 0).toFixed(2),
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
      totalExpenses: totalExpenses.toFixed(2),
      totalRides,
      netIncome: netIncome.toFixed(2),
      avgIncomePerRide: avgIncomePerRide.toFixed(2),
    },
    charts: {
      incomeByDay,
    },
  };
};
