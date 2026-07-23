import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { TaskRequestDTO, TaskListItemDTO} from './task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByProject(projectId: string): Promise<TaskListItemDTO[]> {
    const tasks = await this.prisma.task.findMany({ where: { projectId } });

    if(!tasks){
      throw new InternalServerErrorException('Erro ao listar tarefas. Contate o suporte');
    }

    return tasks;
  }

  async findById(projectId: string, taskId: string): Promise<TaskListItemDTO> {
    const task = await this.prisma.task.findFirst({
      where: {
        projectId,
        id: taskId,
      },
    })

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada')
    }

    return task
  }

  async create(projectId: string, data: TaskRequestDTO): Promise<TaskListItemDTO> {
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

  async delete(projectId: string, taskId: string): Promise<TaskListItemDTO> {
    const existingTask = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
      },
    })

    if (!existingTask) {
      throw new NotFoundException('Tarefa não encontrada')
    }

    const deletedTask = await this.prisma.task.delete({
      where: {
        id: taskId,
        projectId,
      },
    })

    if (!deletedTask) {
      throw new InternalServerErrorException(
        'Tarefa não excluída. Contate o suporte',
      )
    }

    return deletedTask
  }
}
