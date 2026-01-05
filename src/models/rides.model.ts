import { prisma } from "../prisma/index.js";
import { NewRide, Ride, RideFilters, UpdateRide } from "../types/rides";

export const createRide = async (ride: NewRide) => {
  const newRide = prisma.ride.create({
    data: {
      amount: ride.amount,
      platform: ride.platform,
    },
  });
  return newRide;
};

export const getAllRides = async (filters?: RideFilters) => {
  let result = prisma.ride.findMany({});

  // if (filters?.platform) {
  //   result = result.filter((r) => r.platform === filters.platform);
  // }
  // if (filters?.from) {
  //   const fromDate = new Date(filters.from);
  //   result = result.filter((r) => r.date >= fromDate);
  // }

  // if (filters?.to) {
  //   const toDate = new Date(filters.to);
  //   result = result.filter((r) => r.date <= toDate);
  // }

  return result;
};

export const getRideById = async (RideId: string) => {
  const filteredRide = prisma.ride.findUnique({
    where: {
      id: RideId,
    },
  });
  return filteredRide;
};

export const deleteRide = async (RideId: string) => {
  const deletedRide = prisma.ride.deleteMany({
    where: {
      id: RideId,
    },
  });
  return deletedRide;
};

export const updatedRide = async (RideId: string, ride: UpdateRide) => {
  const updatedRide = prisma.ride.updateManyAndReturn({
    where: {
      id: RideId,
    },
    data: {
      amount: ride.amount,
      platform: ride.platform,
    },
  });
  return updatedRide;
};
