import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Catalog, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CatalogsService {
	constructor(public readonly prismaService: PrismaService) {}

	async getAll(): Promise<Catalog[]> {
		return await this.prismaService.catalog.findMany({
			orderBy: { createdAt: 'desc' },
		});
	}

	async getFindByFields(
		fields: Prisma.CatalogWhereUniqueInput
	): Promise<Catalog> {
		return await this.prismaService.catalog.findUnique({
			where: { ...fields },
		});
	}

	async create(dto: Prisma.CatalogUncheckedCreateInput): Promise<Catalog> {
		const catalogBySlug = await this.getFindByFields({ slug: dto.slug });

		if (catalogBySlug)
			throw new ConflictException('A directory with this slug already exists');

		return await this.prismaService.catalog.create({
			data: dto,
		});
	}

	async update(
		id: string,
		dto: Prisma.CatalogUncheckedUpdateInput
	): Promise<Catalog> {
		const findGenre: Catalog = await this.getFindByFields({ id });

		if (!findGenre) throw new NotFoundException('Catalog not found');

		return await this.prismaService.catalog.update({
			where: { id },
			data: dto,
		});
	}

	async delete(id: string): Promise<void> {
		const findGenre: Catalog = await this.getFindByFields({ id });

		if (!findGenre) throw new NotFoundException('Catalog not found');

		await this.prismaService.catalog.delete({
			where: { id },
		});
	}
}
