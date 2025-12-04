import { Injectable } from '@nestjs/common';
import { MediaHistory, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { getCurrentDateIOS } from 'src/utils/date-formats';
import { AddMediaHistoryDto } from './dto/add-media-history.dto';

@Injectable()
export class MediaHistoryService {
	constructor(public readonly prismaService: PrismaService) {}

	async getAllByUserId(userId: User['id']): Promise<MediaHistory[]> {
		return await this.prismaService.mediaHistory.findMany({
			where: {
				userId,
			},
			include: {
				media: true,
			},
			orderBy: {
				updatedAt: 'desc',
			},
		});
	}

	async add(
		userId: User['id'],
		dto: AddMediaHistoryDto
	): Promise<MediaHistory> {
		return await this.prismaService.mediaHistory.upsert({
			where: {
				userId_mediaId: {
					userId,
					mediaId: dto.mediaId,
				},
			},
			update: {
				updatedAt: getCurrentDateIOS(),
			},
			create: {
				userId,
				...dto,
			},
		});
	}

	async clearAll(userId: User['id']): Promise<void> {
		await this.prismaService.mediaHistory.deleteMany({
			where: {
				userId,
			},
		});
	}
}
