-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('fuel', 'maintenance', 'food', 'insurance', 'parking', 'phone', 'tolls', 'other');

-- CreateEnum
CREATE TYPE "ExpenseSubcategory" AS ENUM ('fuel_refill', 'oil_change', 'oil_refill', 'repair', 'spare_part', 'tire', 'brake', 'battery', 'cleaning', 'accessory', 'unknown');

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" "ExpenseCategory" NOT NULL,
    "subcategory" "ExpenseSubcategory",
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
