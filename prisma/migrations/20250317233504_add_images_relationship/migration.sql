/*
  Warnings:

  - Added the required column `discount` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "payment" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "size" TEXT;
