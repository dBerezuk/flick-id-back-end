import { Module } from '@nestjs/common';
import { CatalogModule } from 'src/catalog/catalog.module';
import { FileModule } from 'src/file/file.module';
import { PrismaService } from 'src/prisma.service';
import { FilterController } from './filter/filter.controller';
import { FilterService } from './filter/filter.service';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { ViewsController } from './views/views.controller';
import { ViewsService } from './views/views.service';

@Module({
	imports: [FileModule, CatalogModule],
	controllers: [FilterController, MediaController, ViewsController],
	providers: [MediaService, FilterService, ViewsService, PrismaService],
})
export class MediaModule {}
