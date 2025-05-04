/*
  Warnings:

  - You are about to drop the column `address` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `suppliers` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `sale_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "customers_email_key";

-- DropIndex
DROP INDEX "employees_email_key";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "address",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone",
ADD COLUMN     "personId" TEXT;

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "address",
DROP COLUMN "birthDate",
DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phone",
ADD COLUMN     "personId" TEXT;

-- AlterTable
ALTER TABLE "sale_items" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "address",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone",
ADD COLUMN     "personId" TEXT;

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "address" TEXT,
    "birthDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phone" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "personId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Phone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_email_key" ON "Person"("email");

-- AddForeignKey
ALTER TABLE "Phone" ADD CONSTRAINT "Phone_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
