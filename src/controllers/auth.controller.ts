import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { LoginUser, NewUser, UpdateUser } from "../types/user";
import * as userModel from "../models/auth.model.js";
import { AppError } from "../errors/AppError.js";

export const createUser: RequestHandler<{}, {}, NewUser, {}> = async (
  req,
  res
) => {
  const user = req.body;
  const newUser = await userModel.createUser(user);
  res.json({ message: "Usuario creado exitosamente", data: newUser });
};

export const login: RequestHandler<{}, {}, LoginUser, {}> = async (
  req,
  res
) => {
  const loginUser = req.body;
  const user = await userModel.findUserByEmail(loginUser.email);
  if (!user) {
    throw new AppError("Usuario no existe", 401);
  }
  const isPasswordValid = await bcrypt.compare(
    loginUser.password,
    user.password
  );
  if (!isPasswordValid) {
    throw new AppError("Contraseña incorrecta", 401);
  }
  const token = jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
  res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.VERCEL_ENV === "production",
      sameSite: "none",
      maxAge: 1000 * 60 * 60,
    })
    .json({
      message: "Login exitoso",
    });
};

export const getUserProfile: RequestHandler = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    throw new AppError("No autenticado", 401);
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      name: string;
    };
    res.json({
      message: "Usuario Verificado",
      data: {
        user: {
          id: user.userId,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (err) {
    throw new AppError("Token inválido", 401);
  }
};

export const updateUser: RequestHandler<{}, {}, UpdateUser, {}> = async (
  req,
  res
) => {
  const updatedUser = await userModel.updateUser(req.userId, req.body);
  res.json({ message: "Usuario actualizado exitosamente", data: updatedUser });
};

export const deleteUser: RequestHandler = async (req, res) => {
  const deletedUser = await userModel.deleteUser(req.userId);
  res.clearCookie("access_token");
  res.json({ message: "Usuario eliminado exitosamente", data: deletedUser });
};

export const logout: RequestHandler = async (req, res) => {
  console.log("Logout called, cookies before clear:", req.cookies);
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  console.log("Cookie cleared");
  res.json({ message: "Logout exitoso", data: null });
};
