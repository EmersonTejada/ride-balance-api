export interface ExpensesReport {
  period: {
    from: Date;
    to: Date;
    days: number;
  };
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
