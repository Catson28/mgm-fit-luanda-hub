-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('SYSTEM', 'APPLICATION', 'WEB_SERVER', 'SECURITY', 'DATABASE', 'NETWORK', 'AUDIT', 'PERFORMANCE', 'TRANSACTION', 'DEBUG');

-- CreateEnum
CREATE TYPE "LogLevel" AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL', 'DEBUG');

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "type" "LogType" NOT NULL,
    "level" "LogLevel" NOT NULL,
    "message" TEXT NOT NULL,
    "details" TEXT,
    "source" TEXT,
    "ip" TEXT,
    "userId" TEXT,
    "resourceId" TEXT,
    "resourceType" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "tags" TEXT[],
    "resolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Log_type_idx" ON "Log"("type");

-- CreateIndex
CREATE INDEX "Log_level_idx" ON "Log"("level");

-- CreateIndex
CREATE INDEX "Log_timestamp_idx" ON "Log"("timestamp");

-- CreateIndex
CREATE INDEX "Log_userId_idx" ON "Log"("userId");

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
