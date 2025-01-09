import { createConnection } from "@repo/prisma-db/repo/connection";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { name, type, userId, details} = await request.json();
    await createConnection({
        name: name,
        type: type,
        userId: userId,
        details: details
    })
    return NextResponse.json({  });
}