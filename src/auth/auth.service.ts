import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { Response } from 'express';
import { COOKIE_OPTIONS } from 'src/config/cookies.config';
import { IConfig } from 'src/types/config.types';
import { UserService } from 'src/user/user.service';
import {
	EnumAuthTokens,
	IAuthJwtPayload,
	IAuthResponse,
	IAuthTokens,
} from './auth.types';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegistrationAuthDto } from './dto/registration-auth.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly configService: ConfigService<IConfig>,
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	async registration(dto: RegistrationAuthDto): Promise<IAuthResponse> {
		const findUser = await this.userService.getFindByFields({
			email: dto.email,
		});

		if (findUser) throw new ConflictException('The user is already registered');

		const user = await this.userService.create(dto);

		const tokens = await this.generateTokens(user.id, user.isAdmin);

		return {
			user,
			tokens,
		};
	}

	async login(dto: LoginAuthDto): Promise<IAuthResponse> {
		const findUser = await this.userService.getFindByFieldsWithAdditionalData({
			email: dto.email,
		});

		if (!findUser) throw new NotFoundException('User not found');

		const { password, ...user } = findUser;

		const isComparePassword = await compare(dto.password, password);

		if (!isComparePassword)
			throw new UnauthorizedException('Email or password is incorrect');

		const tokens = await this.generateTokens(user.id, user.isAdmin);

		return {
			user,
			tokens,
		};
	}

	async getNewTokens(
		refreshToken: IAuthTokens['refreshToken'],
		response: Response
	): Promise<IAuthResponse> {
		try {
			const result = (await this.jwtService.verifyAsync(
				refreshToken
			)) as IAuthJwtPayload;

			if (result.type !== 'refresh') throw new Error();

			const { password, ...user } =
				await this.userService.getFindByFieldsWithAdditionalData({
					id: result.sub,
				});

			const tokens = await this.generateTokens(result.sub, user.isAdmin);

			return {
				user,
				tokens,
			};
		} catch (error) {
			this.removeRefreshTokenResponse(response);

			throw new UnauthorizedException('Invalid refresh token');
		}
	}

	public async generateTokens(
		sub: string,
		isAdmin: boolean
	): Promise<IAuthTokens> {
		const data = {
			sub,
			isAdmin,
		};

		const accessToken: string = await this.jwtService.signAsync(
			{
				...data,
				type: 'access',
			},
			{
				expiresIn: '1h',
			} as JwtSignOptions
		);
		const refreshToken: string = await this.jwtService.signAsync(
			{
				...data,
				type: 'refresh',
			},
			{
				expiresIn: this.configService.get('AUTH_EXPIRES'),
			}
		);

		return {
			accessToken,
			refreshToken,
		};
	}

	addRefreshTokenResponse(response: Response, refreshToken: string): void {
		const expires = new Date();
		expires.setDate(
			expires.getDate() + parseInt(this.configService.get('AUTH_EXPIRES'))
		);

		response.cookie(EnumAuthTokens.REFRESH_TOKEN, refreshToken, {
			...COOKIE_OPTIONS,
			expires,
		});
	}

	removeRefreshTokenResponse(response: Response): void {
		response.cookie(EnumAuthTokens.REFRESH_TOKEN, '', {
			...COOKIE_OPTIONS,
			expires: new Date(0),
		});
	}
}
