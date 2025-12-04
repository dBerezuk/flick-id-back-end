import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { getValueTrimTransform } from 'src/utils/transforms';

export class CreateGenreDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(25)
	@Transform(({ value }) => getValueTrimTransform(value))
	title: string;
}
