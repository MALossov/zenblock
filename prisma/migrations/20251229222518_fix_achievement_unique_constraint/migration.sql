/*
  Warnings:

  - A unique constraint covering the columns `[source,name]` on the table `Achievement` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Achievement_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_source_name_key" ON "Achievement"("source", "name");
