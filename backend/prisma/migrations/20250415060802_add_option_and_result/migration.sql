-- AlterTable
ALTER TABLE "Prompt" ADD COLUMN     "exampleResult" JSONB;

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "option" TEXT NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Option_option_key" ON "Option"("option");
