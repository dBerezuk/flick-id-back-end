import { IsNotEmpty, IsString } from 'class-validator';

export class AddMediaHistoryDto {
	@IsNotEmpty()
	@IsString()
	mediaId: string;
}
