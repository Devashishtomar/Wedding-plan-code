/*
  Warnings:

  - The values [PRIVATE] on the enum `Visibility` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Visibility_new" AS ENUM ('BRIDE_PRIVATE', 'GROOM_PRIVATE', 'SHARED');
ALTER TABLE "public"."BudgetItem" ALTER COLUMN "visibility" DROP DEFAULT;
ALTER TABLE "public"."ChecklistTask" ALTER COLUMN "visibility" DROP DEFAULT;
ALTER TABLE "public"."Guest" ALTER COLUMN "visibility" DROP DEFAULT;
ALTER TABLE "Guest" ALTER COLUMN "visibility" TYPE "Visibility_new" USING ("visibility"::text::"Visibility_new");
ALTER TABLE "BudgetItem" ALTER COLUMN "visibility" TYPE "Visibility_new" USING ("visibility"::text::"Visibility_new");
ALTER TABLE "ChecklistTask" ALTER COLUMN "visibility" TYPE "Visibility_new" USING ("visibility"::text::"Visibility_new");
ALTER TYPE "Visibility" RENAME TO "Visibility_old";
ALTER TYPE "Visibility_new" RENAME TO "Visibility";
DROP TYPE "public"."Visibility_old";
ALTER TABLE "BudgetItem" ALTER COLUMN "visibility" SET DEFAULT 'SHARED';
ALTER TABLE "ChecklistTask" ALTER COLUMN "visibility" SET DEFAULT 'SHARED';
ALTER TABLE "Guest" ALTER COLUMN "visibility" SET DEFAULT 'SHARED';
COMMIT;

-- AlterTable
ALTER TABLE "WeddingMember" ADD COLUMN     "canEditPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canViewPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "side" "Role";
