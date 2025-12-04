import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { IConfig } from 'src/types/config.types';
import { UserService } from 'src/user/user.service';
import { IAuthJwtPayload } from './auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService<IConfig>,
		private readonly userService: UserService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('AUTH_SECRET'),
			issuer: configService.get('AUTH_ISSUER'),
			audience: configService.get('AUTH_AUDIENCE'),
		} as StrategyOptions);
	}

	async validate(payload: IAuthJwtPayload): Promise<User> {
		const user: User = await this.userService.getFindByFieldsWithAdditionalData(
			{
				id: payload.sub,
			}
		);

		return user;
	}
}
