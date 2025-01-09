import { modifyName } from "@repo/prisma-db/repo/user";
import { NextResponse } from "next/server";
import { shareRoute } from "../../shareRoute";

export async function POST(request: Request) {
    return shareRoute(request, async (req:Request,body:any) => {
        const { id, name } = body;
        const user = await modifyName(id, name);
        return NextResponse.json({ user });
    });
}