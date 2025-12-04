import { applyDecorators, UseGuards } from '@nestjs/common';
import { OnlyAdminGuard } from 'src/auth/guards/admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

export const Auth = (isAdmin: boolean = false) => {
	return applyDecorators(
		isAdmin ? UseGuards(JwtAuthGuard, OnlyAdminGuard) : UseGuards(JwtAuthGuard)
	);
};
