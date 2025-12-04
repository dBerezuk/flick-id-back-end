import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: process.cwd() + '/uploads',
			serveRoot: '/uploads',
		}),
	],
	controllers: [FileController],
	providers: [FileService],
	exports: [FileService],
})
export class FileModule {}
