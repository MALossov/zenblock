-- CreateTable
CREATE TABLE "Achievement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL,
    "daysClean" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "UserStats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "source" TEXT NOT NULL,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "lastRelapseDate" DATETIME,
    "totalRelapses" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_name_key" ON "Achievement"("name");

-- CreateIndex
CREATE INDEX "Achievement_source_idx" ON "Achievement"("source");

-- CreateIndex
CREATE INDEX "Achievement_earnedAt_idx" ON "Achievement"("earnedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_source_key" ON "UserStats"("source");

-- CreateIndex
CREATE INDEX "UserStats_source_idx" ON "UserStats"("source");
