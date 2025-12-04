import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth/auth.decorator';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@Get()
	@Auth(true)
	async getAll() {
		return await this.statisticsService.getAll();
	}
}
