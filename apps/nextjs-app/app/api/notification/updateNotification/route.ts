import { updateNotification } from "@repo/prisma-db/repo/notification";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const {id} = await request.json();
    await updateNotification(id,true);
    return NextResponse.json({});
}