export interface RidesReport {
  period: {
    from: Date;
    to: Date;
    days: number;
  };
  kpis: {
    totalIncome: number;
    totalRides: number;
    avgIncomePerRide: number;
  };
  charts: {
    incomeByDay: {
      date: string;
      amount: number;
    }[];
    incomeByPlatform: {
      platform: string;
      amount: number;
      percentage: number;
    }[];
  };
}
