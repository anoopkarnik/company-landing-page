
import NextAuth from 'next-auth'

import db from '@repo/prisma-db/client'
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getAccountByUserId, getUserById } from "@repo/prisma-db/repo/user"

export const { auth, handlers, signIn, signOut }:any = NextAuth({
    adapter: PrismaAdapter(db),
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        },
    trustHost: true,
    debug: true,
    ...authConfig,
    pages:{
        signIn: '/auth/login',
        error: '/auth/error',
    },
    callbacks:{
        async signIn({user,account}){
            //allow loging it it is not credentials provider
            if(account?.provider !=='credentials')return true;
            const existingUser = await getUserById(user?.id!);

            //prevent login if email is not verified
            if (!existingUser?.emailVerified) return false;
            await db.session.create({
                data:{
                    userId: user?.id || '',
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    sessionToken: account?.id_token || '',
                }
            })

            return true;
        },
        async session({session,token}){
            if (token.sub) {
                // Fetch the latest user data from the database
                session.user.id = token.sub;
                // @ts-ignore
                session.user.image = token.image; 
                
            }
            return session;
        },
        async jwt({token}){
            if(!token.sub) return token;
            const user = await getUserById(token.sub);
            if (!user) return token;
            const account = await getAccountByUserId(user.id);
            if(account){
                token.provider = account.provider;
            }
            token.id = user.id;
            token.role = user.role;
            token.emailVerified = user.emailVerified;
            token.createdAt = user.createdAt;
            token.updatedAt = user.updatedAt;
            token.name = user.name;       // Add name to token
            token.image = user.image;     // Add avatar to token

            return token;
        }
    }
})