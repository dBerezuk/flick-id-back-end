import { Injectable, NotFoundException } from '@nestjs/common';
import { Media, Prisma } from '@prisma/client';
import { CatalogsService } from 'src/catalog/catalog.service';
import { UPLOAD_FOLDERS } from 'src/config/upload-folders.config';
import { FileService } from 'src/file/file.service';
import { PrismaService } from 'src/prisma.service';
import { IPaginate } from 'src/types/paginate.types';
import { getIsHasMoreCheck } from 'src/utils/check';
import {
	getDateYear,
	getDateYearEndIOS,
	getDateYearStartIOS,
} from 'src/utils/date-formats';
import {
	EnumGetAllMediaSorting,
	GetAllMediaDto,
} from './dto/get-all-media.dto';
import { TMediaFiltersResponse } from './filter/filter.types';

@Injectable()
export class MediaService {
	constructor(
		public readonly fileService: FileService,
		private readonly catalogService: CatalogsService,
		public readonly prismaService: PrismaService
	) {}

	async getAll({
		search,
		skip,
		take,
		country,
		premiere,
		catalogSlug,
		genreId,
		sorting,
	}: GetAllMediaDto): Promise<IPaginate<Media>> {
		const where: Prisma.MediaWhereInput = {
			AND: [
				{
					OR: search && [
						{
							title: {
								contains: search,
								mode: 'insensitive',
							},
						},
						{
							description: {
								contains: search,
								mode: 'insensitive',
							},
						},
						{
							slogan: {
								contains: search,
								mode: 'insensitive',
							},
						},
						{
							country: {
								contains: search,
								mode: 'insensitive',
							},
						},
					],
				},
				{
					OR: premiere?.map(date => ({
						premiere: {
							gte: getDateYearStartIOS(date.toString()),
							lte: getDateYearEndIOS(date.toString()),
						},
					})),
				},
				{
					country: {
						in: country,
					},
					catalog: {
						slug: catalogSlug,
					},
					genreId,
				},
			],
		};

		const isHasMore = await this.getIsPaginate(skip, take, where);

		let orderBy: Prisma.MediaOrderByWithRelationInput;

		switch (sorting) {
			case EnumGetAllMediaSorting.POPULAR:
				orderBy = { views: 'desc' };
				break;
			case EnumGetAllMediaSorting.OLD:
				orderBy = { premiere: 'asc' };
				break;
			case EnumGetAllMediaSorting.NEW_CREATED:
				orderBy = { createdAt: 'desc' };
				break;
			default:
				orderBy = { premiere: 'desc' };
		}

		const media = await this.prismaService.media.findMany({
			where,
			skip,
			take,
			orderBy,
		});

		return {
			isHasMore,
			items: media,
		};
	}

	async getFilters(catalogSlug?: string): Promise<TMediaFiltersResponse> {
		const catalog =
			catalogSlug &&
			(await this.catalogService.getFindByFields({
				slug: catalogSlug,
			}));

		const [getCountries, getPremieres] = await Promise.all([
			this.prismaService.media.groupBy({
				by: ['country'],
				where: {
					catalogId: catalog?.id || undefined,
				},
			}),
			catalog
				? this.prismaService.$queryRaw<{ year: string }[]>`
        SELECT DISTINCT EXTRACT(YEAR FROM "premiere")::TEXT AS year
        FROM "media"
        WHERE "catalog_id" = ${catalog.id}
        ORDER BY year DESC
      `
				: this.prismaService.$queryRaw<{ year: string }[]>`
        SELECT DISTINCT EXTRACT(YEAR FROM "premiere")::TEXT AS year
        FROM "media"
        ORDER BY year DESC
      `,
		]);

		const countries: string[] = getCountries.map(value => value.country);
		const premieres: number[] = getPremieres.map(value =>
			getDateYear(value.year)
		);

		return Object.entries({ country: countries, premiere: premieres });
	}

	async getFindByFields(fields: Prisma.MediaWhereUniqueInput): Promise<Media> {
		return await this.prismaService.media.findUnique({ where: { ...fields } });
	}

	private async getIsPaginate(
		skip: GetAllMediaDto['skip'],
		take: GetAllMediaDto['take'],
		where: Prisma.MediaWhereInput
	): Promise<boolean> {
		return getIsHasMoreCheck({
			skip,
			take,
			count: await this.prismaService.media.count({ where }),
		});
	}

	async viewing(slug: Media['slug']): Promise<Media> {
		return await this.prismaService.media.update({
			where: {
				slug,
			},
			data: {
				views: {
					increment: 1,
				},
			},
		});
	}

	async create(dto: Prisma.MediaUncheckedCreateInput): Promise<Media> {
		return await this.prismaService.media.create({
			data: dto,
		});
	}

	async update(
		id: Media['id'],
		dto: Prisma.MediaUncheckedUpdateInput
	): Promise<Media> {
		const findMedia: Media = await this.getFindByFields({ id });

		if (!findMedia) throw new NotFoundException('Media not found');

		if (
			dto.posterFullFileName &&
			findMedia.posterFullFileName !== dto.posterFullFileName
		)
			await this.fileService.delete(
				UPLOAD_FOLDERS.getMediaFullPosters(findMedia.posterFullFileName)
			);

		if (dto.posterFileName && findMedia.posterFileName !== dto.posterFileName)
			await this.fileService.delete(
				UPLOAD_FOLDERS.getMediaPosters(findMedia.posterFileName)
			);

		if (dto.mediaFileName && findMedia.mediaFileName !== dto.mediaFileName)
			await this.fileService.delete(
				UPLOAD_FOLDERS.getMediaVideos(findMedia.mediaFileName)
			);

		return await this.prismaService.media.update({
			where: { id },
			data: dto,
		});
	}

	async delete(id: Media['id']): Promise<void> {
		const findMedia: Media = await this.getFindByFields({ id });

		if (!findMedia) throw new NotFoundException('Media not found');

		await this.fileService.delete(
			UPLOAD_FOLDERS.getMediaFullPosters(findMedia.posterFullFileName)
		);

		await this.fileService.delete(
			UPLOAD_FOLDERS.getMediaPosters(findMedia.posterFileName)
		);

		await this.fileService.delete(
			UPLOAD_FOLDERS.getMediaVideos(findMedia.mediaFileName)
		);

		await this.prismaService.media.delete({
			where: { id },
		});
	}
}
