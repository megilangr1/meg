/*
  Warnings:

  - You are about to drop the `project_fact` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `project_fact` DROP FOREIGN KEY `project_fact_projectId_fkey`;

-- DropTable
DROP TABLE `project_fact`;
