import db from "@repo/prisma-db/client"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server";
import { shareRoute } from "../../shareRoute";

export async function POST(request: Request) {
    return shareRoute(request, async(req:Request, body:any) => {
        const { id, password } = body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.user.update({
            where: {id},
            data: {
                password: hashedPassword
            }
        })
        return NextResponse.json({ user });
    });

}