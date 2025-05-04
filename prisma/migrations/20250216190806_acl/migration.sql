/*
  Warnings:

  - The primary key for the `RolePermission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `person_id` on the `User` table. All the data in the column will be lost.
  - The primary key for the `UserRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Addresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bonus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Deductions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Employees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Overtime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payroll` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `People` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PeopleImages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Phones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TimeAndAttendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSecuritySettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RolePermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserRoles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[roleId,permissionId]` on the table `RolePermission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,roleId]` on the table `UserRole` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `resource` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `RolePermission` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `UserRole` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE');

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Addresses" DROP CONSTRAINT "Addresses_person_id_fkey";

-- DropForeignKey
ALTER TABLE "Bonus" DROP CONSTRAINT "Bonus_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "Deductions" DROP CONSTRAINT "Deductions_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "Employees" DROP CONSTRAINT "Employees_person_id_fkey";

-- DropForeignKey
ALTER TABLE "Overtime" DROP CONSTRAINT "Overtime_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "PaymentHistory" DROP CONSTRAINT "PaymentHistory_payroll_id_fkey";

-- DropForeignKey
ALTER TABLE "Payroll" DROP CONSTRAINT "Payroll_department_id_fkey";

-- DropForeignKey
ALTER TABLE "Payroll" DROP CONSTRAINT "Payroll_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "PeopleImages" DROP CONSTRAINT "PeopleImages_image_id_fkey";

-- DropForeignKey
ALTER TABLE "PeopleImages" DROP CONSTRAINT "PeopleImages_person_id_fkey";

-- DropForeignKey
ALTER TABLE "Phones" DROP CONSTRAINT "Phones_person_id_fkey";

-- DropForeignKey
ALTER TABLE "TimeAndAttendance" DROP CONSTRAINT "TimeAndAttendance_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "TwoFactorConfirmation" DROP CONSTRAINT "TwoFactorConfirmation_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_person_id_fkey";

-- DropForeignKey
ALTER TABLE "UserSecuritySettings" DROP CONSTRAINT "UserSecuritySettings_userId_fkey";

-- DropForeignKey
ALTER TABLE "_RolePermissions" DROP CONSTRAINT "_RolePermissions_A_fkey";

-- DropForeignKey
ALTER TABLE "_RolePermissions" DROP CONSTRAINT "_RolePermissions_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserRoles" DROP CONSTRAINT "_UserRoles_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserRoles" DROP CONSTRAINT "_UserRoles_B_fkey";

-- DropIndex
DROP INDEX "User_person_id_key";

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "description" TEXT,
ADD COLUMN     "resource" TEXT NOT NULL,
ADD COLUMN     "type" "PermissionType" NOT NULL;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "person_id",
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT,
ADD COLUMN     "isTwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Addresses";

-- DropTable
DROP TABLE "Bonus";

-- DropTable
DROP TABLE "Deductions";

-- DropTable
DROP TABLE "Department";

-- DropTable
DROP TABLE "Employees";

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "Overtime";

-- DropTable
DROP TABLE "PaymentHistory";

-- DropTable
DROP TABLE "Payroll";

-- DropTable
DROP TABLE "People";

-- DropTable
DROP TABLE "PeopleImages";

-- DropTable
DROP TABLE "Phones";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "TimeAndAttendance";

-- DropTable
DROP TABLE "UserSecuritySettings";

-- DropTable
DROP TABLE "_RolePermissions";

-- DropTable
DROP TABLE "_UserRoles";

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TwoFactorConfirmation" ADD CONSTRAINT "TwoFactorConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
