/*
  Warnings:

  - You are about to drop the `short_url` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `click_analytics` DROP FOREIGN KEY `click_analytics_shortUrlId_fkey`;

-- DropForeignKey
ALTER TABLE `short_url` DROP FOREIGN KEY `short_url_userId_fkey`;

-- DropTable
DROP TABLE `short_url`;

-- CreateTable
CREATE TABLE `ShortUrl` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shortId` VARCHAR(191) NOT NULL,
    `redirectUrl` VARCHAR(191) NOT NULL,
    `clickCount` INTEGER NOT NULL DEFAULT 0,
    `userId` INTEGER NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ShortUrl_shortId_key`(`shortId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ShortUrl` ADD CONSTRAINT `ShortUrl_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `click_analytics` ADD CONSTRAINT `click_analytics_shortUrlId_fkey` FOREIGN KEY (`shortUrlId`) REFERENCES `ShortUrl`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
