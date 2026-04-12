import { AmountByDate, ReportKPIs, ReportPeriod } from "./report.js";


export interface WeeklyDashboard {
  period: ReportPeriod
  kpis: ReportKPIs
  charts: {
    incomeByDay: AmountByDate[];
  };
}
