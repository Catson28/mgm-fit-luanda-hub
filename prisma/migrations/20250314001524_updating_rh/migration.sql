-- CreateEnum
CREATE TYPE "SalaryStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PayslipStatus" AS ENUM ('DRAFT', 'APPROVED', 'PAID', 'CANCELLED');

-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'MOBILE_MONEY';

-- CreateTable
CREATE TABLE "salaries" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "annualSalary" DECIMAL(10,2) NOT NULL,
    "monthlySalary" DECIMAL(10,2) NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "SalaryStatus" NOT NULL DEFAULT 'ACTIVE',
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payslips" (
    "id" TEXT NOT NULL,
    "payslipNumber" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "payPeriod" TIMESTAMP(3) NOT NULL,
    "baseSalary" DECIMAL(10,2) NOT NULL,
    "transportAllowance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "foodAllowance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "overtimeAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "productivityBonus" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "holidaySubsidy" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "christmasSubsidy" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "otherEarnings" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "irt" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "socialSecurity" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "healthInsurance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "advances" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "otherDeductions" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalEarnings" DECIMAL(10,2) NOT NULL,
    "totalDeductions" DECIMAL(10,2) NOT NULL,
    "netSalary" DECIMAL(10,2) NOT NULL,
    "status" "PayslipStatus" NOT NULL DEFAULT 'DRAFT',
    "generatedBy" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentDate" TIMESTAMP(3),
    "paymentMethod" "PaymentMethod",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payslips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "earning_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "earning_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeductionType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DeductionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayslipEarning" (
    "id" TEXT NOT NULL,
    "payslipId" TEXT NOT NULL,
    "earningTypeId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,

    CONSTRAINT "PayslipEarning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayslipDeduction" (
    "id" TEXT NOT NULL,
    "payslipId" TEXT NOT NULL,
    "deductionTypeId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,

    CONSTRAINT "PayslipDeduction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IRTBracket" (
    "id" TEXT NOT NULL,
    "minSalary" DOUBLE PRECISION NOT NULL,
    "maxSalary" DOUBLE PRECISION,
    "rate" DOUBLE PRECISION NOT NULL,
    "fixedAmount" DOUBLE PRECISION,
    "effectiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "IRTBracket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payslips_payslipNumber_key" ON "payslips"("payslipNumber");

-- AddForeignKey
ALTER TABLE "salaries" ADD CONSTRAINT "salaries_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayslipEarning" ADD CONSTRAINT "PayslipEarning_earningTypeId_fkey" FOREIGN KEY ("earningTypeId") REFERENCES "earning_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayslipEarning" ADD CONSTRAINT "PayslipEarning_payslipId_fkey" FOREIGN KEY ("payslipId") REFERENCES "payslips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayslipDeduction" ADD CONSTRAINT "PayslipDeduction_deductionTypeId_fkey" FOREIGN KEY ("deductionTypeId") REFERENCES "DeductionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayslipDeduction" ADD CONSTRAINT "PayslipDeduction_payslipId_fkey" FOREIGN KEY ("payslipId") REFERENCES "payslips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
