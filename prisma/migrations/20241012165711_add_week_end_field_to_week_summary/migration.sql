/*
  Warnings:

  - You are about to drop the column `completedGoals` on the `weekSummaries` table. All the data in the column will be lost.
  - Added the required column `completionsCount` to the `weekSummaries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekEnd` to the `weekSummaries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "weekSummaries" DROP COLUMN "completedGoals",
ADD COLUMN     "completionsCount" INTEGER NOT NULL,
ADD COLUMN     "weekEnd" TIMESTAMP(3) NOT NULL;
