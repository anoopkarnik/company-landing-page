"use server"


import { getUserById } from "@repo/prisma-db/repo/user";

export const getUserDetails = async (id: string) => {
    const user = await getUserById(id);
    return user;
}