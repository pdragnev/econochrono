/*
  Warnings:

  - You are about to drop the `dayaggregate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `dayaggregate` DROP FOREIGN KEY `DayAggregate_stockId_fkey`;

-- DropTable
DROP TABLE `dayaggregate`;
