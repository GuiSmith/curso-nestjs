import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProjectListItemDTO, ProjectRequestDTO, ProjectTaskDTO } from './projects.dto'

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ProjectListItemDTO[]> {
    const projects = await this.prisma.project.findMany()

    if (!projects) {
      throw new InternalServerErrorException(
        'Erro ao listar projetos. Contate o suporte',
      )
    }

    return projects
  }

  async findById(id: string): Promise<ProjectTaskDTO> {
    const project = await this.prisma.project.findFirst({
      where: { id },
      include: { tasks: true }
    })

    if (!project) {
      throw new NotFoundException('Projeto não encontrado')
    }

    return project
  }

  async create(data: ProjectRequestDTO): Promise<ProjectListItemDTO> {
    
    const fixedUserId = 'd8a0adab-4e91-4fd5-a974-0eb58c92129c';
    
    const project = await this.prisma.project.create({
      data: {
        ...data,
        createdById: fixedUserId,
      }
    });

    
    if (!project) {
      throw new InternalServerErrorException(
        'Erro ao criar projeto. Contate o suporte',
      )
    }
    
    const collaborator = await this.prisma.projectCollaborator.create({
      data: {
        projectId: project.id,
        userId: fixedUserId,
        ROLE: 'OWNER'
      }
    });

    if (!collaborator) {
      throw new InternalServerErrorException(
        'Erro ao criar collaborator. Contate o suporte',
      )
    }

    return project;
  }

  async update(id: string, data: ProjectRequestDTO): Promise<ProjectListItemDTO> {
    const existingProject = await this.prisma.project.findFirst({ where: { id }})

    if (!existingProject) {
      throw new NotFoundException('Projeto não encontrado')
    }

    const updatedProject = await this.prisma.project.update({ where: { id }, data })

    if (!updatedProject) {
      throw new InternalServerErrorException(
        'Projeto não atualizado. Contate o suporte',
      )
    }

    return updatedProject
  }

  async remove(id: string): Promise<ProjectListItemDTO> {
    const existingProject = await this.prisma.project.findFirst({ where: { id } })

    if (!existingProject) {
      throw new NotFoundException('Projeto não encontrado')
    }

    const deletedProject = await this.prisma.project.delete({ where: { id } })

    if (!deletedProject) {
      throw new InternalServerErrorException(
        'Projeto não excluído. Contate o suporte',
      )
    }

    return deletedProject
  }
}
