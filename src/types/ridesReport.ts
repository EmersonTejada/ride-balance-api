import { AmountByDate, ReportKPIs, ReportPeriod } from "./report";

export interface RidesReport {
  period: ReportPeriod;
  kpis: Omit<ReportKPIs, "totalExpenses" | "netIncome">;
  charts: {
    incomeByDay: AmountByDate[];
    incomeByPlatform: {
      platform: string;
      amount: number | string;
      percentage: number | string;
    }[];
  };
}
