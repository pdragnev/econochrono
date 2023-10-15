-- DropForeignKey
ALTER TABLE `pricehistory` DROP FOREIGN KEY `PriceHistory_stockId_fkey`;

-- CreateTable
CREATE TABLE `MinuteAggregate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startOfMinute` DATETIME(3) NOT NULL,
    `openPrice` DECIMAL(65, 30) NOT NULL,
    `closePrice` DECIMAL(65, 30) NOT NULL,
    `minPrice` DECIMAL(65, 30) NOT NULL,
    `maxPrice` DECIMAL(65, 30) NOT NULL,
    `stockId` INTEGER NOT NULL,

    INDEX `MinuteAggregate_startOfMinute_idx`(`startOfMinute`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HourAggregate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startOfHour` DATETIME(3) NOT NULL,
    `openPrice` DECIMAL(65, 30) NOT NULL,
    `closePrice` DECIMAL(65, 30) NOT NULL,
    `minPrice` DECIMAL(65, 30) NOT NULL,
    `maxPrice` DECIMAL(65, 30) NOT NULL,
    `stockId` INTEGER NOT NULL,

    INDEX `HourAggregate_startOfHour_idx`(`startOfHour`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DayAggregate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startOfDay` DATETIME(3) NOT NULL,
    `openPrice` DECIMAL(65, 30) NOT NULL,
    `closePrice` DECIMAL(65, 30) NOT NULL,
    `minPrice` DECIMAL(65, 30) NOT NULL,
    `maxPrice` DECIMAL(65, 30) NOT NULL,
    `stockId` INTEGER NOT NULL,

    INDEX `DayAggregate_startOfDay_idx`(`startOfDay`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `PriceHistory_timestamp_idx` ON `PriceHistory`(`timestamp`);

-- AddForeignKey
ALTER TABLE `PriceHistory` ADD CONSTRAINT `PriceHistory_stockId_fkey` FOREIGN KEY (`stockId`) REFERENCES `Stock`(`stockId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MinuteAggregate` ADD CONSTRAINT `MinuteAggregate_stockId_fkey` FOREIGN KEY (`stockId`) REFERENCES `Stock`(`stockId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HourAggregate` ADD CONSTRAINT `HourAggregate_stockId_fkey` FOREIGN KEY (`stockId`) REFERENCES `Stock`(`stockId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DayAggregate` ADD CONSTRAINT `DayAggregate_stockId_fkey` FOREIGN KEY (`stockId`) REFERENCES `Stock`(`stockId`) ON DELETE CASCADE ON UPDATE CASCADE;
