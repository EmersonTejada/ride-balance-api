import { prisma } from "../prisma/index.js";
import bcrypt from "bcrypt";
import { NewUser, User, UserWithoutPassword, UpdateUser } from "../types/user.js";

export const createUser = async (user: NewUser): Promise<UserWithoutPassword> => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: hashedPassword,
      name: user.name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return newUser;
};

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};

export const findUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user;
};

export const updateUser = async (id: string, user: UpdateUser): Promise<UserWithoutPassword> => {
  const data: any = { ...user };
  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10);
  }
  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return updatedUser;
};

export const deleteUser = async (id: string): Promise<UserWithoutPassword> => {
  const deletedUser = await prisma.user.delete({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return deletedUser;
};
