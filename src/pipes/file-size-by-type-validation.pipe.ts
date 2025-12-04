import { Injectable, PipeTransform } from '@nestjs/common';
import { FileService } from 'src/file/file.service';

@Injectable()
export class FileSizeByTypeValidationPipe implements PipeTransform {
	transform(files: Express.Multer.File[]) {
		files.forEach(file => FileService.sizeValidate(file));

		return files;
	}
}
