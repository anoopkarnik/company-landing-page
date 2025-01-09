/*
  Warnings:

  - The required column `id` was added to the `Session` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "boilerplate_schema"."Session" ADD COLUMN     "device" TEXT,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "location" TEXT,
ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("id");
