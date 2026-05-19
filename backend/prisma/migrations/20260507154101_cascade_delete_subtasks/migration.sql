-- DropForeignKey
ALTER TABLE "ChecklistSubTask" DROP CONSTRAINT "ChecklistSubTask_taskId_fkey";

-- AddForeignKey
ALTER TABLE "ChecklistSubTask" ADD CONSTRAINT "ChecklistSubTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "ChecklistTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
