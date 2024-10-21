/*
  Warnings:

  - You are about to drop the column `userId` on the `groupGoalCompletions` table. All the data in the column will be lost.
  - Added the required column `memberId` to the `groupGoalCompletions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "groupGoalCompletions" DROP CONSTRAINT "groupGoalCompletions_userId_fkey";

-- AlterTable
ALTER TABLE "groupGoalCompletions" DROP COLUMN "userId",
ADD COLUMN     "memberId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "groupGoalCompletions" ADD CONSTRAINT "groupGoalCompletions_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
