import db from "@repo/prisma-db/client"
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { id } = await request.json();
    await db.user.delete({
        where: {id}
    })
    return NextResponse.json({  });

}