-- CreateTable
CREATE TABLE "RelapseLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "source" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locale" TEXT NOT NULL DEFAULT 'zh'
);

-- CreateTable
CREATE TABLE "BlockRule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "domain" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "RelapseLog_timestamp_idx" ON "RelapseLog"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "BlockRule_domain_key" ON "BlockRule"("domain");
