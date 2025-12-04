import { Transform } from 'class-transformer';
import {
	IsDate,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
} from 'class-validator';
import { getValueTrimTransform } from 'src/utils/transforms';

export class CreateMediaDto {
	@IsNotEmpty()
	@IsString()
	@Transform(({ value }) => getValueTrimTransform(value))
	title: string;

	@IsNotEmpty()
	@IsString()
	@Transform(({ value }) => getValueTrimTransform(value))
	posterFileName: string;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@Transform(({ value }) => getValueTrimTransform(value))
	posterFullFileName?: string;

	@IsNotEmpty()
	@IsString()
	@Transform(({ value }) => getValueTrimTransform(value))
	@MaxLength(15)
	slug: string;

	@IsNotEmpty()
	@IsString()
	@Transform(({ value }) => getValueTrimTransform(value))
	@MaxLength(500)
	description: string;

	@IsNotEmpty()
	@IsString()
	@Transform(({ value }) => getValueTrimTransform(value))
	@MaxLength(50)
	slogan: string;

	@IsNotEmpty()
	@IsString()
	@Transform(({ value }) => getValueTrimTransform(value))
	country: string;

	@IsNotEmpty()
	@IsDate()
	@Transform(({ value }) => new Date(value))
	premiere: Date;

	@IsNotEmpty()
	@IsString()
	@Transform(({ value }) => getValueTrimTransform(value))
	mediaFileName: string;

	@IsNotEmpty()
	@IsString()
	@Transform(({ value }) => getValueTrimTransform(value))
	genreId: string;

	@IsNotEmpty()
	@IsString()
	@Transform(({ value }) => getValueTrimTransform(value))
	catalogId: string;
}
