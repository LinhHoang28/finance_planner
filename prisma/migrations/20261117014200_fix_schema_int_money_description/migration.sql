-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "note",
DROP COLUMN "updatedAt",
ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE INTEGER,
ALTER COLUMN "date" DROP DEFAULT;

-- AlterTable
ALTER TABLE "WishlistItem" DROP COLUMN "createdAt",
DROP COLUMN "price",
DROP COLUMN "updatedAt",
ADD COLUMN     "cost" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Transaction_userId_date_idx" ON "Transaction"("userId", "date");
