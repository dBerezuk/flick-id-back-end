-- DropForeignKey
ALTER TABLE "media_history" DROP CONSTRAINT "media_history_media_id_fkey";

-- DropForeignKey
ALTER TABLE "media_history" DROP CONSTRAINT "media_history_user_id_fkey";

-- DropForeignKey
ALTER TABLE "media_watch_later" DROP CONSTRAINT "media_watch_later_media_id_fkey";

-- DropForeignKey
ALTER TABLE "media_watch_later" DROP CONSTRAINT "media_watch_later_user_id_fkey";

-- AddForeignKey
ALTER TABLE "media_history" ADD CONSTRAINT "media_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_history" ADD CONSTRAINT "media_history_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_watch_later" ADD CONSTRAINT "media_watch_later_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_watch_later" ADD CONSTRAINT "media_watch_later_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
