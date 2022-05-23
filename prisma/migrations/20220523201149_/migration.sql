-- AlterTable
ALTER TABLE "posts_items" ADD COLUMN     "pictureId" TEXT;

-- AddForeignKey
ALTER TABLE "posts_items" ADD CONSTRAINT "posts_items_pictureId_fkey" FOREIGN KEY ("pictureId") REFERENCES "picture"("id") ON DELETE SET NULL ON UPDATE CASCADE;
