import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class OnlyAdminGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		const user = request.user as User;

		if (user.isAdmin !== true)
			throw new ForbiddenException("You don't have enough rights");

		return true;
	}
}
