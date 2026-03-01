import { ReportPeriod } from "./report";

export interface ExpensesReport {
  period: ReportPeriod;
  kpis: {
    totalExpenses: number | string;
  };
  charts: {
    expensesByDay: {
      date: string;
      amount: number | string;
    }[];
    expensesByCategory: {
      category: string;
      amount: number | string;
      percentage: number | string;
    }[];
  };
}
