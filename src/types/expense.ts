type ExpenseCategory =
  | "fuel"
  | "maintenance"
  | "food"
  | "insurance"
  | "parking"
  | "phone"
  | "tolls"
  | "other";
type ExpenseSubcategory =
  | "fuel_refill"
  | "oil_change"
  | "oil_refill"
  | "repair"
  | "spare_part"
  | "tire"
  | "brake"
  | "battery"
  | "cleaning"
  | "accessory"
  | "unknown";

export interface Expense {
  id: string;
  amount: number;
  description?: string;
  date: Date;
  category: ExpenseCategory;
  subcategory?: ExpenseSubcategory;
  userId: string;
}

export type NewExpense = Omit<Expense, "id" | "date" | "userId">;

export type UpdateExpense = Partial<Omit<Expense, "id" | "userId">>;

export type ExpenseFilters = {
  category?: string;
  subcategory?: string;
  from?: string;
  to?: string;
};
