import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth/auth.decorator';
import { CatalogsService } from './catalog.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';

@Controller('catalog')
export class CatalogController {
	constructor(private readonly catalogsService: CatalogsService) {}

	@Get()
	async getAll() {
		return await this.catalogsService.getAll();
	}

	@Get(':id')
	async getById(@Param('id') id: string) {
		return await this.catalogsService.getFindByFields({ id });
	}

	@Post()
	@Auth(true)
	async create(@Body() dto: CreateCatalogDto) {
		return await this.catalogsService.create(dto);
	}

	@Patch('/:id')
	@Auth(true)
	async update(@Param('id') id: string, @Body() dto: UpdateCatalogDto) {
		return await this.catalogsService.update(id, dto);
	}

	@Delete('/:id')
	@Auth(true)
	async delete(@Param('id') id: string) {
		await this.catalogsService.delete(id);

		return true;
	}
}
