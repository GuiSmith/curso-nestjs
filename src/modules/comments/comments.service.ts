import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CommentFullDTO, CommentListItemDTO, CommentRequestDTO } from './comments.dto'
import { PaginatedResponseDTO, QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto'
import { paginate, paginateOutput } from 'src/common/utils/pagination.utils';
import { CollaboratorsService } from '../collaborators/collaborators.service';
import { RequestContextService } from 'src/common/services/request-context.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly collaboratorService: CollaboratorsService,
    private readonly requestContextService: RequestContextService,
  ) {}

  async findAllByTask(projectId: string, taskId: string, query?: QueryPaginationDTO): Promise<PaginatedResponseDTO<CommentListItemDTO>> {

    const task = await this.prisma.task.findFirst({ where: { projectId, id: taskId }});

    if(!task){
      throw new NotFoundException('Project not found');
    }

    const where = { taskId };
    const select = {
      id: true,
      content: true,
      taskId: true,
      authorId: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    };

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({ ...paginate(query), where, select }),
      this.prisma.comment.count({ where }),
    ]);

    return paginateOutput<CommentListItemDTO>(comments, total, query);
  }

  async findById(projectId: string, taskId: string, commentId: string): Promise<CommentFullDTO> {
    const comment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        taskId,
        task: { projectId },
      },
      select: {
        id: true,
        content: true,
        taskId: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
            projectId: true,
          },
        },
      },
    })

    if (!comment) {
      throw new NotFoundException('Comentário não encontrado')
    }

    return comment
  }

  async create(authorId: string, projectId: string, taskId: string, data: CommentRequestDTO): Promise<CommentListItemDTO> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, projectId },
    })

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada')
    }

    return this.prisma.comment.create({
      data: {
        ...data,
        taskId,
        authorId,
      },
      select: {
        id: true,
        content: true,
        taskId: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })
  }

  async update(projectId: string, taskId: string, commentId: string, data: CommentRequestDTO): Promise<CommentListItemDTO> {
    await this.findById(projectId, taskId, commentId)

    return this.prisma.comment.update({
      where: { id: commentId },
      data,
      select: {
        id: true,
        content: true,
        taskId: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })
  }

  async delete(projectId: string, taskId: string, commentId: string): Promise<CommentListItemDTO> {
    await this.findById(projectId, taskId, commentId)

    return this.prisma.comment.delete({
      where: { id: commentId },
      select: {
        id: true,
        content: true,
        taskId: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })
  }
}
