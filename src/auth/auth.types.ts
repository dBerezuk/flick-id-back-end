import { Prisma, User } from '@prisma/client';

export enum EnumAuthTokens {
	ACCESS_TOKEN = 'accessToken',
	REFRESH_TOKEN = 'refreshToken',
}

export interface IAuthTokens {
	accessToken: string;
	refreshToken: string;
}

export interface IAuthResponse {
	user: Omit<
		Prisma.UserGetPayload<{ include: { mediaWatchLaters: true } }>,
		'password'
	>;
	tokens: IAuthTokens;
}

export interface IAuthJwtPayload {
	sub: User['id'];
	isAdmin: boolean;
	type: 'access' | 'refresh';
	iat: number;
	exp: number;
}
