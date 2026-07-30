import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'
import { CollaboratorsModule } from '../collaborators/collaborators.module'
import { RequestContextService } from 'src/common/services/request-context.service'

@Module({
  imports: [CollaboratorsModule],
  controllers: [TasksController],
  providers: [TasksService, PrismaService, RequestContextService],
})
export class TasksModule {}
