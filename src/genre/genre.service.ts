import { Injectable, NotFoundException } from '@nestjs/common';
import { Genre, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GenreService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAll(): Promise<Genre[]> {
		return await this.prismaService.genre.findMany({
			orderBy: {
				createdAt: 'desc',
			},
		});
	}

	async getFindByFields(fields: Prisma.GenreWhereUniqueInput): Promise<Genre> {
		return await this.prismaService.genre.findUnique({ where: { ...fields } });
	}

	async create(dto: Prisma.GenreUncheckedCreateInput): Promise<Genre> {
		return await this.prismaService.genre.create({
			data: dto,
		});
	}

	async update(
		id: Genre['id'],
		dto: Prisma.GenreUncheckedUpdateInput
	): Promise<Genre> {
		const findGenre: Genre = await this.getFindByFields({ id });

		if (!findGenre) throw new NotFoundException('Genre not found');

		return await this.prismaService.genre.update({
			where: { id },
			data: dto,
		});
	}

	async delete(id: Genre['id']): Promise<void> {
		const findGenre: Genre = await this.getFindByFields({ id });

		if (!findGenre) throw new NotFoundException('Genre not found');

		await this.prismaService.genre.delete({
			where: { id },
		});
	}
}
