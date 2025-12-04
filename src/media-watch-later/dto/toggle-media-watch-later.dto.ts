import { IsNotEmpty, IsString } from 'class-validator';

export class ToggleMediaWatchLaterDto {
	@IsNotEmpty()
	@IsString()
	mediaId: string;
}
