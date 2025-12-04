import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Req,
	Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { EnumAuthTokens, IAuthTokens } from './auth.types';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegistrationAuthDto } from './dto/registration-auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/registration')
	async registration(
		@Body() dto: RegistrationAuthDto,
		@Res({ passthrough: true }) res: Response
	) {
		const {
			user,
			tokens: { accessToken, refreshToken },
		} = await this.authService.registration(dto);

		this.authService.addRefreshTokenResponse(res, refreshToken);

		return {
			user,
			accessToken,
		};
	}

	@Post('/login')
	@HttpCode(200)
	async login(
		@Body() dto: LoginAuthDto,
		@Res({ passthrough: true }) res: Response
	) {
		const {
			user,
			tokens: { accessToken, refreshToken },
		} = await this.authService.login(dto);

		this.authService.addRefreshTokenResponse(res, refreshToken);

		return {
			user,
			accessToken,
		};
	}

	@Get('/new-tokens')
	async newTokens(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const refreshToken: IAuthTokens['refreshToken'] =
			req.cookies[EnumAuthTokens.REFRESH_TOKEN];

		const { user, tokens } = await this.authService.getNewTokens(
			refreshToken,
			res
		);

		this.authService.addRefreshTokenResponse(res, tokens.refreshToken);

		return {
			user,
			accessToken: tokens.accessToken,
		};
	}

	@Get('/logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		this.authService.removeRefreshTokenResponse(res);

		return true;
	}
}
