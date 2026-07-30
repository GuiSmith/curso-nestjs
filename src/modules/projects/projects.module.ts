import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'
import { RequestContextService } from 'src/common/services/request-context.service'
import { CollaboratorsModule } from '../collaborators/collaborators.module'

@Module({
  imports: [CollaboratorsModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService, RequestContextService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
