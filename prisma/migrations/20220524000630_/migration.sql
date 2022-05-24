/*
  Warnings:

  - Added the required column `index` to the `posts_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts_items" ADD COLUMN     "index" INTEGER NOT NULL;
