import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user/user.decorator';
import { ToggleMediaWatchLaterDto } from './dto/toggle-media-watch-later.dto';
import { MediaWatchLaterService } from './media-watch-later.service';

@Controller('users/media/watch-later')
export class MediaWatchLaterController {
	constructor(
		private readonly mediaWatchLaterService: MediaWatchLaterService
	) {}

	@Get()
	@Auth()
	async getAllByUser(@CurrentUser('id') userId: User['id']) {
		return this.mediaWatchLaterService.getAllByUserId(userId);
	}

	@Post()
	@HttpCode(200)
	@Auth()
	async toggle(
		@CurrentUser('id') userId: User['id'],
		@Body() dto: ToggleMediaWatchLaterDto
	) {
		return this.mediaWatchLaterService.toggle(userId, dto);
	}
}
