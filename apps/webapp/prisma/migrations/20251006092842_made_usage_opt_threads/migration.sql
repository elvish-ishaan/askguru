-- DropForeignKey
ALTER TABLE "public"."Thread" DROP CONSTRAINT "Thread_usageId_fkey";

-- AlterTable
ALTER TABLE "Thread" ALTER COLUMN "usageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_usageId_fkey" FOREIGN KEY ("usageId") REFERENCES "Usage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
