import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth/auth.decorator';
import { CreateMediaDto } from './dto/create-media.dto';
import { GetAllMediaDto } from './dto/get-all-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
	constructor(private readonly mediaService: MediaService) {}

	@Get()
	async getAll(@Query() query: GetAllMediaDto) {
		return await this.mediaService.getAll(query);
	}

	@Get(':slug')
	async getFind(@Param('slug') slug: string) {
		return await this.mediaService.getFindByFields({ slug });
	}

	@Get('/by-id/:id')
	@Auth(true)
	async getFindById(@Param('id') id: string) {
		return await this.mediaService.getFindByFields({ id });
	}

	@Post()
	@Auth(true)
	async create(@Body() dto: CreateMediaDto) {
		return this.mediaService.create(dto);
	}

	@Patch('/:id')
	@Auth(true)
	async update(@Param('id') id: string, @Body() dto: UpdateMediaDto) {
		return this.mediaService.update(id, dto);
	}

	@Delete('/:id')
	@Auth(true)
	async delete(@Param('id') id: string) {
		await this.mediaService.delete(id);

		return true;
	}
}
