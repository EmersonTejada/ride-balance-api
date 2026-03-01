export interface ReportPeriod {
  from: string;
  to: string;
  days: number;
  timezone: string;
}

export interface ReportKPIs {
  totalIncome: number | string;
  totalExpenses: number | string;
  totalRides: number;
  netIncome: number | string;
  avgIncomePerRide: number | string;
}

export interface AmountByDate {
  date: string;
  amount: number | string;
}

export interface AmountByCategory {
  category: string;
  amount: number | string;
}

export interface PercentageByCategory {
  category: string;
  percentage: number | string;
}

export interface PercentageByPlatform {
  platform: string;
  percentage: number | string;
}

export interface ReportSummary {
  period: ReportPeriod;
  kpis: ReportKPIs;
  charts: {
    incomeByDay: AmountByDate[];
    expensesByCategory: AmountByCategory[];
    expensesByCategoryPercentage: PercentageByCategory[];
    incomeByPlatformPercentage: PercentageByPlatform[];
  };
}
