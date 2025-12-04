import { Injectable } from '@nestjs/common';
import { Media, MediaWatchLater, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ToggleMediaWatchLaterDto } from './dto/toggle-media-watch-later.dto';

@Injectable()
export class MediaWatchLaterService {
	constructor(public readonly prismaService: PrismaService) {}

	async getAllByUserId(userId: User['id']): Promise<MediaWatchLater[]> {
		return await this.prismaService.mediaWatchLater.findMany({
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

	async getFindByUserIdAndMediaId(
		userId: User['id'],
		mediaId: Media['id']
	): Promise<MediaWatchLater> {
		return await this.prismaService.mediaWatchLater.findUnique({
			where: {
				userId_mediaId: {
					userId,
					mediaId,
				},
			},
		});
	}

	async create(
		userId: User['id'],
		mediaId: Media['id']
	): Promise<MediaWatchLater> {
		return await this.prismaService.mediaWatchLater.create({
			data: {
				userId,
				mediaId,
			},
		});
	}

	async delete(
		userId: User['id'],
		mediaId: Media['id']
	): Promise<MediaWatchLater> {
		return await this.prismaService.mediaWatchLater.delete({
			where: {
				userId_mediaId: {
					userId,
					mediaId,
				},
			},
		});
	}

	async toggle(
		userId: User['id'],
		{ mediaId }: ToggleMediaWatchLaterDto
	): Promise<MediaWatchLater | null> {
		const findMediaWatchLater = await this.getFindByUserIdAndMediaId(
			userId,
			mediaId
		);

		if (findMediaWatchLater) {
			await this.delete(userId, mediaId);

			return null;
		} else {
			return await this.create(userId, mediaId);
		}
	}
}
