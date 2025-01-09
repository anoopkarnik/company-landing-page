-- CreateEnum
CREATE TYPE "boilerplate_schema"."AccountAccess" AS ENUM ('TRIAL', 'PRO', 'ENTERPRISE', 'UNLIMITED');

-- AlterTable
ALTER TABLE "boilerplate_schema"."User" ADD COLUMN     "access" "boilerplate_schema"."AccountAccess" NOT NULL DEFAULT 'TRIAL',
ADD COLUMN     "tokensUsed" INTEGER NOT NULL DEFAULT 0;
