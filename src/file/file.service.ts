import {
	BadRequestException,
	Injectable,
	UnprocessableEntityException,
} from '@nestjs/common';
import { promises as fs } from 'fs';
import { extname } from 'path';
import { UPLOAD_FOLDERS } from 'src/config/upload-folders.config';
import {
	REGEX_FILE_IMAGE_TYPES,
	REGEX_FILE_VIDEO_TYPES,
} from 'src/constants/regex.constants';

@Injectable()
export class FileService {
	async delete(path: string): Promise<void> {
		try {
			await fs.unlink(`${process.cwd()}/uploads${path}`);
		} catch (error: any) {
			if (error.code === 'ENOENT') return;

			throw new BadRequestException('Failed to delete file');
		}
	}

	static filters(
		req: any,
		file: Express.Multer.File,
		callback: (error: Error | null, acceptFile: boolean) => void
	) {
		const folder = req.query.folder as string;

		const getAllFolders = UPLOAD_FOLDERS.getAll();

		if (!folder || !getAllFolders.includes(folder))
			return callback(
				new UnprocessableEntityException('Invalid folder query param'),
				null
			);

		const isVideoFolder = folder === UPLOAD_FOLDERS.getMediaVideos();

		const fileType = isVideoFolder
			? REGEX_FILE_VIDEO_TYPES
			: REGEX_FILE_IMAGE_TYPES;

		if (!file.mimetype.match(fileType)) {
			return callback(
				new UnprocessableEntityException('Invalid file type'),
				null
			);
		}

		callback(null, true);
	}

	static sizeValidate(file: Express.Multer.File) {
		const isVideo = file.mimetype.match(REGEX_FILE_VIDEO_TYPES);

		if (isVideo && file.size > 50e6) {
			throw new UnprocessableEntityException(`Video too large`);
		} else if (!isVideo && file.size > 5e6) {
			throw new UnprocessableEntityException(`Image too large`);
		}
	}

	static destination(
		req: any,
		file: Express.Multer.File,
		callback: (error: Error | null, destination: string) => void
	) {
		const folder = req.query.folder as string;

		callback(null, `./uploads/${folder}`);
	}

	static getUniqueFileName(
		req: any,
		file: Express.Multer.File,
		callback: (error: Error | null, filename: string) => void
	) {
		const uniqueFileName = Date.now() + '-' + Math.round(Math.random() * 1e9);

		const ext = extname(file.originalname);

		callback(null, uniqueFileName + ext);
	}
}
