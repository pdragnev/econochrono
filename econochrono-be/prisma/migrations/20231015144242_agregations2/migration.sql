/*
  Warnings:

  - You are about to drop the column `closePrice` on the `dayaggregate` table. All the data in the column will be lost.
  - You are about to drop the column `openPrice` on the `dayaggregate` table. All the data in the column will be lost.
  - You are about to drop the column `closePrice` on the `houraggregate` table. All the data in the column will be lost.
  - You are about to drop the column `openPrice` on the `houraggregate` table. All the data in the column will be lost.
  - You are about to drop the column `closePrice` on the `minuteaggregate` table. All the data in the column will be lost.
  - You are about to drop the column `openPrice` on the `minuteaggregate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `dayaggregate` DROP COLUMN `closePrice`,
    DROP COLUMN `openPrice`;

-- AlterTable
ALTER TABLE `houraggregate` DROP COLUMN `closePrice`,
    DROP COLUMN `openPrice`;

-- AlterTable
ALTER TABLE `minuteaggregate` DROP COLUMN `closePrice`,
    DROP COLUMN `openPrice`;
