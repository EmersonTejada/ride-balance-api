import { prisma } from "../prisma/index.js";
import { NewRide, Ride, RideFilters, UpdateRide } from "../types/rides";

export const createRide = async (ride: NewRide, userId: string) => {
  const newRide = prisma.ride.create({
    data: {
      amount: ride.amount,
      platform: ride.platform,
      userId,
    },
  });
  return newRide;
};

export const getAllRides = async (userId: string, filters?: RideFilters) => {
  const where: any = { userId };

  if (filters?.platform) {
    where.platform = filters.platform;
  }
  if (filters?.from) {
    where.date = { ...where.date, gte: new Date(filters.from) };
  }
  if (filters?.to) {
    where.date = { ...where.date, lte: new Date(filters.to) };
  }

  const result = await prisma.ride.findMany({
    where,
  });

  return result;
};

export const getRideById = async (RideId: string, userId: string) => {
  const filteredRide = await prisma.ride.findFirst({
    where: {
      id: RideId,
      userId,
    },
  });
  return filteredRide;
};

export const deleteRide = async (RideId: string, userId: string) => {
  const deletedRide = await prisma.ride.deleteMany({
    where: {
      id: RideId,
      userId,
    },
  });
  return deletedRide;
};

export const updatedRide = async (RideId: string, userId: string, ride: UpdateRide) => {
  const updatedRide = await prisma.ride.updateManyAndReturn({
    where: {
      id: RideId,
      userId,
    },
    data: {
      amount: ride.amount,
      platform: ride.platform,
    },
  });
  return updatedRide;
};
