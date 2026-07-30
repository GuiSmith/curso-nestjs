import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { TaskCommentDTO, TaskListItemDTO, TaskRequestDTO } from './task.dto';
import { paginate, paginateOutput } from 'src/common/utils/pagination.utils';
import { PaginatedResponseDTO, QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto';
import { CollaboratorsService } from '../collaborators/collaborators.service';
import { RequestContextService } from 'src/common/services/request-context.service';
import { COLLABORATOR_ROLE_EDITOR_KEY, COLLABORATOR_ROLE_VIEWER_KEY } from 'src/consts';

@Injectable()
export class TasksService {

  private readRole = COLLABORATOR_ROLE_VIEWER_KEY;
  private writeRole = COLLABORATOR_ROLE_EDITOR_KEY;

  constructor(
    private readonly prisma: PrismaService,
    private readonly collaboratorsService: CollaboratorsService,
    private readonly requestContext: RequestContextService,
  ) {}

  async findAllByProject(projectId: string, query?: QueryPaginationDTO): Promise<PaginatedResponseDTO<TaskListItemDTO>> {

    const currentAuthenticatedUser = this.requestContext.getUser();
    
    const hasPermission = await this.collaboratorsService.hasPermission(projectId, currentAuthenticatedUser.id, this.readRole);

    if(!hasPermission){
      throw new ForbiddenException();
    }
    
    const where = { projectId };

    const [project, tasks, total] = await Promise.all([
      this.prisma.project.findUnique({ where: { id: projectId } }),
      this.prisma.task.findMany({ ...paginate(query), where }),
      this.prisma.task.count({ where }),
    ]);
    
    if(!project){
      throw new NotFoundException('Project not found');
    }

    return paginateOutput<TaskListItemDTO>(tasks, total, query)
  }

  async findById(projectId: string, taskId: string): Promise<TaskCommentDTO> {

    const currentAuthenticatedUser = this.requestContext.getUser();
    
    const hasPermission = await this.collaboratorsService.hasPermission(projectId, currentAuthenticatedUser.id, this.readRole);

    if(!hasPermission){
      throw new ForbiddenException();
    }
    
    const task = await this.prisma.task.findFirst({
      where: {
        projectId,
        id: taskId,
      },
      include: {
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada')
    }

    return task
  }

  async create(projectId: string, data: TaskRequestDTO): Promise<TaskListItemDTO> {

    const currentAuthenticatedUser = this.requestContext.getUser();
    
    const hasPermission = await this.collaboratorsService.hasPermission(projectId, currentAuthenticatedUser.id, this.writeRole);

    if(!hasPermission){
      throw new ForbiddenException();
    }
    
    const project = await this.prisma.project.findFirst({ where: { id: projectId }});

    if(!project){
      throw new NotFoundException('Project not found');
    }
    
    const task = await this.prisma.task.create({
      data: {
        ...data,
        projectId,
      },
    })

    if (!task) {
      throw new InternalServerErrorException(
        'Erro ao criar tarefa. Contate o suporte',
      )
    }

    return task
  }

  async update(projectId: string, taskId: string, data: TaskRequestDTO): Promise<TaskListItemDTO> {

    const currentAuthenticatedUser = this.requestContext.getUser();
    
    const hasPermission = await this.collaboratorsService.hasPermission(projectId, currentAuthenticatedUser.id, this.writeRole);

    if(!hasPermission){
      throw new ForbiddenException();
    }
    
    const existingTask = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
      }
    });

    if (!existingTask) {
      throw new NotFoundException('Tarefa não encontrada')
    }

    const updatedTask = await this.prisma.task.update({
      where: {
        id: taskId,
        projectId,
      },
      data,
    });

    if (!updatedTask) {
      throw new InternalServerErrorException('Tarefa não atualizada. Contate o suporte');
    }

    return updatedTask;
  }
}
