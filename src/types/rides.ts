export interface Ride {
    id: string 
    amount: number
    date: Date
    platform: "Yummy" | "Ridery" | "Particular"
}

export type NewRide = Omit<Ride, "id" | "date">

export type UpdateRide = Partial<Ride>

export type RideFilters = {
    platform?: string
    from?: string
    to?: string
}