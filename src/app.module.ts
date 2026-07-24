import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ProjectsModule } from './modules/projects/projects.module'
import { PrismaService } from './prisma.service'
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';
import { CollaboratorsModule } from './modules/collaborators/collaborators.module';
import { CommentsModule } from './modules/comments/comments.module';

@Module({
  imports: [ProjectsModule, TasksModule, UsersModule, CollaboratorsModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
