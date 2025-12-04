import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { IConfig } from 'src/types/config.types';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.registerAsync({
			useFactory: async (configService: ConfigService<IConfig>) => ({
				secret: configService.get('AUTH_SECRET'),
				signOptions: {
					issuer: configService.get('AUTH_ISSUER'),
					audience: configService.get('AUTH_AUDIENCE'),
				},
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
