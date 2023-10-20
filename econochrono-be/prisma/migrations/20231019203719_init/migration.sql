/*
  Warnings:

  - You are about to drop the column `startOfHour` on the `houraggregate` table. All the data in the column will be lost.
  - You are about to drop the column `startOfMinute` on the `minuteaggregate` table. All the data in the column will be lost.
  - Added the required column `timestamp` to the `HourAggregate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `MinuteAggregate` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `HourAggregate_startOfHour_idx` ON `houraggregate`;

-- DropIndex
DROP INDEX `MinuteAggregate_startOfMinute_idx` ON `minuteaggregate`;

-- AlterTable
ALTER TABLE `houraggregate` DROP COLUMN `startOfHour`,
    ADD COLUMN `timestamp` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `minuteaggregate` DROP COLUMN `startOfMinute`,
    ADD COLUMN `timestamp` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE INDEX `HourAggregate_timestamp_idx` ON `HourAggregate`(`timestamp`);

-- CreateIndex
CREATE INDEX `MinuteAggregate_timestamp_idx` ON `MinuteAggregate`(`timestamp`);
