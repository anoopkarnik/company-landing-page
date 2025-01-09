import { auth } from "@repo/next-auth/auth";
import { markAllNotificationsAsRead} from "@repo/prisma-db/repo/notification";
import { NextResponse } from "next/server";

export async function POST() {
    const session = await auth()
    const userId = session.user.id;
    
    await markAllNotificationsAsRead(userId)
    return NextResponse.json({  });
}