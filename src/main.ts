import {
	HttpStatus,
	UnprocessableEntityException,
	ValidationError,
	ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { IConfig } from './types/config.types';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService<IConfig>);

	app.setGlobalPrefix('/api');
	app.use(cookieParser());
	app.enableCors({
		origin: configService.get('CLIENT_URL'),
		credentials: true,
	});
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			whitelist: true,
			exceptionFactory: (validationErrors: ValidationError[] = []) => {
				const getPrettyClassValidatorErrors = (
					validationErrors: ValidationError[],
					parentProperty = ''
				): Array<{ property: string; errors: string[] }> => {
					const errors = [];

					const getValidationErrorsRecursively = (
						validationErrors: ValidationError[],
						parentProperty = ''
					) => {
						for (const error of validationErrors) {
							const propertyPath = parentProperty
								? `${parentProperty}.${error.property}`
								: error.property;

							if (error.constraints) {
								errors.push({
									property: propertyPath,
									errors: Object.values(error.constraints),
								});
							}

							if (error.children?.length) {
								getValidationErrorsRecursively(error.children, propertyPath);
							}
						}
					};

					getValidationErrorsRecursively(validationErrors, parentProperty);

					return errors;
				};

				const errors = getPrettyClassValidatorErrors(validationErrors);

				return new UnprocessableEntityException({
					message: 'validation error',
					error: 'Validate',
					statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
					fields: errors,
				});
			},
		})
	);

	await app.listen(configService.get('PORT') || 4201);
}

bootstrap();
