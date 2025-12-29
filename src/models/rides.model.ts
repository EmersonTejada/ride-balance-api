import { NewRide, Ride, RideFilters, UpdateRide } from "../types/rides";

let rides: Ride[] = [];

export const createRide = (ride: NewRide) => {
  const newRide = {
    id: crypto.randomUUID(),
    amount: ride.amount,
    date: new Date(),
    platform: ride.platform,
  };
  rides.push(newRide);
  return newRide;
};

export const getAllRides = (filters?: RideFilters) => {
  let result = rides;

  if (filters?.platform) {
    result = result.filter((r) => r.platform === filters.platform);
  }
  if (filters?.from) {
    const fromDate = new Date(filters.from);
    result = result.filter((r) => r.date >= fromDate);
  }

  if (filters?.to) {
    const toDate = new Date(filters.to);
    result = result.filter((r) => r.date <= toDate);
  }

  if (result.length === 0) {
    throw new Error("No se ha encontrado ningun viaje");
  }
  return result;
};

export const getRideById = (id: string) => {
  const filteredRide = rides.find((r) => r.id === id);
  if (!filteredRide) {
    throw new Error(`No se ha encontrado un viaje con el id ${id}`);
  }
  return filteredRide;
};

export const deleteRide = (id: string) => {
  const deletedRide = rides.filter((r) => r.id === id);
  if (deletedRide.length === 0) {
    throw new Error(`No existe un viaje con el id ${id}`);
  }
  rides = rides.filter((r) => r.id !== id);
  return deletedRide;
};

export const updatedRide = (id: string, ride: UpdateRide) => {
  let updatedRide = null;

  rides = rides.map((r) => {
    if (r.id === id) {
      updatedRide = { ...r, ...ride };
      return updatedRide;
    }
    return r;
  });

  if (!updatedRide) {
    throw new Error(`No existe un viaje con el id ${id}`);
  }

  return updatedRide;
};
