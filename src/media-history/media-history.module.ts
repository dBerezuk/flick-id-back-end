import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MediaHistoryController } from './media-history.controller';
import { MediaHistoryService } from './media-history.service';

@Module({
	controllers: [MediaHistoryController],
	providers: [MediaHistoryService, PrismaService],
})
export class MediaHistoryModule {}
