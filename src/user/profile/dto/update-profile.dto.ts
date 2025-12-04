import { Transform } from 'class-transformer';
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
	ValidateIf,
} from 'class-validator';
import { getValueTrimTransform } from 'src/utils/transforms';

export class UpdateProfileDto {
	@IsOptional()
	@IsNotEmpty()
	@IsEmail()
	@Transform(({ value }) => getValueTrimTransform(value))
	email: string;

	@IsOptional()
	@IsString()
	@Transform(({ value }) => getValueTrimTransform(value))
	name?: string;

	@IsOptional()
	@IsString()
	@Transform(({ value }) => getValueTrimTransform(value))
	avatarFileName?: string;

	@IsOptional()
	@IsString()
	@ValidateIf((_, value: string) => value !== '')
	@MinLength(6)
	@Transform(({ value }) => getValueTrimTransform(value))
	password?: string;
}
