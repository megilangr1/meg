-- CreateTable
CREATE TABLE `project` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` TEXT NOT NULL,
    `summary` TEXT NOT NULL,
    `description` TEXT NULL,
    `role` TEXT NULL,
    `year` INTEGER NULL,
    `techStack` TEXT NULL,
    `bannerPath` TEXT NULL,
    `bannerAlt` TEXT NULL,
    `publishedAt` DATETIME(3) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `project_slug_key`(`slug`),
    INDEX `project_publishedAt_sortOrder_idx`(`publishedAt`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_asset` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `kind` ENUM('image', 'video', 'document') NOT NULL,
    `path` TEXT NOT NULL,
    `originalName` TEXT NULL,
    `mime` TEXT NOT NULL,
    `size` INTEGER NOT NULL,
    `caption` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `project_asset_projectId_kind_sortOrder_idx`(`projectId`, `kind`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_fact` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `label` TEXT NOT NULL,
    `value` TEXT NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    INDEX `project_fact_projectId_sortOrder_idx`(`projectId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `project_asset` ADD CONSTRAINT `project_asset_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_fact` ADD CONSTRAINT `project_fact_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;