import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CommentFullDTO, CommentListItemDTO, CommentRequestDTO } from './comments.dto'

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByTask(projectId: string, taskId: string): Promise<CommentListItemDTO[]> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, projectId },
    })

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada')
    }

    return this.prisma.comment.findMany({
      where: { taskId },
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

  async create(projectId: string, taskId: string, data: CommentRequestDTO): Promise<CommentListItemDTO> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, projectId },
    })

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada')
    }

    const fixedUserId = 'd8a0adab-4e91-4fd5-a974-0eb58c92129c'

    return this.prisma.comment.create({
      data: {
        ...data,
        taskId,
        authorId: fixedUserId,
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
