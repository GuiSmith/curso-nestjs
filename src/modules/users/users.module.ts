import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { RequestContextService } from 'src/common/services/request-context.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, RequestContextService],
  exports: [UsersService],
})
export class UsersModule {}
