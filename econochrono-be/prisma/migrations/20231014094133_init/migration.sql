-- CreateTable
CREATE TABLE `Stock` (
    `stockId` INTEGER NOT NULL AUTO_INCREMENT,
    `stockName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Stock_stockName_key`(`stockName`),
    PRIMARY KEY (`stockId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PriceHistory` (
    `entryId` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `stockId` INTEGER NOT NULL,

    PRIMARY KEY (`entryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PriceHistory` ADD CONSTRAINT `PriceHistory_stockId_fkey` FOREIGN KEY (`stockId`) REFERENCES `Stock`(`stockId`) ON DELETE RESTRICT ON UPDATE CASCADE;
