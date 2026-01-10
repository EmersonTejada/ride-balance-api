export interface User {
    id: string
    email: string
    password: string
    name: string
    createdAt: Date
    updatedAt: Date
}

export type NewUser = Omit<User, "id" | "createdAt" | "updatedAt">

export type LoginUser = Omit<User, "id" | "createdAt" | "updatedAt" | "name">

export type UserWithoutPassword = Omit<User, "password">

export type UpdateUser = Partial<User>