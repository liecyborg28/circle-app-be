/*
  Warnings:

  - Made the column `created_by` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_updated_by_fkey";

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
