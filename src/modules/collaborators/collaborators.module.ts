import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CollaboratorsController } from './collaborators.controller'
import { CollaboratorsService } from './collaborators.service'
import { ProjectsModule } from '../projects/projects.module'
import { RequestContextService } from 'src/common/services/request-context.service'

@Module({
  imports: [ProjectsModule],
  controllers: [CollaboratorsController],
  providers: [CollaboratorsService, PrismaService, RequestContextService],
  exports: [CollaboratorsService],
})
export class CollaboratorsModule {}
