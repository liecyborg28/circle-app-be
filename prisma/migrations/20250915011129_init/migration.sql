-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_updated_by_fkey";

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "created_by" DROP NOT NULL,
ALTER COLUMN "updated_by" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
