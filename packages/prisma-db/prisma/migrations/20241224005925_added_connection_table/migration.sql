/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "boilerplate_schema"."User" ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "boilerplate_schema"."Connection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'New Connection',
    "type" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "boilerplate_schema"."Connection" ADD CONSTRAINT "Connection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "boilerplate_schema"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
