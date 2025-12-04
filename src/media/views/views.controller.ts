import { Controller, Param, Post } from '@nestjs/common';
import { MediaService } from '../media.service';
import { ViewsService } from './views.service';

@Controller('media/views')
export class ViewsController {
	constructor(
		private readonly mediaService: MediaService,
		private readonly viewsService: ViewsService
	) {}

	@Post('/:slug')
	async viewing(@Param('slug') slug: string) {
		return await this.mediaService.viewing(slug);
	}
}
