import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { FileModule } from './file/file.module';
import { GenreModule } from './genre/genre.module';
import { MediaHistoryModule } from './media-history/media-history.module';
import { MediaWatchLaterModule } from './media-watch-later/media-watch-later.module';
import { MediaModule } from './media/media.module';
import { UserModule } from './user/user.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		AuthModule,
		UserModule,
		GenreModule,
		CatalogModule,
		MediaModule,
		FileModule,
		MediaHistoryModule,
		MediaWatchLaterModule,
		StatisticsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
