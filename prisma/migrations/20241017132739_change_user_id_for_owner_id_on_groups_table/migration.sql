/*
  Warnings:

  - You are about to drop the column `userId` on the `groups` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `groups` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_userId_fkey";

-- AlterTable
ALTER TABLE "groups" DROP COLUMN "userId",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
