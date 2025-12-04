import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MediaWatchLaterController } from './media-watch-later.controller';
import { MediaWatchLaterService } from './media-watch-later.service';

@Module({
	controllers: [MediaWatchLaterController],
	providers: [MediaWatchLaterService, PrismaService],
})
export class MediaWatchLaterModule {}
