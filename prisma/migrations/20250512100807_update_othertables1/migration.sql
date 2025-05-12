-- CreateEnum
CREATE TYPE "PaymentPlanStatus" AS ENUM ('PENDING', 'COMPLETED', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TrainingPeriodStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'EXPIRED', 'PAUSED');

-- CreateTable
CREATE TABLE "athlete_payments" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "reference" TEXT,
    "status" "PaymentPlanStatus" NOT NULL DEFAULT 'COMPLETED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "athlete_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_periods" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "TrainingPeriodStatus" NOT NULL DEFAULT 'ACTIVE',
    "attendanceDays" INTEGER,
    "actualAttendance" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_attendances" (
    "id" TEXT NOT NULL,
    "trainingPeriodId" TEXT NOT NULL,
    "attendanceDate" TIMESTAMP(3) NOT NULL,
    "isPresent" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_attendances_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "athlete_payments" ADD CONSTRAINT "athlete_payments_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_payments" ADD CONSTRAINT "athlete_payments_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_periods" ADD CONSTRAINT "training_periods_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "athlete_payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_periods" ADD CONSTRAINT "training_periods_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_attendances" ADD CONSTRAINT "training_attendances_trainingPeriodId_fkey" FOREIGN KEY ("trainingPeriodId") REFERENCES "training_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
