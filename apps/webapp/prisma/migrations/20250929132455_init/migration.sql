/*
  Warnings:

  - The `created_at` column on the `ApiKey` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `allowedOrgin` on the `Project` table. All the data in the column will be lost.
  - Added the required column `allowedOrigin` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ApiKey" DROP COLUMN "created_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "allowedOrgin",
ADD COLUMN     "allowedOrigin" TEXT NOT NULL;
