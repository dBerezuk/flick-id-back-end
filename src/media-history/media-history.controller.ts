import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user/user.decorator';
import { AddMediaHistoryDto } from './dto/add-media-history.dto';
import { MediaHistoryService } from './media-history.service';

@Controller('users/media/history')
export class MediaHistoryController {
	constructor(private readonly mediaHistoryService: MediaHistoryService) {}

	@Get()
	@Auth()
	async getAllByUser(@CurrentUser('id') userId: User['id']) {
		return this.mediaHistoryService.getAllByUserId(userId);
	}

	@Post()
	@Auth()
	async add(
		@CurrentUser('id') userId: User['id'],
		@Body() dto: AddMediaHistoryDto
	) {
		return this.mediaHistoryService.add(userId, dto);
	}

	@Delete()
	@Auth()
	async clearAll(@CurrentUser('id') userId: User['id']) {
		await this.mediaHistoryService.clearAll(userId);

		return true;
	}
}
