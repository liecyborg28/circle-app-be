-- AlterTable
ALTER TABLE "public"."Reply" ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Thread" ALTER COLUMN "content" DROP NOT NULL;
