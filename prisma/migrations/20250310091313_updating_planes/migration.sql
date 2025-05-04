/*
  Warnings:

  - You are about to drop the column `planePositionId` on the `PlaneRole` table. All the data in the column will be lost.
  - You are about to drop the column `planeUserCountId` on the `PlaneRole` table. All the data in the column will be lost.
  - You are about to drop the column `planeUserCountId` on the `role_permissions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlaneRole" DROP CONSTRAINT "PlaneRole_planePositionId_fkey";

-- DropForeignKey
ALTER TABLE "PlaneRole" DROP CONSTRAINT "PlaneRole_planeUserCountId_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_planeUserCountId_fkey";

-- AlterTable
ALTER TABLE "PlaneRole" DROP COLUMN "planePositionId",
DROP COLUMN "planeUserCountId";

-- AlterTable
ALTER TABLE "role_permissions" DROP COLUMN "planeUserCountId";
