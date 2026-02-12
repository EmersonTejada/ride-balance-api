import { ReportPeriod } from "./report";

export interface ExpensesReport {
  period: ReportPeriod;
  kpis: {
    totalExpenses: number;
  };
  charts: {
    expensesByDay: {
      date: string;
      amount: number;
    }[];
    expensesByCategory: {
      category: string;
      amount: number;
      percentage: number;
    }[];
  };
}
