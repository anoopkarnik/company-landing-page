"use server"

import { createResetToken } from '@repo/prisma-db/repo/user';
import { sendResetEmail } from '@repo/resend-email/mail';
import { getUserByEmail } from '@repo/prisma-db/repo/user';
import { DataResultProps } from '@repo/ts-types/auth/v1';

export const ForgotPassword = async (email: string): Promise<DataResultProps> => {
    const existingEmail = await getUserByEmail(email);
    if (!existingEmail){
        return {error: "Email doesn't exist!"}
    }
    try{
        const newToken = await createResetToken(email);
        await sendResetEmail(email, newToken.token);
        return {success: "Email with Reset Token sent!"}
    }
    catch {
        return {error: "Something went wrong!"}
    }
}