-- CreateIndex
CREATE INDEX "RelapseLog_source_idx" ON "RelapseLog"("source");

-- CreateIndex
CREATE INDEX "RelapseLog_source_timestamp_idx" ON "RelapseLog"("source", "timestamp");
