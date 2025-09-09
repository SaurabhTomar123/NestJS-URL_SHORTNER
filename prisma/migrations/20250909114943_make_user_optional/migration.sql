-- DropForeignKey
ALTER TABLE `short_url` DROP FOREIGN KEY `short_url_userId_fkey`;

-- AlterTable
ALTER TABLE `short_url` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `short_url` ADD CONSTRAINT `short_url_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
