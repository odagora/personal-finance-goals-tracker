-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- First create a default user for existing transactions with hashed password
-- The hash below is for 'default-password' using bcrypt with 10 rounds
INSERT INTO "User" (id, email, password, "createdAt", "updatedAt")
VALUES (
  'default-user-id',
  'default@example.com',
  '$2a$10$GcRNcohJ8XOFODCOJdsZIeCz74wyKewSt8oHyEpu7qGVMpEUpigs2',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Update existing transactions to use the default user
UPDATE "Transaction"
SET "userId" = 'default-user-id'
WHERE "userId" = 'some-user-id';

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
