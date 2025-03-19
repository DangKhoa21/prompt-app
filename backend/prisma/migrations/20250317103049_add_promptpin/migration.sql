-- CreateTable
CREATE TABLE "PromptPin" (
    "userId" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,

    CONSTRAINT "PromptPin_pkey" PRIMARY KEY ("userId","promptId")
);

-- AddForeignKey
ALTER TABLE "PromptPin" ADD CONSTRAINT "PromptPin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptPin" ADD CONSTRAINT "PromptPin_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
