import { Transform, Type } from 'class-transformer';
import {
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from 'class-validator';
import { getArrayTransform } from 'src/utils/transforms';

export enum EnumGetAllMediaSorting {
	POPULAR = 'popular',
	OLD = 'old',
	NEW_CREATED = 'new-created',
}

export class GetAllMediaDto {
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	search?: string;

	@IsOptional()
	@IsNumber()
	@Min(0)
	skip?: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	take?: number;

	@IsOptional()
	@ArrayNotEmpty()
	@IsArray()
	@IsString({ each: true })
	@Transform(({ value }) => getArrayTransform(value))
	country?: string[];

	@IsOptional()
	@ArrayNotEmpty()
	@IsArray()
	@IsNumber({}, { each: true })
	@Type(() => Number)
	@Transform(({ value }) => getArrayTransform(value))
	premiere?: number[];

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	catalogSlug?: string;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	genreId?: string;

	@IsOptional()
	@IsEnum(EnumGetAllMediaSorting)
	sorting?: EnumGetAllMediaSorting;
}
