// app/api/settings/modifyAvatar/route.ts
import { NextResponse } from "next/server";
import { modifyAvatar } from "@repo/prisma-db/repo/user";
import { putBlob } from "@repo/storage/vercel-blob";
import { shareRoute } from "../../shareRoute";

export async function POST(request: Request) {
  return shareRoute(request, async (req: Request, formData: any) => {

    // 2. Extract fields
    const id = formData.get("id") as string; 
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Upload to Vercel Blob
    const filename = (file as File).name || "avatar.png";
    const response = await putBlob({
      filename,
      body: file,
      token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
    });

    // 4. Once uploaded, get the resulting URL and update DB
    const url = response.url; 
    const user = await modifyAvatar(id, url);
    // 5. Return the updated user object (or whatever you need)
    return NextResponse.json({ user });
  });
}
