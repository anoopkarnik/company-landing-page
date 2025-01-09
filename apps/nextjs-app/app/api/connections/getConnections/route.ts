import { getConnectionsByUser } from "@repo/prisma-db/repo/connection";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { userId } = await request.json();
    const connections = await getConnectionsByUser(userId);
    return NextResponse.json({ connections  });
}