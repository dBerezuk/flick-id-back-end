import { Module } from '@nestjs/common';
import { FileModule } from 'src/file/file.module';
import { PrismaService } from 'src/prisma.service';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [FileModule],
	controllers: [ProfileController, UserController],
	providers: [ProfileService, UserService, PrismaService],
	exports: [UserService],
})
export class UserModule {}
