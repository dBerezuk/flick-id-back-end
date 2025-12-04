import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, type User } from '@prisma/client';
import { hash } from 'bcrypt';
import { UPLOAD_FOLDERS } from 'src/config/upload-folders.config';
import { FileService } from 'src/file/file.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly fileService: FileService
	) {}

	async getAll() {
		return await this.prismaService.user.findMany({
			orderBy: {
				createdAt: 'desc',
			},
		});
	}

	async getFindByFields(fields: Prisma.UserWhereUniqueInput): Promise<User> {
		return await this.prismaService.user.findUnique({ where: fields });
	}

	async getFindByFieldsWithAdditionalData(
		fields: Prisma.UserWhereUniqueInput
	): Promise<
		Prisma.UserGetPayload<{
			include: { mediaWatchLaters: true };
		}>
	> {
		return await this.prismaService.user.findUnique({
			where: { ...fields },
			include: {
				mediaWatchLaters: true,
			},
		});
	}

	async create(dto: Prisma.UserUncheckedCreateInput): Promise<
		Omit<
			Prisma.UserGetPayload<{
				include: { mediaWatchLaters: true };
			}>,
			'password'
		>
	> {
		if (dto.password)
			dto.password = await this.generateHashPassword(dto.password as string);

		const { password, ...user } = await this.prismaService.user.create({
			data: dto,
			include: {
				mediaWatchLaters: true,
			},
		});

		return user;
	}

	async update(
		id: User['id'],
		dto: Prisma.UserUncheckedUpdateInput
	): Promise<
		Omit<
			Prisma.UserGetPayload<{
				include: { mediaWatchLaters: true };
			}>,
			'password'
		>
	> {
		const currentUser = await this.getFindByFields({ id });

		const findUser =
			dto.email && (await this.getFindByFields({ email: dto.email as string }));

		if (findUser && findUser.id !== currentUser.id)
			throw new ConflictException(
				'This email is already in use by another account'
			);

		if (dto.password) {
			dto.password = await this.generateHashPassword(dto.password as string);
		} else {
			delete dto.password;
		}

		if (
			(dto.avatarFileName === '' ||
				dto.avatarFileName !== currentUser.avatarFileName) &&
			currentUser.avatarFileName
		) {
			this.fileService.delete(
				UPLOAD_FOLDERS.getUserAvatars(currentUser.avatarFileName)
			);
		}

		const { password, ...userData } = await this.prismaService.user.update({
			where: { id: currentUser.id },
			data: dto,
			include: {
				mediaWatchLaters: true,
			},
		});

		return userData;
	}

	async delete(id: User['id']) {
		const user = await this.prismaService.user.delete({
			where: { id },
		});

		user.avatarFileName &&
			(await this.fileService.delete(
				UPLOAD_FOLDERS.getUserAvatars(user.avatarFileName)
			));

		return true;
	}

	async generateHashPassword(password: string): Promise<string> {
		return await hash(password, 10);
	}
}
