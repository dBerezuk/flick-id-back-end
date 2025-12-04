import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth/auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@Auth(true)
	getAll() {
		return this.userService.getAll();
	}

	@Get(':id')
	@Auth(true)
	getById(@Param('id') id: string) {
		return this.userService.getFindByFields({
			id,
		});
	}

	@Patch(':id')
	@Auth(true)
	update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
		return this.userService.update(id, dto);
	}

	@Delete(':id')
	@Auth(true)
	delete(@Param('id') id: string) {
		return this.userService.delete(id);
	}
}
