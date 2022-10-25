-- AlterTable
ALTER TABLE "Chats" ALTER COLUMN "to_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Friend" ADD COLUMN     "blocked" BOOLEAN NOT NULL DEFAULT false;
