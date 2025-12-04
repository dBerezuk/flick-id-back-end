export interface IConfig {
	PORT: number;

	AUTH_SECRET: string;
	AUTH_ISSUER: string;
	AUTH_AUDIENCE: string;
	AUTH_EXPIRES: string;

	CLIENT_URL: string;
	CLIENT_DOMAIN: string;
}
