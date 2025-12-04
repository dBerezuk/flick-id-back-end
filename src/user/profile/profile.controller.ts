import { Body, Controller, Get, Patch } from '@nestjs/common';
import { User } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user/user.decorator';
import { UserService } from '../user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@Controller('users/profile')
export class ProfileController {
	constructor(
		private readonly profileService: ProfileService,
		private readonly userService: UserService
	) {}

	@Get()
	@Auth()
	async get(@CurrentUser() user: User) {
		const { password, ...data } = user;

		return data;
	}

	@Patch()
	@Auth()
	async update(
		@CurrentUser('id') id: User['id'],
		@Body() dto: UpdateProfileDto
	) {
		return await this.userService.update(id, dto);
	}
}
