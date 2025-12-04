import { OmitType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { UpdateProfileDto } from '../profile/dto/update-profile.dto';

export class UpdateUserDto extends OmitType(UpdateProfileDto, ['password']) {
	@IsOptional()
	isAdmin: boolean;
}
