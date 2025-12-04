import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CatalogController } from './catalog.controller';
import { CatalogsService } from './catalog.service';

@Module({
	controllers: [CatalogController],
	providers: [CatalogsService, PrismaService],
	exports: [CatalogsService],
})
export class CatalogModule {}
