/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `groups` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "groups" DROP COLUMN "photoUrl",
ALTER COLUMN "description" DROP NOT NULL;
