import { Controller, Get, Query } from '@nestjs/common';
import { MediaService } from '../media.service';
import { FilterService } from './filter.service';

@Controller('media/filters')
export class FilterController {
	constructor(
		private readonly mediaService: MediaService,
		private readonly filterService: FilterService
	) {}

	@Get()
	async getFilters(@Query('catalogSlug') catalogSlug: string) {
		return await this.mediaService.getFilters(catalogSlug);
	}
}
