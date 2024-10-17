/*
  Warnings:

  - A unique constraint covering the columns `[inviteCode]` on the table `groups` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "groups_inviteCode_key" ON "groups"("inviteCode");
