/*
  Warnings:

  - You are about to drop the column `tokensUsed` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "boilerplate_schema"."User" DROP COLUMN "tokensUsed",
ADD COLUMN     "creditsUsed" INTEGER NOT NULL DEFAULT 0;
