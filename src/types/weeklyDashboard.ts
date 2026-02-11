import { AmountByDate, ReportKPIs, ReportPeriod } from "./report";


export interface WeeklyDashboard {
  period: ReportPeriod
  kpis: ReportKPIs
  charts: {
    incomeByDay: AmountByDate[];
  };
}
