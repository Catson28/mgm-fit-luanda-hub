/*
  Warnings:

  - Made the column `productId` on table `alerts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "alerts" ALTER COLUMN "productId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
