export interface ReportPeriod {
  from: string;
  to: string;
  days: number;
  timezone: string
}

export interface ReportKPIs {
  totalIncome: number;
  totalExpenses: number;
  totalRides: number;
  netIncome: number;
  avgIncomePerRide: number;
}

export interface AmountByDate {
  date: string;
  amount: number;
}

export interface AmountByCategory {
  category: string;
  amount: number;
}

export interface PercentageByCategory {
  category: string;
  percentage: number;
}

export interface PercentageByPlatform {
  platform: string;
  percentage: number;
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
