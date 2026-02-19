-- AlterTable
ALTER TABLE `users` ADD COLUMN `otp` VARCHAR(6) NULL,
    ADD COLUMN `otpCreatedAt` DATETIME(3) NULL;
