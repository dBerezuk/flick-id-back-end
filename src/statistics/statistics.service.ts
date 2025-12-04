import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IStatistics } from './statistics.types';

@Injectable()
export class StatisticsService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAll() {
		const [userCreatesByDayLastWeek, totalUsers, totalAdminUsers] =
			await Promise.all([
				this.prismaService.$queryRaw<IStatistics[]>`
				SELECT 
					TO_CHAR(d.day, 'YYYY-MM-DD') AS date,
					COALESCE(COUNT(u.*)::int, 0) AS count
				FROM generate_series(
					CURRENT_DATE - INTERVAL '6 days',
					CURRENT_DATE,
					'1 day'
				)	AS d(day)
				LEFT JOIN "user" u
					ON DATE(u."created_at") = d.day
				GROUP BY d.day
				ORDER BY d.day;	
			`,
				this.prismaService.user.count(),
				this.prismaService.user.count({
					where: {
						isAdmin: true,
					},
				}),
			]);

		const [mediaCreatesByDayLastWeek, totalMedia] = await Promise.all([
			this.prismaService.$queryRaw<IStatistics[]>`
				SELECT 
					TO_CHAR(d.day, 'YYYY-MM-DD') AS date,
					COALESCE(COUNT(m.*)::int, 0) AS count
				FROM generate_series(
					CURRENT_DATE - INTERVAL '6 days',
					CURRENT_DATE,
					'1 day'
				)	AS d(day)
				LEFT JOIN "media" m
					ON DATE(m."created_at") = d.day
				GROUP BY d.day
				ORDER BY d.day;	
			`,
			this.prismaService.media.count(),
		]);

		return {
			users: {
				createsByDayLastWeek: userCreatesByDayLastWeek,
				totalUsers,
				totalAdminUsers,
			},
			media: {
				createsByDayLastWeek: mediaCreatesByDayLastWeek,
				totalMedia,
			},
		};
	}
}
