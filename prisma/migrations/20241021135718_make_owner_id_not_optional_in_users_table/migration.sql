/*
  Warnings:

  - Made the column `ownerId` on table `goals` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "goals" DROP CONSTRAINT "goals_ownerId_fkey";

-- AlterTable
ALTER TABLE "goals" ALTER COLUMN "ownerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
