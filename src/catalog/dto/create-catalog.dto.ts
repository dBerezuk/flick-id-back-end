import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { getValueTrimTransform } from 'src/utils/transforms';

export class CreateCatalogDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(25)
	@Transform(({ value }) => getValueTrimTransform(value))
	title: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(15)
	@Transform(({ value }) => getValueTrimTransform(value))
	slug: string;
}
