import { deleteConnection } from "@repo/prisma-db/repo/connection";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { id } = await request.json();
    await deleteConnection(id);
    return NextResponse.json({  });
}