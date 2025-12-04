import { CookieOptions } from 'express';

export const COOKIE_OPTIONS: CookieOptions = {
	httpOnly: true,
	domain: process.env.CLIENT_DOMAIN,
	secure: true,
	sameSite: 'none', // production: lax
};
