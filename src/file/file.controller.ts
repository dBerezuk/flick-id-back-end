import {
	Controller,
	Post,
	UnprocessableEntityException,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileSizeByTypeValidationPipe } from 'src/pipes/file-size-by-type-validation.pipe';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Post()
	@UseInterceptors(
		FilesInterceptor('files', 10, {
			fileFilter: FileService.filters,
			storage: diskStorage({
				destination: FileService.destination,
				filename: FileService.getUniqueFileName,
			}),
		})
	)
	upload(
		@UploadedFiles(new FileSizeByTypeValidationPipe())
		files?: Express.Multer.File[]
	) {
		if (!files || !files.length)
			throw new UnprocessableEntityException('Upload file');

		const filenames = files.map(file => file.filename);

		return {
			filenames,
		};
	}
}
