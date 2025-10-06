/*
  Warnings:

  - Added the required column `usageId` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "usageId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Usage" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "totalApiCalls" INTEGER NOT NULL DEFAULT 0,
    "errorCalls" INTEGER NOT NULL DEFAULT 0,
    "totalTokensUsed" INTEGER NOT NULL DEFAULT 0,
    "totalMessages" INTEGER NOT NULL DEFAULT 0,
    "totalThreads" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "Usage_id_key" ON "Usage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Usage_projectId_key" ON "Usage"("projectId");

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_usageId_fkey" FOREIGN KEY ("usageId") REFERENCES "Usage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usage" ADD CONSTRAINT "Usage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
