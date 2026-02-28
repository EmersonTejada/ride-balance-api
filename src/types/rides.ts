export interface Ride {
  id: string;
  amount: number | string;
  date: Date;
  platform: "yummy" | "ridery" | "particular";
  userId: string;
}

export type NewRide = Omit<Ride, "id" | "date" | "userId">;

export type UpdateRide = Partial<Ride>;

export type RideFilters = {
  platform?: string;
  from?: string;
  to?: string;
};
