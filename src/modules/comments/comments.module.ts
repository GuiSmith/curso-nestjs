import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PrismaService } from 'src/prisma.service';
import { CollaboratorsModule } from '../collaborators/collaborators.module';
import { RequestContextService } from 'src/common/services/request-context.service';

@Module({
  imports: [CollaboratorsModule],
  controllers: [CommentsController],
  providers: [CommentsService, PrismaService, RequestContextService]
})
export class CommentsModule {}
