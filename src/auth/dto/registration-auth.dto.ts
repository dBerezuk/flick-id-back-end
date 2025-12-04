import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { getValueTrimTransform } from 'src/utils/transforms';

export class RegistrationAuthDto {
	@IsEmail()
	@Transform(({ value }) => getValueTrimTransform(value))
	email: string;

	@IsString()
	@MinLength(6)
	@Transform(({ value }) => getValueTrimTransform(value))
	password: string;
}
