/*
  Warnings:

  - Added the required column `desiredWeeklyFrequency` to the `goals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "goals" ADD COLUMN     "desiredWeeklyFrequency" INTEGER NOT NULL;
