-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `teamName` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NULL DEFAULT 'leader',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_teamName_idx`(`teamName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `runs` (
    `id` VARCHAR(191) NOT NULL,
    `repoUrl` VARCHAR(191) NOT NULL,
    `teamName` VARCHAR(191) NOT NULL,
    `leaderName` VARCHAR(191) NOT NULL,
    `branchName` VARCHAR(191) NOT NULL,
    `failuresDetected` INTEGER NOT NULL DEFAULT 0,
    `fixesApplied` INTEGER NOT NULL DEFAULT 0,
    `commitCount` INTEGER NOT NULL DEFAULT 0,
    `finalStatus` ENUM('FIXED', 'FAILED', 'PASSED', 'FAILED_RUN', 'RUNNING') NOT NULL DEFAULT 'RUNNING',
    `timeTaken` VARCHAR(191) NULL,
    `durationSeconds` INTEGER NULL,
    `baseScore` INTEGER NOT NULL DEFAULT 100,
    `speedBonus` INTEGER NOT NULL DEFAULT 0,
    `efficiencyPenalty` INTEGER NOT NULL DEFAULT 0,
    `finalScore` INTEGER NOT NULL DEFAULT 100,
    `retryLimit` INTEGER NOT NULL DEFAULT 5,
    `iterationsUsed` INTEGER NOT NULL DEFAULT 0,
    `resultsJsonPath` VARCHAR(191) NULL,
    `errorMessage` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `runs_repoUrl_idx`(`repoUrl`),
    INDEX `runs_teamName_leaderName_idx`(`teamName`, `leaderName`),
    INDEX `runs_userId_idx`(`userId`),
    INDEX `runs_branchName_idx`(`branchName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fixes` (
    `id` VARCHAR(191) NOT NULL,
    `file` VARCHAR(191) NOT NULL,
    `bugType` ENUM('LINTING', 'SYNTAX', 'LOGIC', 'TYPE_ERROR', 'IMPORT', 'INDENTATION') NOT NULL,
    `lineNumber` INTEGER NULL,
    `commitMessage` VARCHAR(191) NOT NULL,
    `status` ENUM('FIXED', 'FAILED', 'PASSED', 'FAILED_RUN', 'RUNNING') NOT NULL DEFAULT 'FIXED',
    `description` VARCHAR(191) NULL,
    `runId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fixes_runId_idx`(`runId`),
    INDEX `fixes_bugType_idx`(`bugType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `iterations` (
    `id` VARCHAR(191) NOT NULL,
    `iterationNumber` INTEGER NOT NULL,
    `status` ENUM('FIXED', 'FAILED', 'PASSED', 'FAILED_RUN', 'RUNNING') NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `details` VARCHAR(191) NULL,
    `logSnippet` VARCHAR(191) NULL,
    `runId` VARCHAR(191) NOT NULL,

    INDEX `iterations_runId_idx`(`runId`),
    INDEX `iterations_timestamp_idx`(`timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `runs` ADD CONSTRAINT `runs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fixes` ADD CONSTRAINT `fixes_runId_fkey` FOREIGN KEY (`runId`) REFERENCES `runs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `iterations` ADD CONSTRAINT `iterations_runId_fkey` FOREIGN KEY (`runId`) REFERENCES `runs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
